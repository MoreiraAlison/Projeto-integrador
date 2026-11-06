import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "./inicio.css";

import Carregando from "../componentes/Carregando";
import { useAutenticador } from "../context/AutenticadorContexto";

function Inicio() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { usuario, logout } = useAutenticador();

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
    }
  }, [navigate, usuario]);

  const handleLogout = () => {
    if (confirm("Deseja sair?")) {
      logout();

      setLoading(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  };

  const handleNavigation = (pagina) => {
    if (pagina === "criar") {
      /*
       * Mantém o usuário atual do contexto sincronizado
       * com o localStorage antes de abrir o agendamento.
       *
       * Isso evita que um usuário antigo salvo no localStorage
       * faça o sistema abrir como Profissional.
       */
      if (usuario) {
        localStorage.setItem("usuario", JSON.stringify(usuario));
      }

      navigate("/agendamento");
    } else if (pagina === "visualizar") {
      navigate("/historico");
    } else if (pagina === "agenda") {
      navigate("/minhaagenda");
    }
  };

  const handleNotifications = () => {
    alert("Notificações");
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
      <div className="inicio-content">
        <h2>Bem-vindo ao Agende+</h2>

        <p className="subtitle">
          Facilitando a marcação de horários entre alunos, responsáveis e
          funcionários da instituição.
        </p>

        <div className="cards">
          {/* CRIAR AGENDAMENTO */}

          <div className="card" onClick={() => handleNavigation("criar")}>
            <i className="fa-regular fa-calendar-plus icon blue"></i>

            <h3>Criar agendamento</h3>

            <p>
              Agende uma nova reunião ou atendimento com professores ou
              coordenadores.
            </p>
          </div>

          {/* VISUALIZAR AGENDAMENTOS */}

          <div className="card" onClick={() => handleNavigation("visualizar")}>
            <i className="fa-solid fa-clock-rotate-left icon purple"></i>

            <h3>Visualizar agendamentos</h3>

            <p>
              Consulte seus agendamentos passados e futuros, edite ou cancele
              reuniões.
            </p>
          </div>

          {/* MINHA AGENDA - EXCLUSIVO PARA PROFISSIONAIS */}

          {usuario?.tipo_usuario?.tipo === "Profissional" && (
            <div
              className="card card-agenda"
              onClick={() => handleNavigation("agenda")}
            >
              <i className="fa-regular fa-calendar-days icon blue"></i>

              <h3>Minha agenda</h3>

              <p>
                Configure os dias e horários em que você estará disponível para
                atendimentos.
              </p>
            </div>
          )}
        </div>
      </div>

      {loading && <Carregando mensagem="Saindo..." />}
    </Layout>
  );
}

export default Inicio;
