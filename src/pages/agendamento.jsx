import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";
import "./agendamento.css";
import { api } from "../services/api";

function formatarDataLocal(data) {
  const [ano, mes, dia] = data.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

function obterDataString(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function obterInicioSemana(data) {
  const inicio = new Date(data);
  const diaSemana = inicio.getDay();

  inicio.setDate(inicio.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));

  inicio.setHours(0, 0, 0, 0);

  return inicio;
}

function formatarDataExibicao(data) {
  return formatarDataLocal(data).toLocaleDateString("pt-BR");
}

function Agendamento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);

  const [profissionais, setProfissionais] = useState([]);

  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null);

  const [profissionalHorarioId, setProfissionalHorarioId] = useState(null);

  const [disponibilidades, setDisponibilidades] = useState([]);

  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horaSelecionada, setHoraSelecionada] = useState(null);

  const [motivo, setMotivo] = useState("");

  const [dias, setDias] = useState([]);
  const [horarios, setHorarios] = useState([]);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const [pesquisaPessoa, setPesquisaPessoa] = useState("");
  const [seletorAberto, setSeletorAberto] = useState(false);

  const seletorRef = useRef(null);

  const ehProfissional = usuario?.tipo_usuario?.tipo === "Profissional";

  useEffect(() => {
    const handleClickFora = (event) => {
      if (seletorRef.current && !seletorRef.current.contains(event.target)) {
        setSeletorAberto(false);
      }
    };

    document.addEventListener("mousedown", handleClickFora);

    return () => {
      document.removeEventListener("mousedown", handleClickFora);
    };
  }, []);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("usuario"));

    if (!dados) {
      navigate("/login");
      return;
    }

    setUsuario(dados);

    const carregarDados = async () => {
      try {
        let listaPessoas = [];

        if (dados?.tipo_usuario?.tipo === "Profissional") {
          const usuarios = await api.usuarios();

          listaPessoas = usuarios.filter(
            (item) => item?.tipo_usuario?.tipo === "Responsável",
          );
        } else {
          listaPessoas = await api.profissionais();
        }

        // Ordena todos os usuários pelo nome em ordem alfabética
        listaPessoas.sort((a, b) =>
          String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR", {
            sensitivity: "base",
          }),
        );

        setProfissionais(listaPessoas);

        if (id) {
          const registro = await api.buscarAgendamento(id);

          setMotivo(registro.motivo || "");

          const dataRegistro = String(registro.data_agendamento).slice(0, 10);

          const horaRegistro = String(registro.horario).slice(0, 5);

          if (dados?.tipo_usuario?.tipo === "Profissional") {
            const responsavel = listaPessoas.find(
              (pessoa) => String(pessoa.id) === String(registro.id_usuario),
            );

            if (responsavel) {
              setProfissionalSelecionado(responsavel);
              setPesquisaPessoa(responsavel.nome || "");
            }

            setProfissionalHorarioId(dados.id);

            await carregarDisponibilidades(
              dados.id,
              dataRegistro,
              horaRegistro,
            );
          } else {
            const profissionalId =
              registro.id_profissional ||
              registro.profissional_id ||
              registro.id_usuario;

            const profissional = listaPessoas.find(
              (pessoa) => String(pessoa.id) === String(profissionalId),
            );

            if (profissional) {
              setProfissionalSelecionado(profissional);
              setPesquisaPessoa(profissional.nome || "");
            }

            setProfissionalHorarioId(profissionalId);

            await carregarDisponibilidades(
              profissionalId,
              dataRegistro,
              horaRegistro,
            );
          }
        } else {
          if (dados?.tipo_usuario?.tipo === "Profissional") {
            setProfissionalHorarioId(dados.id);

            await carregarDisponibilidades(dados.id);
          }
        }
      } catch (e) {
        console.error(e);
        alert(e.message);
      }
    };

    carregarDados();
  }, [navigate, id]);

  const carregarDisponibilidades = async (
    profissionalId,
    dataEdicao = null,
    horarioEdicao = null,
  ) => {
    try {
      setCarregando(true);

      const resultado = await api.disponibilidade(profissionalId);

      if (!Array.isArray(resultado)) {
        throw new Error("Não foi possível carregar as disponibilidades.");
      }

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const inicioSemana = dataEdicao
        ? obterInicioSemana(formatarDataLocal(dataEdicao))
        : obterInicioSemana(hoje);

      const fimSemana = new Date(inicioSemana);

      fimSemana.setDate(fimSemana.getDate() + 4);

      const inicioString = obterDataString(inicioSemana);

      const fimString = obterDataString(fimSemana);

      const hojeString = obterDataString(hoje);

      const disponibilidadesFiltradas = resultado
        .map((item) => ({
          ...item,
          dia: String(item.dia).slice(0, 10),
          horario: String(item.horario).slice(0, 5),
        }))
        .filter((item) => {
          const ehHorarioOriginal =
            dataEdicao &&
            item.dia === dataEdicao &&
            item.horario === String(horarioEdicao).slice(0, 5);

          const estaDisponivel = item.reservado === false;

          const dataValida =
            item.dia >= inicioString &&
            item.dia <= fimString &&
            (item.dia >= hojeString || item.dia === dataEdicao);

          return dataValida && (estaDisponivel || ehHorarioOriginal);
        })
        .sort((a, b) => {
          if (a.dia !== b.dia) {
            return a.dia.localeCompare(b.dia);
          }

          return a.horario.localeCompare(b.horario);
        });

      setDisponibilidades(disponibilidadesFiltradas);

      const datasDisponiveis = [
        ...new Set(disponibilidadesFiltradas.map((item) => item.dia)),
      ];

      setDias(datasDisponiveis);

      if (dataEdicao) {
        setDataSelecionada(dataEdicao);

        const horariosDaData = disponibilidadesFiltradas
          .filter((item) => item.dia === dataEdicao)
          .map((item) => item.horario);

        setHorarios(horariosDaData);

        const horarioNormalizado = String(horarioEdicao).slice(0, 5);

        setHoraSelecionada(
          horariosDaData.includes(horarioNormalizado)
            ? horarioNormalizado
            : null,
        );
      } else {
        setDataSelecionada(null);
        setHoraSelecionada(null);
        setHorarios([]);
      }
    } catch (e) {
      console.error("Erro ao carregar disponibilidades:", e);

      alert(e.message);

      setDisponibilidades([]);
      setDias([]);
      setHorarios([]);
    } finally {
      setCarregando(false);
    }
  };

  const handleProfissionalChange = async (pessoaId) => {
    if (!pessoaId) {
      setProfissionalSelecionado(null);
      setDisponibilidades([]);
      setDias([]);
      setHorarios([]);
      setDataSelecionada(null);
      setHoraSelecionada(null);
      return;
    }

    const pessoa = profissionais.find(
      (item) => String(item.id) === String(pessoaId),
    );

    if (!pessoa) return;

    setProfissionalSelecionado(pessoa);
    setPesquisaPessoa(pessoa.nome || "");
    setSeletorAberto(false);

    setDataSelecionada(null);
    setHoraSelecionada(null);
    setDisponibilidades([]);
    setDias([]);
    setHorarios([]);

    if (ehProfissional) {
      setProfissionalHorarioId(usuario.id);

      await carregarDisponibilidades(usuario.id);

      return;
    }

    setProfissionalHorarioId(pessoa.id);

    await carregarDisponibilidades(pessoa.id);
  };

  const handleDiaSelect = (dia) => {
    setDataSelecionada(dia);
    setHoraSelecionada(null);

    const horariosDoDia = disponibilidades
      .filter((item) => item.dia === dia)
      .map((item) => item.horario);

    setHorarios([...new Set(horariosDoDia)]);
  };

  const pessoasFiltradas = profissionais.filter((pessoa) =>
    pessoa?.nome?.toLowerCase().includes(pesquisaPessoa.toLowerCase()),
  );

  const handleConfirmar = async () => {
    if (!profissionalSelecionado || !dataSelecionada || !horaSelecionada) {
      alert(
        ehProfissional
          ? "Selecione o responsável, a data e o horário!"
          : "Selecione o profissional, a data e o horário!",
      );

      return;
    }

    if (!profissionalHorarioId) {
      alert(
        "Não foi possível identificar o profissional responsável pelo horário.",
      );

      return;
    }

    const horarioDisponivel = disponibilidades.some(
      (item) =>
        item.dia === dataSelecionada && item.horario === horaSelecionada,
    );

    if (!horarioDisponivel) {
      alert("Esse horário não está mais disponível.");

      return;
    }

    try {
      const dadosAgendamento = {
        id_usuario: profissionalSelecionado.id,

        id_profissional: profissionalHorarioId,

        solicitante_id: usuario.id,

        data_agendamento: dataSelecionada,

        motivo,

        profissional_id: profissionalHorarioId,

        status: "Aguardando",

        horario: horaSelecionada,
      };

      let resultado;

      if (id) {
        resultado = await api.atualizarAgendamento(id, dadosAgendamento);
      } else {
        resultado = await api.criarAgendamento(dadosAgendamento);
      }

      localStorage.setItem(
        "agendamento",
        JSON.stringify({
          ...resultado,

          profissional: ehProfissional
            ? usuario.nome
            : profissionalSelecionado.nome,

          responsavel: ehProfissional
            ? profissionalSelecionado.nome
            : undefined,

          data: dadosAgendamento.data_agendamento,

          hora: horaSelecionada,

          motivo: motivo || "Agendamento",
        }),
      );

      setMostrarModal(true);

      setTimeout(() => {
        navigate("/solicitacao");
      }, 1800);
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Deseja sair?")) {
      localStorage.removeItem("usuario");
      navigate("/login");
    }
  };

  if (!usuario) {
    return null;
  }

  return (
    <Layout usuario={usuario} onLogout={handleLogout}>
      <div className="agendamento-content">
        <div className="voltar-container">
          <button className="voltar" onClick={() => navigate("/inicio")}>
            <i className="fa-solid fa-arrow-left"></i>
            Voltar para o início
          </button>
        </div>

        <div className="card">
          <h2>{id ? "Editar Agendamento" : "Criar Novo Agendamento"}</h2>

          <p className="subtitle">
            Preencha as informações abaixo para agendar sua reunião
          </p>

          <label>
            {ehProfissional
              ? "Selecione o responsável"
              : "Selecione o profissional"}
          </label>

          <div className="seletor-pessoa" ref={seletorRef}>
            <div
              className={`seletor-pessoa-input ${
                seletorAberto ? "aberto" : ""
              }`}
              onClick={() => setSeletorAberto(!seletorAberto)}
            >
              <input
                type="text"
                value={pesquisaPessoa}
                placeholder={
                  ehProfissional
                    ? "Selecione o responsável"
                    : "Selecione o profissional"
                }
                onChange={(e) => {
                  setPesquisaPessoa(e.target.value);

                  setSeletorAberto(true);

                  if (
                    profissionalSelecionado &&
                    e.target.value !== profissionalSelecionado.nome
                  ) {
                    setProfissionalSelecionado(null);

                    setDisponibilidades([]);
                    setDias([]);
                    setHorarios([]);
                    setDataSelecionada(null);
                    setHoraSelecionada(null);

                    if (ehProfissional) {
                      setProfissionalHorarioId(usuario.id);
                    } else {
                      setProfissionalHorarioId(null);
                    }
                  }
                }}
                onFocus={() => setSeletorAberto(true)}
                onClick={(e) => e.stopPropagation()}
                autoComplete="off"
              />

              <i
                className={`fa-solid ${
                  seletorAberto ? "fa-chevron-up" : "fa-chevron-down"
                }`}
              ></i>
            </div>

            {seletorAberto && (
              <div className="lista-pessoas">
                {pessoasFiltradas.length > 0 ? (
                  pessoasFiltradas.map((pessoa) => (
                    <button
                      type="button"
                      key={pessoa.id}
                      className="opcao-pessoa"
                      onClick={() => handleProfissionalChange(pessoa.id)}
                    >
                      <span>{pessoa.nome}</span>

                      {!ehProfissional && pessoa.funcao && (
                        <small>{pessoa.funcao}</small>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="nenhuma-pessoa">
                    {ehProfissional
                      ? "Nenhum responsável encontrado."
                      : "Nenhum profissional encontrado."}
                  </div>
                )}
              </div>
            )}
          </div>

          {carregando && <p>Carregando disponibilidades...</p>}

          {profissionalSelecionado && !carregando && dias.length === 0 && (
            <p>
              Este profissional não possui horários disponíveis nesta semana.
            </p>
          )}

          {dias.length > 0 && (
            <>
              <label>Escolha a data</label>

              <div className="dias-container">
                {dias.map((dia) => (
                  <button
                    type="button"
                    key={dia}
                    className={`dia-btn ${
                      dataSelecionada === dia ? "selected" : ""
                    }`}
                    onClick={() => handleDiaSelect(dia)}
                  >
                    {formatarDataExibicao(dia)}
                  </button>
                ))}
              </div>
            </>
          )}

          {dataSelecionada && horarios.length > 0 && (
            <>
              <label>Escolha o horário</label>

              <div className="horarios-container">
                {horarios.map((hora) => (
                  <button
                    type="button"
                    key={hora}
                    className={`hora-btn ${
                      horaSelecionada === hora ? "selected" : ""
                    }`}
                    onClick={() => setHoraSelecionada(hora)}
                  >
                    {hora}
                  </button>
                ))}
              </div>
            </>
          )}

          {dataSelecionada && horarios.length === 0 && (
            <p>Não existem horários disponíveis para esta data.</p>
          )}

          <div className="campo motivo">
            <label>Motivo do agendamento</label>

            <textarea
              placeholder="Ex: conversar sobre minhas notas..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            ></textarea>
          </div>

          <div className="botoes">
            <button className="cancelar" onClick={() => navigate("/inicio")}>
              Cancelar
            </button>

            <button
              className="confirmar"
              onClick={handleConfirmar}
              disabled={carregando}
            >
              {id ? "Salvar alterações" : "Confirmar"}
            </button>
          </div>
        </div>

        {mostrarModal && (
          <div className="modal-overlay">
            <div className="modal-sucesso">
              <i className="fa-solid fa-circle-check"></i>

              <h3>{id ? "Agendamento atualizado!" : "Agendamento criado!"}</h3>

              <p>Seu agendamento foi enviado com sucesso.</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Agendamento;
