import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import logo from "../assets/logo-login.png";
import BotaoLogin from "../componentes/BotaoLogin";
import Carregando from "../componentes/Carregando";

function AdminLogin() {
    const navigate = useNavigate();

    const [tipoUsuario, setTipoUsuario] = useState("admin");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);

    const usuarios = [
        {
            email: "peixoto.igor@agende.com",
            senha: "123",
            tipo: "ADM",
            nome: "Igor Peixoto Gavazzoni",
            cargo: "Administrador"
        }
    ];

    const handleSubmit = () => {

        const usuarioEncontrado = usuarios.find(
            (u) =>
                u.email === email &&
                u.senha === senha
        );

        if (usuarioEncontrado) {

            localStorage.setItem(
                "usuario",
                JSON.stringify(usuarioEncontrado)
            );

            setLoading(true);

            setTimeout(() => {
                navigate("/admin");
            }, 1500);

        } else {
            alert("E-mail ou senha incorretos!");
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

            <div className="container">
                <div className="login-box">

                    <div
                        style={{
                            cursor: "pointer",
                            marginBottom: "10px",
                            textAlign: "left"
                        }}
                        onClick={() => navigate("/")}
                    >
                        ← Sair
                    </div>

                    <h1>Entrar</h1>
                    <p className="subtitle">Acesse sua conta</p>

                    <div className="user-type">
                        <span>Tipo de Usuário</span>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "10px"
                            }}
                        >
                            <BotaoLogin
                                tipoBotao={"admin"}
                                aoClicar={() => setTipoUsuario("admin")}
                                ativo={tipoUsuario === "admin"}
                            >
                                <i className="fa-solid fa-user"></i>
                                ADM
                            </BotaoLogin>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>E-mail</label>

                        <div className="input-icon">
                            <i className="fa-solid fa-envelope"></i>

                            <input
                                type="email"
                                placeholder="adm@agende.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Senha</label>

                        <div className="input-icon">
                            <i className="fa-solid fa-lock"></i>

                            <input
                                type="password"
                                placeholder="*****"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        className="login-btn"
                        onClick={handleSubmit}
                    >
                        Entrar
                    </button>

                </div>
            </div>

            {loading && (
                <Carregando mensagem="Acessando painel administrativo..." />
            )}

        </div>
    );
}

export default AdminLogin;