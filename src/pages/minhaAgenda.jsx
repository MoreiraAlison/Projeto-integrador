import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "./minhaAgenda.css";
import { useAutenticador } from "../context/AutenticadorContexto";
import { api } from "../services/api";

const diasPadrao = [
  { id: 1, nome: "Segunda-feira" },
  { id: 2, nome: "Terça-feira" },
  { id: 3, nome: "Quarta-feira" },
  { id: 4, nome: "Quinta-feira" },
  { id: 5, nome: "Sexta-feira" },
];

function formatarData(data) {
  if (!(data instanceof Date) || Number.isNaN(data.getTime())) {
    return "";
  }

  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function obterDataLocal(valor) {
  if (typeof valor !== "string") return new Date(NaN);

  const partes = valor.slice(0, 10).split("-").map(Number);

  if (partes.length !== 3 || partes.some(Number.isNaN)) {
    return new Date(NaN);
  }

  const [ano, mes, dia] = partes;
  return new Date(ano, mes - 1, dia);
}

function obterInicioSemana(data) {
  const inicio = new Date(data);
  const diaSemana = inicio.getDay();
  const diferenca = diaSemana === 0 ? -6 : 1 - diaSemana;

  inicio.setDate(inicio.getDate() + diferenca);
  inicio.setHours(0, 0, 0, 0);

  return inicio;
}

function adicionarDias(data, quantidade) {
  const novaData = new Date(data);
  novaData.setDate(novaData.getDate() + quantidade);
  return novaData;
}

function formatarDataExibicao(data) {
  return data.toLocaleDateString("pt-BR");
}

function obterHorario(valor) {
  return String(valor || "").slice(0, 5);
}

function criarDadosIniciais() {
  return {
    indisponibilidades: [],
  };
}

// Calcula a data da Páscoa para identificar os feriados móveis.
function obterPascoa(ano) {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);

  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(ano, mes - 1, dia);
}

// Feriados nacionais e datas móveis consideradas no sistema.
function obterFeriados(ano) {
  const feriados = [
    `${ano}-01-01`,
    `${ano}-04-21`,
    `${ano}-05-01`,
    `${ano}-09-07`,
    `${ano}-10-12`,
    `${ano}-11-02`,
    `${ano}-11-15`,
    `${ano}-11-20`,
    `${ano}-12-25`,
  ];

  const pascoa = obterPascoa(ano);
  const sextaSanta = adicionarDias(pascoa, -2);
  const corpusChristi = adicionarDias(pascoa, 60);

  feriados.push(formatarData(sextaSanta));
  feriados.push(formatarData(corpusChristi));

  return feriados;
}

function verificarFeriado(data) {
  return obterFeriados(data.getFullYear()).includes(formatarData(data));
}

function MinhaAgenda() {
  const navigate = useNavigate();
  const { usuario, logout } = useAutenticador();

  const [registrosBanco, setRegistrosBanco] = useState([]);
  const [agendaEdicao, setAgendaEdicao] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [dados, setDados] = useState(criarDadosIniciais);

  const [semanaInicio, setSemanaInicio] = useState(() =>
    obterInicioSemana(new Date()),
  );

  const [novosHorarios, setNovosHorarios] = useState({});
  const [novaIndisponibilidade, setNovaIndisponibilidade] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const chaveStorage = usuario?.id ? `agenda_profissional_${usuario.id}` : null;

  const chaveSemana = formatarData(semanaInicio);
  const semanaAtualChave = formatarData(obterInicioSemana(new Date()));

  const datasDaSemana = Array.from({ length: 5 }, (_, indice) =>
    adicionarDias(semanaInicio, indice),
  );

  // Busca os horários cadastrados no banco para o profissional logado.
  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }

    if (usuario?.tipo_usuario?.tipo !== "Profissional") {
      navigate("/inicio");
      return;
    }

    if (!usuario.id) {
      setErro("Não foi possível identificar o profissional logado.");
      setCarregando(false);
      return;
    }

    let ativo = true;

    async function carregarDisponibilidades() {
      try {
        setCarregando(true);
        setErro("");

        const resultado = await api.disponibilidade(usuario.id);

        if (!Array.isArray(resultado)) {
          throw new Error(
            "A resposta da API de disponibilidade não está no formato esperado.",
          );
        }

        const registrosNormalizados = resultado.map((registro) => ({
          id: registro.id,
          id_funcionario: registro.id_funcionario,
          dia: String(registro.dia).slice(0, 10),
          horario: obterHorario(registro.horario),
        }));

        if (ativo) {
          setRegistrosBanco(registrosNormalizados);
        }
      } catch (e) {
        console.error("Erro ao carregar disponibilidades:", e);

        if (ativo) {
          setErro(
            e.message || "Não foi possível carregar os horários cadastrados.",
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarDisponibilidades();

    return () => {
      ativo = false;
    };
  }, [usuario, navigate]);

  // Carrega somente as indisponibilidades manuais do localStorage.
  useEffect(() => {
    if (!chaveStorage) return;

    try {
      const dadosSalvos = localStorage.getItem(chaveStorage);

      if (!dadosSalvos) {
        setDados(criarDadosIniciais());
        return;
      }

      const dadosConvertidos = JSON.parse(dadosSalvos);

      setDados({
        indisponibilidades: Array.isArray(dadosConvertidos.indisponibilidades)
          ? dadosConvertidos.indisponibilidades
          : [],
      });
    } catch (e) {
      console.error("Erro ao carregar indisponibilidades:", e);
      setDados(criarDadosIniciais());
    }
  }, [chaveStorage]);

  // Retorna os horários da data selecionada, considerando as edições locais.
  const obterDadosDoDia = (data) => {
    const dataFormatada = formatarData(data);

    if (agendaEdicao[dataFormatada]) {
      return agendaEdicao[dataFormatada];
    }

    const registrosDoDia = registrosBanco
      .filter((registro) => registro.dia === dataFormatada)
      .sort((a, b) => a.horario.localeCompare(b.horario));

    return {
      ativo: registrosDoDia.length > 0,
      horarios: registrosDoDia.map((registro) => registro.horario),
    };
  };

  const atualizarDia = (data, novosDados) => {
    const dataFormatada = formatarData(data);

    setAgendaEdicao((atual) => ({
      ...atual,
      [dataFormatada]: novosDados,
    }));

    setMensagem("");
    setErro("");
  };

  const handleLogout = () => {
    if (confirm("Deseja sair?")) {
      logout();
      navigate("/login");
    }
  };

  const handleNotifications = () => {
    alert("Notificações");
  };

  const handleToggleDia = (data) => {
    const dia = obterDadosDoDia(data);

    atualizarDia(data, {
      ...dia,
      ativo: !dia.ativo,
    });
  };

  const handleNovoHorario = (data, valor) => {
    const dataFormatada = formatarData(data);

    setNovosHorarios((atuais) => ({
      ...atuais,
      [dataFormatada]: valor,
    }));
  };

  const handleAdicionarHorario = (data) => {
    const dataFormatada = formatarData(data);
    const horario = novosHorarios[dataFormatada];

    if (!horario) {
      alert("Selecione um horário.");
      return;
    }

    const dia = obterDadosDoDia(data);

    if (dia.horarios.includes(horario)) {
      alert("Esse horário já foi adicionado.");
      return;
    }

    atualizarDia(data, {
      ativo: true,
      horarios: [...dia.horarios, horario].sort(),
    });

    setNovosHorarios((atuais) => ({
      ...atuais,
      [dataFormatada]: "",
    }));
  };

  const handleRemoverHorario = (data, horarioRemover) => {
    const dia = obterDadosDoDia(data);

    atualizarDia(data, {
      ...dia,
      horarios: dia.horarios.filter((horario) => horario !== horarioRemover),
    });
  };

  const handleAdicionarIndisponibilidade = () => {
    if (!novaIndisponibilidade) {
      alert("Selecione uma data.");
      return;
    }

    const dataSelecionada = obterDataLocal(novaIndisponibilidade);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dataSelecionada < hoje) {
      alert("Não é possível cadastrar uma data que já passou.");
      return;
    }

    if (dados.indisponibilidades.includes(novaIndisponibilidade)) {
      alert("Essa data já está cadastrada como indisponível.");
      return;
    }

    setDados((dadosAtuais) => ({
      ...dadosAtuais,
      indisponibilidades: [
        ...dadosAtuais.indisponibilidades,
        novaIndisponibilidade,
      ].sort(),
    }));

    setNovaIndisponibilidade("");
    setMensagem("");
    setErro("");
  };

  const handleRemoverIndisponibilidade = (data) => {
    setDados((dadosAtuais) => ({
      ...dadosAtuais,
      indisponibilidades: dadosAtuais.indisponibilidades.filter(
        (item) => item !== data,
      ),
    }));

    setMensagem("");
    setErro("");
  };

  const handleMudarSemana = (quantidade) => {
    const novaSemana = adicionarDias(semanaInicio, quantidade * 7);

    if (formatarData(novaSemana) < semanaAtualChave) {
      return;
    }

    setSemanaInicio(novaSemana);
    setNovosHorarios({});
    setMensagem("");
    setErro("");
  };

  // Salva no Supabase somente quando o profissional confirma.
  const handleSalvar = async () => {
    if (!usuario?.id || salvando) return;

    try {
      setSalvando(true);
      setMensagem("");
      setErro("");

      const inicio = formatarData(semanaInicio);
      const fim = formatarData(adicionarDias(semanaInicio, 4));

      const registrosDaSemana = registrosBanco.filter(
        (registro) => registro.dia >= inicio && registro.dia <= fim,
      );

      const exclusoes = [];
      const insercoes = [];

      datasDaSemana.forEach((data) => {
        const dataFormatada = formatarData(data);

        const feriado = verificarFeriado(data);
        const indisponibilidadeManual =
          dados.indisponibilidades.includes(dataFormatada);

        // Dias bloqueados não são alterados por esta tela.
        if (feriado || indisponibilidadeManual) return;

        const diaEditado = obterDadosDoDia(data);

        const horariosDesejados = diaEditado.ativo
          ? [...new Set(diaEditado.horarios)]
          : [];

        const registrosExistentes = registrosDaSemana.filter(
          (registro) => registro.dia === dataFormatada,
        );

        const horariosExistentes = registrosExistentes.map(
          (registro) => registro.horario,
        );

        // Identifica registros que precisam ser removidos.
        registrosExistentes.forEach((registro) => {
          if (!horariosDesejados.includes(registro.horario)) {
            exclusoes.push(registro.id);
          }
        });

        // Identifica horários que precisam ser inseridos.
        horariosDesejados.forEach((horario) => {
          if (!horariosExistentes.includes(horario)) {
            insercoes.push({
              id_funcionario: usuario.id,
              dia: dataFormatada,
              horario,
            });
          }
        });
      });

      // Executa as exclusões.
      for (const id of exclusoes) {
        await api.excluirDisponibilidade(id);
      }

      // Executa as inserções.
      for (const disponibilidade of insercoes) {
        await api.criarDisponibilidade(disponibilidade);
      }

      // Atualiza os dados com a resposta atual do banco.
      const resultadoAtualizado = await api.disponibilidade(usuario.id);

      if (!Array.isArray(resultadoAtualizado)) {
        throw new Error(
          "Não foi possível confirmar os horários salvos no banco.",
        );
      }

      const registrosAtualizados = resultadoAtualizado.map((registro) => ({
        id: registro.id,
        id_funcionario: registro.id_funcionario,
        dia: String(registro.dia).slice(0, 10),
        horario: obterHorario(registro.horario),
      }));

      setRegistrosBanco(registrosAtualizados);
      setAgendaEdicao({});

      // As indisponibilidades manuais continuam no armazenamento local.
      if (chaveStorage) {
        localStorage.setItem(
          chaveStorage,
          JSON.stringify({
            indisponibilidades: dados.indisponibilidades,
          }),
        );
      }

      setMensagem("Agenda salva com sucesso!");
    } catch (e) {
      console.error("Erro ao salvar agenda:", e);

      setErro(
        e.message ||
          "Não foi possível salvar as alterações. Verifique a conexão com o servidor.",
      );

      // Tenta atualizar a tela com o que realmente ficou no banco.
      try {
        const resultadoAtualizado = await api.disponibilidade(usuario.id);

        if (Array.isArray(resultadoAtualizado)) {
          setRegistrosBanco(
            resultadoAtualizado.map((registro) => ({
              id: registro.id,
              id_funcionario: registro.id_funcionario,
              dia: String(registro.dia).slice(0, 10),
              horario: obterHorario(registro.horario),
            })),
          );
        }
      } catch (erroAtualizacao) {
        console.error(
          "Erro ao atualizar horários após falha:",
          erroAtualizacao,
        );
      }
    } finally {
      setSalvando(false);
    }
  };

  if (!usuario || usuario?.tipo_usuario?.tipo !== "Profissional") {
    return null;
  }

  const indisponibilidadesDaSemana = dados.indisponibilidades.filter((data) => {
    const dataObj = obterDataLocal(data);

    return dataObj >= semanaInicio && dataObj <= adicionarDias(semanaInicio, 4);
  });

  return (
    <Layout
      usuario={usuario}
      onLogout={handleLogout}
      onNotifications={handleNotifications}
    >
      <div className="minha-agenda-container">
        <div className="minha-agenda-cabecalho">
          <button
            className="btn-voltar-agenda"
            onClick={() => navigate("/inicio")}
          >
            <i className="fa-solid fa-arrow-left"></i>
            Voltar
          </button>

          <h2>Minha agenda</h2>

          <p>Configure seus dias e horários disponíveis para cada semana.</p>
        </div>

        <div className="agenda-semana">
          <button
            type="button"
            onClick={() => handleMudarSemana(-1)}
            disabled={chaveSemana === semanaAtualChave}
            title="Semana anterior"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <div className="agenda-semana-info">
            <strong>
              {formatarDataExibicao(semanaInicio)} até{" "}
              {formatarDataExibicao(adicionarDias(semanaInicio, 4))}
            </strong>

            <span>
              {chaveSemana === semanaAtualChave
                ? "Semana atual"
                : "Semana futura"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleMudarSemana(1)}
            title="Próxima semana"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        <div className="agenda-aviso">
          <i className="fa-solid fa-circle-info"></i>
          As alterações realizadas são específicas da semana selecionada.
        </div>

        {carregando ? (
          <div className="agenda-aviso">
            <i className="fa-solid fa-spinner fa-spin"></i>
            Carregando horários...
          </div>
        ) : (
          <>
            {erro && (
              <div className="agenda-aviso">
                <i className="fa-solid fa-circle-exclamation"></i>
                {erro}
              </div>
            )}

            <div className="agenda-lista">
              {diasPadrao.map((dia, indice) => {
                const dataDoDia = datasDaSemana[indice];

                if (!dataDoDia) return null;

                const dataFormatada = formatarData(dataDoDia);
                const dadosDoDia = obterDadosDoDia(dataDoDia);

                const feriado = verificarFeriado(dataDoDia);

                const indisponibilidadeManual =
                  dados.indisponibilidades.includes(dataFormatada);

                const estaIndisponivel = feriado || indisponibilidadeManual;

                return (
                  <div
                    className={`agenda-dia ${
                      estaIndisponivel ? "agenda-dia-bloqueado" : ""
                    }`}
                    key={dia.id}
                  >
                    <div className="agenda-dia-cabecalho">
                      <div className="agenda-dia-nome">
                        <h3>{dia.nome}</h3>

                        <span>{formatarDataExibicao(dataDoDia)}</span>

                        {feriado ? (
                          <span className="agenda-status-bloqueado">
                            <i className="fa-solid fa-calendar-xmark"></i>
                            Feriado — indisponível automaticamente
                          </span>
                        ) : indisponibilidadeManual ? (
                          <span className="agenda-status-bloqueado">
                            <i className="fa-solid fa-ban"></i>
                            Indisponível nesta data
                          </span>
                        ) : (
                          <span>
                            {dadosDoDia.ativo ? "Disponível" : "Indisponível"}
                          </span>
                        )}
                      </div>

                      {!estaIndisponivel && (
                        <label className="agenda-switch">
                          <input
                            type="checkbox"
                            checked={dadosDoDia.ativo}
                            onChange={() => handleToggleDia(dataDoDia)}
                          />
                          <span className="agenda-switch-slider"></span>
                        </label>
                      )}
                    </div>

                    {!estaIndisponivel && dadosDoDia.ativo && (
                      <div className="agenda-horarios">
                        <p className="agenda-horarios-titulo">
                          Horários disponíveis
                        </p>

                        <div className="agenda-horarios-lista">
                          {dadosDoDia.horarios.length > 0 ? (
                            dadosDoDia.horarios.map((horario) => (
                              <div className="agenda-horario" key={horario}>
                                <span>{horario}</span>

                                <button
                                  type="button"
                                  title="Remover horário"
                                  onClick={() =>
                                    handleRemoverHorario(dataDoDia, horario)
                                  }
                                >
                                  <i className="fa-solid fa-xmark"></i>
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="agenda-sem-horarios">
                              Nenhum horário adicionado.
                            </p>
                          )}
                        </div>

                        <div className="agenda-adicionar-horario">
                          <input
                            type="time"
                            value={novosHorarios[dataFormatada] || ""}
                            onChange={(e) =>
                              handleNovoHorario(dataDoDia, e.target.value)
                            }
                          />

                          <button
                            type="button"
                            onClick={() => handleAdicionarHorario(dataDoDia)}
                          >
                            <i className="fa-solid fa-plus"></i>
                            Adicionar horário
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        <section className="agenda-indisponibilidades">
          <h3>
            <i className="fa-solid fa-calendar-xmark"></i>
            Indisponibilidades futuras
          </h3>

          <p>
            Informe antecipadamente os dias em que não poderá atender. Eles
            serão bloqueados na semana correspondente.
          </p>

          <div className="agenda-adicionar-indisponibilidade">
            <input
              type="date"
              min={formatarData(new Date())}
              value={novaIndisponibilidade}
              onChange={(e) => setNovaIndisponibilidade(e.target.value)}
            />

            <button type="button" onClick={handleAdicionarIndisponibilidade}>
              <i className="fa-solid fa-plus"></i>
              Adicionar data
            </button>
          </div>

          <div className="agenda-indisponibilidades-lista">
            {dados.indisponibilidades.length > 0 ? (
              dados.indisponibilidades
                .slice()
                .sort()
                .map((data) => {
                  const dataObj = obterDataLocal(data);

                  return (
                    <div className="agenda-indisponibilidade-item" key={data}>
                      <div>
                        <strong>{formatarDataExibicao(dataObj)}</strong>

                        <span>
                          {dataObj.toLocaleDateString("pt-BR", {
                            weekday: "long",
                          })}
                        </span>
                      </div>

                      <button
                        type="button"
                        title="Remover indisponibilidade"
                        onClick={() => handleRemoverIndisponibilidade(data)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  );
                })
            ) : (
              <p className="agenda-sem-indisponibilidades">
                Nenhuma indisponibilidade futura cadastrada.
              </p>
            )}
          </div>
        </section>

        <div className="agenda-acoes">
          {mensagem && (
            <p className="agenda-mensagem">
              <i className="fa-solid fa-circle-check"></i>
              {mensagem}
            </p>
          )}

          <button
            className="btn-salvar-agenda"
            onClick={handleSalvar}
            disabled={carregando || salvando}
          >
            <i
              className={`fa-solid ${
                salvando ? "fa-spinner fa-spin" : "fa-floppy-disk"
              }`}
            ></i>
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default MinhaAgenda;
