import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "./historico.css";
import Card from "../componentes/Card";
import Selo from "../componentes/Selo";
import CardTitulo from "../componentes/CardTitulo";
import BotaoVoltar from "../componentes/Botaovoltar";
import { api } from "../services/api";
import { useAutenticador } from "../context/AutenticadorContexto";

function Historico() {
  const { usuario } = useAutenticador();

  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const [tipoAgendamento, setTipoAgendamento] = useState("meus");
  const [agendamentos, setAgendamentos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");
  const [acaoPendente, setAcaoPendente] = useState(null);

  const abrirConfirmacao = (mensagem, acao) => {
    setMensagemModal(mensagem);
    setAcaoPendente(() => acao);
    setModalAberto(true);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }

    const carregar = async () => {
      try {
        if (tipoAgendamento === "seus") {
          setAgendamentos(await api.agendamentosRecebido(usuario.id));
        } else {
          setAgendamentos(await api.agendamentosPorUsuario(usuario.id));
        }
      } catch (error) {
        alert(error.message);
      }
    };

    carregar();
  }, [navigate, tipoAgendamento, usuario]);

  const handleFiltro = (filtro) => {
    setFiltroAtivo(filtro);
  };

  const handleLogout = () => {
    abrirConfirmacao("Você tem certeza que deseja sair?", () => {
      localStorage.removeItem("usuario");
      navigate("/login");
    });
  };

  const handleNotifications = () => {
    abrirConfirmacao("Deseja abrir as notificações?", () => {});
  };

  const confirmarAgendamento = (id) => {
    abrirConfirmacao(
      "Você tem certeza que deseja confirmar este agendamento?",
      async () => {
        try {
          const atualizado = await api.confirmarAgendamento(id, {
            status: "Confirmado",
          });

          setAgendamentos(await api.agendamentosRecebido(usuario.id));
        } catch (error) {
          alert(error.message);
        }
      },
    );
  };

  const recusarAgendamento = (id) => {
    abrirConfirmacao(
      "Você tem certeza que deseja recusar este agendamento?",
      async () => {
        try {
          const atualizado = await api.recusarAgendamento(id, {
            status: "Recusado",
          });

          setAgendamentos(await api.agendamentosRecebido(usuario.id));
        } catch (error) {
          alert(error.message);
        }
      },
    );
  };

  const cancelarAgendamento = (id) => {
    console.log("aqui");

    abrirConfirmacao(
      "Você tem certeza que deseja cancelar este agendamento?",
      async () => {
        try {
          await api.cancelarAgendamento(id, {
            status: "Cancelado",
          });

          setAgendamentos(await api.agendamentosRecebido(usuario.id));
        } catch (error) {
          alert(error.message);
        }
      },
    );
  };

  const excluirAgendamento = (id) => {
    abrirConfirmacao(
      "Você tem certeza que deseja excluir este agendamento?",
      async () => {
        try {
          await api.excluirAgendamento(id);

          setAgendamentos((lista) => lista.filter((a) => a.id !== id));
        } catch (error) {
          alert(error.message);
        }
      },
    );
  };

  const agendamentosFiltrados = agendamentos.filter((agendamento) => {
    if (filtroAtivo === "todos") {
      return true;
    }

    return agendamento.status === filtroAtivo;
  });

  const getStatusColor = (status) => {
    const cores = {
      Aguardando: "amarelo",
      Confirmado: "verde",
      Realizado: "azul-claro",
      Recusado: "vermelho",
      Cancelado: "cinza",
    };

    return cores[status] || "cinza";
  };

  const getStatusTexto = (status) => {
    const cores = {
      Aguardando: (
        <>
          Aguardando
          <br />
          Confirmação
        </>
      ),
      Confirmado: "Confirmado",
      Realizado: "Realizado",
      Recusado: "Recusado",
      Cancelado: "Cancelado",
    };

    return cores[status] || "Cancelado";
  };

  if (!usuario) {
    return null;
  }

  return (
    <Layout
      usuario={usuario}
      onLogout={handleLogout}
      onNotifications={handleNotifications}
    >
      <div className="historico-content">
        <BotaoVoltar />

        <h2>
          {usuario?.tipo_usuario?.tipo === "Profissional"
            ? "Histórico de Agendamentos"
            : "Histórico de Agendamentos"}
        </h2>

        <p className="sub">
          {usuario?.tipo_usuario?.tipo === "Profissional"
            ? "Gerencie seu histórico de agendamentos."
            : "Veja seus agendamentos."}

          <div className="filtros">
            <button
              className={tipoAgendamento === "meus" ? "agendamento-ativo1" : ""}
              onClick={() => setTipoAgendamento("meus")}
            >
              Meus Agendamentos
            </button>

            <button
              className={tipoAgendamento === "seus" ? "agendamento-ativo2" : ""}
              onClick={() => setTipoAgendamento("seus")}
            >
              Seus Agendamentos
            </button>
          </div>
        </p>

        <div className="filtros">
          <span>Filtrar por status:</span>

          <div className="botoes">
            <button
              className={filtroAtivo === "todos" ? "ativo" : ""}
              onClick={() => handleFiltro("todos")}
            >
              Todos
            </button>

            <button
              className={filtroAtivo === "Aguardando" ? "ativo" : ""}
              onClick={() => handleFiltro("Aguardando")}
            >
              Aguardando <br></br> Confirmação
            </button>

            <button
              className={filtroAtivo === "Confirmado" ? "ativo" : ""}
              onClick={() => handleFiltro("Confirmado")}
            >
              Confirmados
            </button>

            <button
              className={filtroAtivo === "Realizado" ? "ativo" : ""}
              onClick={() => handleFiltro("Realizado")}
            >
              Realizados
            </button>

            <button
              className={filtroAtivo === "Recusado" ? "ativo" : ""}
              onClick={() => handleFiltro("Recusado")}
            >
              Recusados
            </button>

            <button
              className={filtroAtivo === "Cancelado" ? "ativo" : ""}
              onClick={() => handleFiltro("Cancelado")}
            >
              Cancelados
            </button>
          </div>
        </div>

        <div className="cards">
          {agendamentosFiltrados.map((agendamento) => (
            <Card key={agendamento.id} tamanho={"400px"}>
              <CardTitulo>
                <h3>
                  {tipoAgendamento === "meus"
                    ? agendamento?.usuario?.nome
                    : agendamento?.usuario_agendamento[0]?.usuario?.nome}
                </h3>

                <Selo
                  cor={getStatusColor(agendamento.status)}
                  texto={getStatusTexto(agendamento.status)}
                />
              </CardTitulo>

              <p>
                <strong>Data:</strong>{" "}
                {agendamento.data_agendamento.split("-").reverse().join("/")}
              </p>

              <p>
                <strong>Hora:</strong> {agendamento.horario.slice(0, 5)}
              </p>

              <p>
                <strong>Motivo:</strong> {agendamento.motivo}
              </p>

              <div className="card-footer">
                {agendamento.status === "Aguardando" ? (
                  <>
                    {tipoAgendamento === "seus" ? (
                      <>
                        <button
                          className="btn-confirmar"
                          onClick={() => confirmarAgendamento(agendamento.id)}
                        >
                          Confirmar
                        </button>

                        <button
                          className="btn-recusar"
                          onClick={() => recusarAgendamento(agendamento.id)}
                        >
                          Recusar
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn-cancelar"
                        onClick={() => cancelarAgendamento(agendamento.id)}
                      >
                        Cancelar
                      </button>
                    )}
                  </>
                ) : agendamento.status === "Confirmado" ? (
                  <>
                    <button
                      className="btn-cancelar"
                      onClick={() => cancelarAgendamento(agendamento.id)}
                    >
                      Cancelar
                    </button>

                    {tipoAgendamento === "meus" ? (
                      <button
                        className="btn-editar"
                        onClick={() =>
                          navigate(`/agendamento/${agendamento.id}`)
                        }
                      >
                        ✎ Editar
                      </button>
                    ) : (
                      <></>
                    )}
                  </>
                ) : agendamento.status === "Recusado" ||
                  agendamento.status === "Cancelado" ? (
                  <button
                    className="btn-excluir"
                    onClick={() => excluirAgendamento(agendamento.id)}
                  >
                    🚮 Excluir
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </Card>
          ))}
        </div>

        {agendamentosFiltrados.length === 0 && (
          <div className="empty-state">
            <p>Nenhum agendamento encontrado para este filtro.</p>
          </div>
        )}
      </div>

      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-confirmacao">
            <h3>Confirmação</h3>

            <p>{mensagemModal}</p>

            <div className="modal-botoes">
              <button
                onClick={() => {
                  if (acaoPendente) {
                    acaoPendente();
                  }

                  setModalAberto(false);
                }}
              >
                Sim
              </button>

              <button onClick={() => setModalAberto(false)}>Não</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Historico;
