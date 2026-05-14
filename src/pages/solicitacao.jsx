import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "./solicitacao.css";

function Solicitacao() {
  const [usuario, setUsuario] = useState(null);
  const [agendamento, setAgendamento] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("usuario"));
    if (!dados) {
      navigate("/login");
    } else {
      setUsuario(dados);
    }

    const agend = JSON.parse(localStorage.getItem("agendamento"));
    if (!agend) {
      navigate("/agendamento");
    } else {
      setAgendamento(agend);
    }
  }, [navigate]);

  const handleLogout = () => {
    if (confirm("Deseja sair da conta?")) {
      localStorage.removeItem("usuario");
      navigate("/login");
    }
  };

  const handleNotifications = () => {
    alert("Notificações");
  };

  const formatarData = (data) => {
    if (!data) return "-";
    try {
      const dataObj = new Date(data);
      const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return dataObj.toLocaleDateString('pt-BR', opcoes);
    } catch {
      return data;
    }
  };

  const formatarHora = (hora) => {
    if (!hora) return "-";
    try {
      const [h, m] = hora.split(":");
      let horaInt = parseInt(h, 10);
      const ampm = horaInt >= 12 ? "PM" : "AM";
      horaInt = horaInt % 12 || 12;
      return `${horaInt}:${m} ${ampm}`;
    } catch {
      return hora;
    }
  };

  if (!usuario || !agendamento) {
    return null;
  }

  return (
    <Layout 
      usuario={usuario} 
      onLogout={handleLogout}
      onNotifications={handleNotifications}
    >
      <div className="solicitacao-content">
        <div className="icon-check">
          <i className="fa-solid fa-circle-check"></i>
        </div>

        <h2>Solicitação Enviada!</h2>
        <p className="subtitulo">
          Sua solicitação de agendamento foi enviada. Aguarde a confirmação do profissional.
        </p>

        <div className="card-detalhes">
          <div className="titulo-card">Detalhes do agendamento</div>

          <div className="detalhe">
            <i className="fa-solid fa-user"></i>
            <div>
              <strong>Profissional</strong>
              <br />
              <span>{agendamento.profissional || "-"}</span>
              <br />
              <small>{"-"}</small>
            </div>
          </div>

          <div className="detalhe">
            <i className="fa-solid fa-calendar"></i>
            <div>
              <strong>Data</strong>
              <br />
              <span>{formatarData(agendamento.data)}</span>
            </div>
          </div>

          <div className="detalhe">
            <i className="fa-solid fa-clock"></i>
            <div>
              <strong>Hora</strong>
              <br />
              <span>{formatarHora(agendamento.hora)}</span>
            </div>
          </div>

          <div className="detalhe">
            <i className="fa-solid fa-clipboard"></i>
            <div>
              <strong>Motivo</strong>
              <br />
              <span>{agendamento.motivo || "-"}</span>
            </div>
          </div>
        </div>

        <div className="botoes">
          <button className="btn-voltar" onClick={() => navigate("/inicio")}>
            Voltar ao Início
          </button>
          <button className="btn-agendamentos" onClick={() => navigate("/historico")}>
            Ver Agendamentos
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default Solicitacao;