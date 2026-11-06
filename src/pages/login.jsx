import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import BotaoLogin from "../componentes/BotaoLogin";

import logo from "../assets/logo-login.png";
import Carregando from "../componentes/Carregando";
import { api } from "../services/api";
import usuarioAPI from "../api/usuario";
import { useAutenticador } from "../context/AutenticadorContexto";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("aluno");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAutenticador();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const usuarioLogado = await usuarioAPI.login({ email, senha });

      login(usuarioLogado);

      setLoading(true);

      setTimeout(() => {
        navigate("/inicio");
      }, 1500);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="top-logo">
        <img src={logo} alt="Logo Marista" width={"306px"} height={"107px"} />
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
                  placeholder="aluno@agende.com"
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

            <button
              type="button"
              className="admin-btn"
              onClick={() => navigate("/admin-login")}
            >
              Admin
            </button>
          </div>
        </div>
      </form>

      {loading && <Carregando mensagem="Acessando o site..." />}
    </div>
  );
}

export default Login;
