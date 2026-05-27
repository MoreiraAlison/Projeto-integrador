import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import BotaoLogin from "../componentes/BotaoLogin";

import logo from "../assets/logo-login.png";
import Carregando from "../componentes/Carregando";

// Banco de dados fake
const usuarios = [
  { email: "alison@agende.com", senha: "123", tipo: "aluno", nome: "Alison Moreira" },
  { email: "rivani@agende.com", senha: "123", tipo: "responsavel", nome: "Rivani Silva" },
  { email: "maria.julia@agende.com", senha: "123", tipo: "profissional", nome: "Maria Júlia", cargo: "Professor(a)" },
  { email: "joao@agende.com", senha: "123", tipo: "profissional", nome: "João Pedro", cargo: "Coordenador(a)" },
  { email: "ana@agende.com", senha: "123", tipo: "profissional", nome: "Ana Souza", cargo: "Diretor(a)" }
];

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("aluno");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const usuarioEncontrado = usuarios.find(u =>
      u.email === email &&
      u.senha === senha &&
      u.tipo === tipoUsuario
    );

    if (usuarioEncontrado) {
      if (usuarioEncontrado.tipo === "profissional" && !usuarioEncontrado.cargo) {
        usuarioEncontrado.cargo = "Profissional";
      }

      localStorage.setItem("usuario", JSON.stringify(usuarioEncontrado));
      console.log("Usuário logado:", usuarioEncontrado);

      setLoading(true);

      setTimeout(() => {
        navigate("/inicio");
      }, 1500);
    } else {
      alert("Email ou senha incorretos!");
    }
  };

  return (
    <div className="login-container">

      <div className="top-logo">
        <img
          src={logo}
          alt="Logo Marista"
          width={"306px"}
          height={"107px"}
        />
      </div>

      <div className="purple-circle"></div>
      <div className="green-circle"></div>
      <div className="red-shape"></div>
      <div className="yellow-star"></div>

      <form id="formLogin" onSubmit={handleSubmit}>
        <div className="container">
          <div className="login-box">
            <h1>Entrar</h1>
            <p className="subtitle">Acesse sua conta</p>

            <div className="user-type">
              <span>Tipo de Usuário</span>

              <div className="buttons">
                <BotaoLogin
                  tipoBotao={"aluno"}
                  aoClicar={() => setTipoUsuario("aluno")}
                  ativo={tipoUsuario === "aluno"} 
                >
                  <i className="fa-solid fa-user"></i>
                  Aluno
                </BotaoLogin>

                <BotaoLogin
                  tipoBotao={"responsavel"}
                  aoClicar={() => setTipoUsuario("responsavel")}
                  ativo={tipoUsuario === "responsavel"} 
                >
                  <i className="fa-solid fa-users"></i>
                  Responsável
                </BotaoLogin>

                <BotaoLogin
                  tipoBotao={"profissional"}
                  aoClicar={() => setTipoUsuario("profissional")}
                  ativo={tipoUsuario === "profissional"} 
                >
                  <i className="fa-solid fa-briefcase"></i>
                  Profissional
                </BotaoLogin>
              </div>
            </div>

            <div className="input-group">
              <label>E-mail</label>

              <div className="input-icon">
                <i className="fa-solid fa-envelope"></i>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="aluno@maristabrasil"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Senha</label>

              <div className="input-icon">
                <i className="fa-solid fa-lock"></i>

                <input
                  type="password"
                  id="senha"
                  name="senha"
                  placeholder="*****"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="login-btn" type="submit">
              Entrar
            </button>
          </div>
        </div>
      </form>

      {loading && (
        <Carregando mensagem="Acessando o site..."/>
      )}
    </div>
  );
}

export default Login;