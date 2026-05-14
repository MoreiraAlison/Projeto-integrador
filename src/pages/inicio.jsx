import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "./inicio.css";

function Inicio() {
  const [usuario, setUsuario] = useState(null);
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
      navigate("/login");
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
      

      <div className="inicio-content">
        <h2>Bem-vindo ao Agende+</h2>
        <p className="subtitle">
          Facilitando a marcação de horários entre alunos, responsáveis e funcionários da instituição.
        </p>

        <div className="cards">
          {usuario.tipo !== "profissional" && (
            <div className="card" onClick={() => handleNavigation("criar")}>
              <i className="fa-regular fa-calendar-plus icon blue"></i>
              <h3>Criar agendamento</h3>
              <p>Agende uma nova reunião ou atendimento com professores ou coordenadores.</p>
            </div>
          )}

          <div className="card" onClick={() => handleNavigation("visualizar")}>
            <i className="fa-solid fa-clock-rotate-left icon purple"></i>
            <h3>Visualizar agendamentos</h3>
            <p>Consulte seus agendamentos passados e futuros, edite ou cancele reuniões.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Inicio;