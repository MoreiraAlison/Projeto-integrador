import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./layout.css";

import logo from "../assets/logo4.png";
import Notificacoes from "../componentes/notificacoes";

function Layout({
  children,
  usuario,
  onLogout,
  onNotifications,
  esconderTipo = false,
}) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [contadorNotificacoes, setContadorNotificacoes] = useState(0);

  const paginaInicial = "/inicio";

  const ehProfissional = usuario?.tipo_usuario?.tipo === "Profissional";

  return (
    <div className="layout-wrapper">
      {menuAberto && (
        <div className="overlay" onClick={() => setMenuAberto(false)} />
      )}

      <aside className={`sidebar ${menuAberto ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Logo" />
        </div>

        <nav>
          <Link to={paginaInicial} onClick={() => setMenuAberto(false)}>
            <i className="fa-solid fa-house"></i>
            <span>Início</span>
          </Link>

          <Link to="/sobre" onClick={() => setMenuAberto(false)}>
            <i className="fa-solid fa-circle-info"></i>
            <span>Sobre</span>
          </Link>

          <div className="sidebar-notificacoes">
            <Notificacoes
              usuario={usuario}
              onContadorChange={setContadorNotificacoes}
            />
          </div>
        </nav>

        <button className="sidebar-logout" onClick={onLogout}>
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          <span>Sair</span>
        </button>
      </aside>

      <header className="topbar">
        <div className="logo-area">
          <div className="top-logo-inicio">
            <Link
              to={
                usuario?.tipo_usuario?.tipo === "Administrador"
                  ? ""
                  : paginaInicial
              }
            >
              <img src={logo} alt="Logo" />
            </Link>
          </div>
        </div>

        <h1>Marista Escola Social Cascavel</h1>

        <div className="user-area">
          <div className="user-info">
            <span className="name">{usuario?.nome}</span>

            {!esconderTipo && (
              <>
                {ehProfissional ? (
                  <span className="role">
                    {usuario?.funcao || "Profissional"}
                  </span>
                ) : (
                  <span className="role">{usuario?.tipo_usuario?.tipo}</span>
                )}
              </>
            )}
          </div>

          <button
            className="menu-btn"
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir menu"
          >
            <i className="fa-solid fa-bars"></i>

            {contadorNotificacoes > 0 && (
              <span className="menu-notificacao-contador">
                {contadorNotificacoes > 99 ? "99+" : contadorNotificacoes}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="main-content">{children}</main>

      <footer className="footer">
        © 2026 Marista Escola Social Cascavel - Agende+
      </footer>
    </div>
  );
}

export default Layout;
