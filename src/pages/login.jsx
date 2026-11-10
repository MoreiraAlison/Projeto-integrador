import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

import BotaoLogin from "../componentes/BotaoLogin";

import logo from "../assets/logo-login.png";
import Carregando from "../componentes/Carregando";

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

    if (!email || !senha) {
      alert("Preencha o e-mail e a senha.");
      return;
    }

    try {
      const usuarioLogado = await usuarioAPI.login({
        email,
        senha,
      });

      const tiposPermitidos = {
        aluno: "Aluno",
        responsavel: "Responsável",
        profissional: "Profissional",
      };

      const tipoSelecionado = tiposPermitidos[tipoUsuario];
      const tipoBanco = usuarioLogado?.tipo_usuario?.tipo;

      if (tipoBanco !== tipoSelecionado) {
        alert(
          `Este e-mail pertence a um usuário do tipo "${tipoBanco}". Selecione a opção correta para entrar.`
        );
        return;
      }

      login(usuarioLogado);

      setLoading(true);

      setTimeout(() => {
        navigate("/inicio");
      }, 1500);
    } catch (error) {
      alert(error.message);
    }
  };

  const abrirLoginAdministrador = () => {
    navigate("/admin-login");
  };

  return (
    <>
      {loading && <Carregando />}

      <div className="login-container">
        <div className="login-card">
          <img
            src={logo}
            alt="Agende+"
            className="login-logo"
          />

          <h2>Login</h2>

          <div className="tipo-usuario">
            <button
              type="button"
              className={`tipo-btn ${
                tipoUsuario === "aluno" ? "ativo aluno" : ""
              }`}
              onClick={() => setTipoUsuario("aluno")}
            >
              Aluno
            </button>

            <button
              type="button"
              className={`tipo-btn ${
                tipoUsuario === "responsavel"
                  ? "ativo responsavel"
                  : ""
              }`}
              onClick={() =>
                setTipoUsuario("responsavel")
              }
            >
              Responsável
            </button>

            <button
              type="button"
              className={`tipo-btn ${
                tipoUsuario === "profissional"
                  ? "ativo profissional"
                  : ""
              }`}
              onClick={() =>
                setTipoUsuario("profissional")
              }
            >
              Profissional
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">E-mail</label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Digite seu e-mail"
              />
            </div>

            <div className="input-group">
              <label htmlFor="senha">Senha</label>

              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) =>
                  setSenha(e.target.value)
                }
                placeholder="Digite sua senha"
              />
            </div>

            <BotaoLogin type="submit">
              Entrar
            </BotaoLogin>
          </form>

          <button
            type="button"
            className="botao-adm"
            onClick={abrirLoginAdministrador}
          >
            ADM
          </button>
        </div>
      </div>
    </>
  );
}

export default Login;
