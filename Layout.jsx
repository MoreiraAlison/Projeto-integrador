import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./layout.css";

import logo from "../assets/logo4.png";


function Layout({
  children,
  usuario,
  onLogout,
  onNotifications,
  esconderTipo = false
}) {


  const [menuAberto, setMenuAberto] = useState(false);



  return (

    <div className="layout-wrapper">


      {menuAberto && (

        <div
          className="overlay"
          onClick={() => setMenuAberto(false)}
        />

      )}




      <aside className={`sidebar ${menuAberto ? "open" : ""}`}>


        <div className="sidebar-header">

          <img
            src={logo}
            alt="Logo"
          />

          <h2>Agende+</h2>

        </div>





        <nav>


          <Link
            to="/inicio"
            onClick={() => setMenuAberto(false)}
          >

            <i className="fa-solid fa-house"></i>

            <span>Início</span>

          </Link>




          <Link
            to="/sobre"
            onClick={() => setMenuAberto(false)}
          >

            <i className="fa-solid fa-circle-info"></i>

            <span>Sobre</span>

          </Link>



        </nav>






        <button
          className="sidebar-logout"
          onClick={onLogout}
        >

          <i className="fa-solid fa-arrow-right-from-bracket"></i>

          Sair

        </button>



      </aside>








      <header className="topbar">


        <div className="logo-area">


          <div className="top-logo-inicio">


            <Link to="/inicio">

              <img
                src={logo}
                alt="Logo"
              />

            </Link>


          </div>


        </div>






        <h1>
          Marista Escola Social Cascavel
        </h1>






        <div className="user-area">



          <i
            className="fa-solid fa-bell"
            onClick={onNotifications}
          ></i>





          <div className="user-info">



            <span className="name">

              {usuario?.nome}

            </span>





            {!esconderTipo && (

              <span className="role">


                {usuario?.tipo === "profissional"

                  ? usuario.cargo

                  : usuario?.tipo === "aluno"

                    ? "Aluno"

                    : usuario?.tipo === "responsavel"

                      ? "Responsável"

                      : "Administrador"

                }


              </span>

            )}



          </div>






          <button
            className="menu-btn"
            onClick={() => setMenuAberto(true)}
          >

            <i className="fa-solid fa-bars"></i>

          </button>




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