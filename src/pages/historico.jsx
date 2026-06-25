import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "./historico.css";
import Card from "../componentes/Card";
import Selo from "../componentes/Selo";
import CardTitulo from "../componentes/CardTitulo";
import BotaoVoltar from "../componentes/Botaovoltar";

function Historico() {

  const agendamentosFake = [
    {
      id: 1,
      profissional: "Maria Júlia",
      data: "15/04/2026",
      hora: "09:00",
      motivo: "Conversar sobre notas",
      status: "aguardando"
    },
    {
      id: 2,
      profissional: "João Pedro",
      data: "16/04/2026",
      hora: "14:00",
      motivo: "Avaliação de desempenho",
      status: "confirmados"
    },
    {
      id: 3,
      profissional: "Angélica Lima",
      data: "10/04/2026",
      hora: "10:00",
      motivo: "Acompanhamento pedagógico",
      status: "realizados"
    },
    {
      id: 4,
      profissional: "João Pedro",
      data: "08/04/2026",
      hora: "11:00",
      motivo: "Discussão de projeto",
      status: "recusados"
    },
    {
      id: 5,
      profissional: "Maria Júlia",
      data: "05/04/2026",
      hora: "15:00",
      motivo: "Reunião geral",
      status: "cancelados"
    }
  ];

  const [usuario, setUsuario] = useState(null);
  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const [agendamentos, setAgendamentos] = useState(agendamentosFake);
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
    const dados = JSON.parse(localStorage.getItem("usuario"));

    if (!dados) {
      navigate("/login");
    } else {
      setUsuario(dados);
    }
  }, [navigate]);

  const handleFiltro = (filtro) => {
    setFiltroAtivo(filtro.toLowerCase());
  };

  const handleLogout = () => {
    abrirConfirmacao(
      "Você tem certeza que deseja sair?",
      () => {
        localStorage.removeItem("usuario");
        navigate("/login");
      }
    );
  };

  const handleNotifications = () => {
    abrirConfirmacao(
      "Deseja abrir as notificações?",
      () => { }
    );
  };

  const confirmarAgendamento = (id) => {
    abrirConfirmacao(
      "Você tem certeza que deseja confirmar este agendamento?",
      () => {
        setAgendamentos(
          agendamentos.map((agendamento) =>
            agendamento.id === id
              ? { ...agendamento, status: "confirmados" }
              : agendamento
          )
        );
      }
    );
  };

  const recusarAgendamento = (id) => {
    abrirConfirmacao(
      "Você tem certeza que deseja recusar este agendamento?",
      () => {
        setAgendamentos(
          agendamentos.map((agendamento) =>
            agendamento.id === id
              ? { ...agendamento, status: "recusados" }
              : agendamento
          )
        );
      }
    );
  };


  const cancelarAgendamento = (id) => {
    abrirConfirmacao(
      "Você tem certeza que deseja cancelar este agendamento?",
      () => {
        setAgendamentos(
          agendamentos.map((agendamento) =>
            agendamento.id === id
              ? { ...agendamento, status: "cancelados" }
              : agendamento
          )
        );
      }
    );
  };

  const excluirAgendamento = (id) => {
    abrirConfirmacao(
      "Você tem certeza que deseja excluir este agendamento?",
      () => {
        setAgendamentos(
          agendamentos.filter(
            (agendamento) => agendamento.id !== id
          )
        );
      }
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
      aguardando: "amarelo",
      confirmados: "verde",
      realizados: "azul-claro",
      recusados: "vermelho",
      cancelados: "cinza"
    };

    return cores[status] || "cinza";

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
          {usuario.tipo === "profissional"
            ? "Histórico de Agendamentos"
            : "Histórico de Agendamentos"}
        </h2>

        <p className="sub">
          {usuario.tipo === "profissional"
            ? "Gerencie seu histórico de agendamentos."
            : "Veja seus agendamentos anteriores."}
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
              className={filtroAtivo === "aguardando" ? "ativo" : ""}
              onClick={() => handleFiltro("aguardando")}
            >
              Aguardando
            </button>

            <button
              className={filtroAtivo === "confirmados" ? "ativo" : ""}
              onClick={() => handleFiltro("confirmados")}
            >
              Confirmados
            </button>

            <button
              className={filtroAtivo === "realizados" ? "ativo" : ""}
              onClick={() => handleFiltro("realizados")}
            >
              Realizados
            </button>

            <button
              className={filtroAtivo === "recusados" ? "ativo" : ""}
              onClick={() => handleFiltro("recusados")}
            >
              Recusados
            </button>

            <button
              className={filtroAtivo === "cancelados" ? "ativo" : ""}
              onClick={() => handleFiltro("cancelados")}
            >
              Cancelados
            </button>

          </div>

        </div>

        <div className="cards">

          {agendamentosFiltrados.map((agendamento) => (

            <Card
              key={agendamento.id}
              tamanho={"400px"}
            >

              <CardTitulo>

                <h3>{agendamento.profissional}</h3>

                <Selo
                  cor={getStatusColor(agendamento.status)}
                  texto={agendamento.status}
                />

              </CardTitulo>

              <p>
                <strong>Data:</strong> {agendamento.data}
              </p>

              <p>
                <strong>Hora:</strong> {agendamento.hora}
              </p>

              <p>
                <strong>Motivo:</strong> {agendamento.motivo}
              </p>

              <div className="card-footer">

                {agendamento.status === "aguardando" ? (

                  <>
                    <button
                      className="btn-confirmar"
                      onClick={() =>
                        confirmarAgendamento(agendamento.id)
                      }
                    >
                      Confirmar
                    </button>

                    <button
                      className="btn-recusar"
                      onClick={() =>
                        recusarAgendamento(agendamento.id)
                      }
                    >
                      Recusar
                    </button>
                  </>

                ) : agendamento.status === "confirmados" ? (

                  <button
                    className="btn-cancelar"
                    onClick={() =>
                      cancelarAgendamento(agendamento.id)
                    }
                  >
                    Cancelar
                  </button>

                ) : (

                  <button
                    className="btn-cancelar"
                    onClick={() =>
                      excluirAgendamento(agendamento.id)
                    }
                  >
                    🗑 Excluir
                  </button>

                )}

              </div>

            </Card>

          ))}

        </div>

        {agendamentosFiltrados.length === 0 && (

          <div className="empty-state">
            <p>
              Nenhum agendamento encontrado para este filtro.
            </p>
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

              <button
                onClick={() => setModalAberto(false)}
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}

export default Historico;