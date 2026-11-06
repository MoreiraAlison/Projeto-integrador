const supabase = require("../database");
const usuarioModel = require("./modeloUsuario");

const campos = `*, profissionais(usuarios(nome,cargo)), alunos(nome,turma,serie), usuarios(nome,email)`;

// Localiza o registro de disponibilidade correspondente ao agendamento.
async function buscarHorario(profissionalId, dia, horario) {
  const { data, error } = await supabase
    .from("disponibilidade")
    .select("id, reservado")
    .eq("id_funcionario", profissionalId)
    .eq("dia", dia)
    .eq("horario", horario)
    .maybeSingle();

  if (error) throw error;

  return data;
}

// Altera a reserva usando o estado esperado para evitar
// sobrescrever uma alteração feita por outra pessoa.
async function alterarReserva(profissionalId, dia, horario, reservar) {
  const disponibilidade = await buscarHorario(profissionalId, dia, horario);

  if (!disponibilidade) {
    throw new Error(
      "O horário não foi encontrado na disponibilidade do profissional.",
    );
  }

  if (disponibilidade.reservado === reservar) {
    return disponibilidade;
  }

  const { data, error } = await supabase
    .from("disponibilidade")
    .update({ reservado: reservar })
    .eq("id", disponibilidade.id)
    .eq("reservado", !reservar)
    .select("id, reservado")
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    throw new Error(
      reservar
        ? "Esse horário acabou de ser reservado por outra pessoa. Escolha outro horário."
        : "Não foi possível liberar o horário. Atualize a página e tente novamente.",
    );
  }

  return data;
}

// Libera o horário associado ao agendamento.
async function liberarHorarioDoAgendamento(agendamento) {
  if (!agendamento) return;

  // O horário pertence ao id_profissional.
  // Para agendamentos antigos, usa id_usuario como fallback.
  const profissionalId = agendamento.id_profissional || agendamento.id_usuario;

  await alterarReserva(
    profissionalId,
    agendamento.data_agendamento,
    agendamento.horario,
    false,
  );
}

const agendamentoModel = {
  async listar() {
    const { data, error } = await supabase
      .from("agendamento")
      .select(campos)
      .order("data_agendamento", { ascending: true })
      .order("horario", { ascending: true });

    if (error) throw error;

    return data;
  },

  async buscarPorId(id) {
    const { data, error } = await supabase
      .from("agendamento")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    return data;
  },

  async listarPorUsuario(id) {
    const { data, error } = await supabase
      .from("agendamento")
      .select(
        `
        id,
        id_usuario,
        id_profissional,
        status,
        data_agendamento,
        horario,
        motivo,
        usuario:id_usuario (
          id,
          nome
        ),
        usuario_agendamento!inner (
          id_usuario
        )
      `,
      )
      .eq("usuario_agendamento.id_usuario", id)
      .order("data_agendamento");

    if (error) throw error;

    return data;
  },

  async listarAgendamentosRecebidos(id) {
    const { data, error } = await supabase
      .from("agendamento")
      .select(
        `
        id,
        id_usuario,
        id_profissional,
        status,
        data_agendamento,
        horario,
        motivo,
        usuario!agendamento_id_usuario_fkey (
          id,
          nome
        ),
        usuario_agendamento!inner (
          usuario!usuario_agendamento_id_usuario_fkey (
            id,
            nome
          )
        )
      `,
      )
      .eq("id_usuario", id)
      .order("data_agendamento", {
        ascending: true,
      });

    if (error) throw error;

    return data;
  },

  async listarPorProfissional(id) {
    const { data, error } = await supabase
      .from("agendamento")
      .select(campos)
      .eq("id_profissional", id)
      .order("data_agendamento")
      .order("horario");

    if (error) throw error;

    return data;
  },

  // CRIAR AGENDAMENTO
  async criar(dados) {
    /*
      Fluxo normal:
      id_usuario       = profissional que recebe
      id_profissional  = profissional dono do horário
      solicitante_id   = aluno/responsável que solicitou

      Fluxo profissional:
      id_usuario       = responsável que recebe
      id_profissional  = profissional logado/dono do horário
      solicitante_id   = profissional que solicitou
    */

    const profissionalId = dados.id_profissional || dados.profissional_id;

    const destinatarioId = dados.id_usuario;

    const solicitanteId = dados.solicitante_id || dados.id_usuario;

    if (
      !profissionalId ||
      !destinatarioId ||
      !dados.data_agendamento ||
      !dados.horario ||
      !solicitanteId
    ) {
      throw new Error(
        "Informe o profissional, a data, o horário e os usuários envolvidos.",
      );
    }

    // Reserva primeiro.
    await alterarReserva(
      profissionalId,
      dados.data_agendamento,
      dados.horario,
      true,
    );

    const { data: agendamento, error: erroAgendamento } = await supabase
      .from("agendamento")
      .insert([
        {
          // Pessoa que receberá o agendamento.
          id_usuario: destinatarioId,

          // Profissional dono do horário.
          id_profissional: profissionalId,

          status: dados.status || "Aguardando",
          data_agendamento: dados.data_agendamento,
          horario: dados.horario,
          motivo: dados.motivo,
          data_criacao: dados.data_criacao,
        },
      ])
      .select()
      .single();

    if (erroAgendamento) {
      await alterarReserva(
        profissionalId,
        dados.data_agendamento,
        dados.horario,
        false,
      );

      throw erroAgendamento;
    }

    const { data: usuarioAgendamento, error: erroUsuarioAgendamento } =
      await supabase
        .from("usuario_agendamento")
        .insert([
          {
            // Quem fez/solicitou o agendamento.
            id_usuario: solicitanteId,

            id_agendamento: agendamento.id,
          },
        ])
        .select()
        .single();

    if (erroUsuarioAgendamento) {
      await supabase.from("agendamento").delete().eq("id", agendamento.id);

      await alterarReserva(
        profissionalId,
        dados.data_agendamento,
        dados.horario,
        false,
      );

      throw erroUsuarioAgendamento;
    }

    return {
      agendamento,
      usuarioAgendamento,
    };
  },

  // EDITAR AGENDAMENTO
  async atualizar(id, dados) {
    const agendamentoAtual = await agendamentoModel.buscarPorId(id);

    if (!agendamentoAtual) return null;

    // Profissional dono do horário.
    const profissionalAtual =
      agendamentoAtual.id_profissional || agendamentoAtual.id_usuario;

    const profissionalNovo =
      dados.id_profissional ?? dados.profissional_id ?? profissionalAtual;

    // Pessoa que receberá o agendamento.
    const destinatarioNovo = dados.id_usuario ?? agendamentoAtual.id_usuario;

    const dataNova =
      dados.data_agendamento ?? agendamentoAtual.data_agendamento;

    const horarioNovo = dados.horario ?? agendamentoAtual.horario;

    const mudouHorario =
      String(profissionalNovo) !== String(profissionalAtual) ||
      String(dataNova).slice(0, 10) !==
        String(agendamentoAtual.data_agendamento).slice(0, 10) ||
      String(horarioNovo).slice(0, 5) !==
        String(agendamentoAtual.horario).slice(0, 5);

    // Se mudou o horário/profissional, reserva o novo
    // antes de liberar o anterior.
    if (mudouHorario) {
      await alterarReserva(profissionalNovo, dataNova, horarioNovo, true);
    }

    const { profissional_id, solicitante_id, id_profissional, ...outrosDados } =
      dados;

    const { data, error } = await supabase
      .from("agendamento")
      .update({
        ...outrosDados,

        // Pessoa que receberá o agendamento.
        id_usuario: destinatarioNovo,

        // Profissional dono do horário.
        id_profissional: profissionalNovo,

        data_agendamento: dataNova,
        horario: horarioNovo,
      })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error || !data) {
      if (mudouHorario) {
        await alterarReserva(profissionalNovo, dataNova, horarioNovo, false);
      }

      if (error) throw error;

      return null;
    }

    if (mudouHorario) {
      try {
        await alterarReserva(
          profissionalAtual,
          agendamentoAtual.data_agendamento,
          agendamentoAtual.horario,
          false,
        );
      } catch (erro) {
        // Reverte o agendamento.
        await supabase
          .from("agendamento")
          .update({
            id_usuario: agendamentoAtual.id_usuario,
            id_profissional: profissionalAtual,
            data_agendamento: agendamentoAtual.data_agendamento,
            horario: agendamentoAtual.horario,
          })
          .eq("id", id);

        // Libera o novo horário.
        await alterarReserva(profissionalNovo, dataNova, horarioNovo, false);

        throw erro;
      }
    }

    return data;
  },

  // CANCELAR AGENDAMENTO
  async cancelar(id, dados) {
    const agendamentoAtual = await agendamentoModel.buscarPorId(id);

    if (!agendamentoAtual) return null;

    const { data, error } = await supabase
      .from("agendamento")
      .update(dados)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    try {
      await liberarHorarioDoAgendamento(agendamentoAtual);
    } catch (erro) {
      await supabase
        .from("agendamento")
        .update({
          status: agendamentoAtual.status,
        })
        .eq("id", id);

      throw erro;
    }

    return {
      status: data.status,
    };
  },

  // RECUSAR AGENDAMENTO
  async recusar(id, dados) {
    const agendamentoAtual = await agendamentoModel.buscarPorId(id);

    if (!agendamentoAtual) return null;

    const { data, error } = await supabase
      .from("agendamento")
      .update(dados)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    try {
      await liberarHorarioDoAgendamento(agendamentoAtual);
    } catch (erro) {
      await supabase
        .from("agendamento")
        .update({
          status: agendamentoAtual.status,
        })
        .eq("id", id);

      throw erro;
    }

    return {
      status: data.status,
    };
  },

  // CONFIRMAR AGENDAMENTO
  async confirmar(id, dados) {
    const { data, error } = await supabase
      .from("agendamento")
      .update(dados)
      .eq("id", id)
      .select("status")
      .maybeSingle();

    if (error) throw error;

    return data;
  },

  // EXCLUIR AGENDAMENTO
  async deletar(id) {
    const agendamentoAtual = await agendamentoModel.buscarPorId(id);

    if (!agendamentoAtual) return false;

    const { data, error } = await supabase
      .from("agendamento")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return false;
    }

    await liberarHorarioDoAgendamento(agendamentoAtual);

    return true;
  },
};

module.exports = agendamentoModel;
