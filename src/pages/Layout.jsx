import React from "react";
import "./layout.css";

function Layout({ children, usuario, onLogout, onNotifications }) {
  return (
    <div className="layout-wrapper">
      <header className="topbar">
        <div className="logo-area">
       <div className="top-logo-inicio">
        <img
          src="https://maristabrasil-my.sharepoint.com/:i:/r/personal/21620230039_maristabrasil_g12_br/Documents/Imagens/Capturas%20de%20tela/Captura%20de%20tela%202026-02-23%20083349.png?csf=1&web=1&e=Mv6POO"
          alt="Logo"
        />
      </div>
        </div>

        <h1>Marista Escola Social Cascavel</h1>

        <div className="user-area">
          <i className="fa-solid fa-bell" onClick={onNotifications}></i>

          <div className="user-info">
            <span className="name">{usuario?.nome}</span>
            <span className="role">
              {usuario?.tipo === "profissional" 
                ? usuario.cargo 
                : usuario?.tipo === "aluno" 
                ? "Aluno" 
                : "Responsável"}
            </span>
          </div>

          <i 
            className="fa-solid fa-arrow-right-from-bracket logout" 
            onClick={onLogout}
            title="Sair"
          ></i>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        © 2026 Marista Escola Social Cascavel - Agende+
      </footer>
    </div>
  );
}

export default Layout;