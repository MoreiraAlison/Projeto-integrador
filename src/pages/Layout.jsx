import React from "react";
import "./layout.css";

import logo from "../assets/logo.png"

function Layout({ children, usuario, onLogout, onNotifications }) {
  return (
    <div className="layout-wrapper">
      <header className="topbar">
        <div className="logo-area">
       <div className="top-logo-inicio">
        <img
          src={logo}
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