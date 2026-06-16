import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "./historico.css";
import Card from "../componentes/Card";
import Selo from "../componentes/Selo";

// Dados fake de agendamentos
const agendamentosFake = [
  { id: 1, profissional: "Maria Júlia", data: "15/04/2026", hora: "09:00", motivo: "Conversa sobre notas", status: "aguardando" },
  { id: 2, profissional: "João Pedro", data: "16/04/2026", hora: "14:00", motivo: "Avaliação de desempenho", status: "confirmados" },
  { id: 3, profissional: "Maria Júlia", data: "10/04/2026", hora: "10:00", motivo: "Acompanhamento pedagógico", status: "realizados" },
  { id: 4, profissional: "João Pedro", data: "08/04/2026", hora: "11:00", motivo: "Discussão de projeto", status: "recusados" },
  { id: 5, profissional: "Maria Júlia", data: "05/04/2026", hora: "15:00", motivo: "Reunião geral", status: "cancelados" }
];

function Historico() {
  const [usuario, setUsuario] = useState(null);
  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const [agendamentos, setAgendamentos] = useState(agendamentosFake);
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

  const agendamentosFiltrados = agendamentos.filter((agendamento) => {
    if (filtroAtivo === "todos") {
      return true;
    }

    return agendamento.status === filtroAtivo;
  });

  const handleLogout = () => {
    if (confirm("Deseja sair?")) {
      localStorage.removeItem("usuario");
      navigate("/login");
    }
  };

  const handleNotifications = () => {
    alert("Notificações");
  };

  const getStatusColor = (status) => {
    const cores = {
      aguardando: "#ffc107",
      confirmados: "#28a745",
      realizados: "#17a2b8",
      recusados: "#dc3545",
      cancelados: "#6c757d"
    };

    return cores[status] || "#000";
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

        <button className="voltar" onClick={() => navigate("/inicio")}>
          ← Voltar para o Início
        </button>

        <h2>
          {usuario.tipo === "profissional"
            ? "Solicitações Recebidas"
            : "Histórico de Agendamentos"}
        </h2>

        <p className="sub">
          {usuario.tipo === "profissional"
            ? "Gerencie as solicitações recebidas."
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
            // <div
            //   key={agendamento.id}
            //   className={`card ${agendamento.status}`}
            // >
            <Card tamanho={"400px"}>
              <div className="card-header">

                <h3>{agendamento.profissional}</h3>

                {/* <span
                  className="status"
                  style={{
                    backgroundColor: getStatusColor(agendamento.status)
                  }}
                >
                  {agendamento.status === "confirmados" && "Confirmado"}
                  {agendamento.status === "realizados" && "Realizado"}
                  {agendamento.status === "recusados" && "Recusado"}
                  {agendamento.status === "cancelados" && "Cancelado"}
                  {agendamento.status === "aguardando" && "Aguardando"}
                </span> */}

                <Selo 
                  cor={"amarelo"}
                  texto={agendamento.status}
                />

              </div>

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

                {usuario.tipo === "profissional" ? (
                  <>
                    <button className="btn-confirmar">
                      Confirmar
                    </button>

                    <button className="btn-recusar">
                      Recusar
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-editar">
                      Editar
                    </button>

                    <button className="btn-cancelar">
                      🗑 Cancelar
                    </button>
                  </>
                )}

              </div>
            </Card>
            // </div>
          ))}

        </div>

        {agendamentosFiltrados.length === 0 && (
          <div className="empty-state">
            <p>Nenhum agendamento encontrado para este filtro.</p>
          </div>
        )}

      </div>
    </Layout>
  );
}

export default Historico;