import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "./inicio.css";

import Carregando from "../componentes/Carregando";


function Inicio() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("usuario"));

    if (!dados) {
      navigate("/login");
    } else {
      setUsuario(dados);
    }
  }, [navigate]);

  const handleLogout = () => {
    if (confirm("Deseja sair?")) {
      localStorage.removeItem("usuario");

      setLoading(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  };

  const handleNavigation = (pagina) => {
    if (pagina === "criar") {
      navigate("/agendamento");
    } else if (pagina === "visualizar") {
      navigate("/historico");
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

      {/* ===== PROFISSIONAL ===== */}
    
        <div className="inicio-content">
          <h2>Bem-vindo ao Agende+</h2>

          <p className="subtitle">
            Facilitando a marcação de horários entre alunos, responsáveis e funcionários da instituição.
          </p>

          <div className="cards">
          
              <div className="card" onClick={() => handleNavigation("criar")}>
                <i className="fa-regular fa-calendar-plus icon blue"></i>
                <h3>Criar agendamento</h3>
                <p>
                  Agende uma nova reunião ou atendimento com professores ou coordenadores.
                </p>
              </div>
        

            <div className="card" onClick={() => handleNavigation("visualizar")}>
              <i className="fa-solid fa-clock-rotate-left icon purple"></i>

              <h3>Visualizar agendamentos</h3>

              <p>
                Consulte seus agendamentos passados e futuros, edite ou cancele reuniões.
              </p>
            </div>
          </div>
        </div>

      {loading && (
        <Carregando mensagem="Saindo..."/>
      )}

    </Layout>
  );
}

export default Inicio;