import { useState, useEffect } from "react";
import "./admin.css";
import { useNavigate } from "react-router-dom";

import Layout from "./Layout";
import AdicionarUsuario from "../componentes/AdicionarUsuario";
import EditarUsuario from "../componentes/EditarUsuario";
import Selo from "../componentes/Selo";
import { api } from "../services/api";
import { useAutenticador } from "../context/AutenticadorContexto";

export default function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState("");

  const [abrirAdicionar, setAbrirAdicionar] = useState(false);

  const [abrirEditar, setAbrirEditar] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const navigate = useNavigate();
  const { usuario } = useAutenticador();

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }

    carregarUsuarios();
  }, [navigate, usuario]);

  const carregarUsuarios = async () => {
    try {
      const lista = await api.usuarios();
      setUsuarios(lista || []);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Deseja sair?")) {
      localStorage.removeItem("usuario");
      navigate("/login");
    }
  };

  const adicionarUsuario = async (novoUsuario) => {
    try {
      const criado = await api.criarUsuario(novoUsuario);

      setUsuarios((lista) => [...lista, criado]);

      setAbrirAdicionar(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const editarUsuario = async (usuarioAtualizado) => {
    try {
      const atualizado = await api.atualizarUsuario(
        usuarioAtualizado.id,
        usuarioAtualizado,
      );

      setUsuarios((lista) =>
        lista.map((u) =>
          Number(u.id) === Number(atualizado.id) ? atualizado : u,
        ),
      );

      setAbrirEditar(false);
      setUsuarioEditando(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const excluirUsuario = async (id) => {
    if (!window.confirm("Deseja excluir este usuário?")) {
      return;
    }

    try {
      await api.excluirUsuario(id);

      setUsuarios((lista) => lista.filter((u) => Number(u.id) !== Number(id)));
    } catch (error) {
      alert(error.message);
    }
  };

  const corSelo = {
    profissional: "azul-escuro",
    responsavel: "roxo",
    aluno: "azul-claro",
    administrador: "vermelho",
  };

  const usuariosFiltrados = usuarios.filter((usuarioLista) => {
    const nome = String(usuarioLista.nome || "").toLowerCase();

    const email = String(usuarioLista.email || "").toLowerCase();

    const tipo = String(usuarioLista.tipo_usuario?.tipo || "").toLowerCase();

    const funcao = String(usuarioLista.funcao || "").toLowerCase();

    const textoBusca = busca.toLowerCase();

    return (
      nome.includes(textoBusca) ||
      email.includes(textoBusca) ||
      tipo.includes(textoBusca) ||
      funcao.includes(textoBusca)
    );
  });

  const obterTipo = (usuarioLista) => {
    return String(usuarioLista.tipo_usuario?.tipo || "").trim();
  };

  const obterTextoSelo = (usuarioLista) => {
    const tipo = obterTipo(usuarioLista);

    if (tipo === "Profissional") {
      return usuarioLista.funcao || "Profissional";
    }

    if (tipo === "Responsável") {
      return "Responsável";
    }

    if (tipo === "Aluno") {
      return "Aluno";
    }

    if (tipo === "Administrador") {
      return "Administrador";
    }

    return tipo || "Usuário";
  };

  const obterCorSelo = (usuarioLista) => {
    const tipo = obterTipo(usuarioLista).toLowerCase();

    if (tipo === "profissional") {
      return corSelo.profissional;
    }

    if (tipo === "responsável" || tipo === "responsavel") {
      return corSelo.responsavel;
    }

    if (tipo === "aluno") {
      return corSelo.aluno;
    }

    if (tipo === "administrador") {
      return corSelo.administrador;
    }

    return "azul-claro";
  };

  return (
    <Layout usuario={usuario} onLogout={handleLogout}>
      <div className="admin-page">
        <main className="admin-container">
          <div className="titulo-area">
            <div>
              <h2>Gerenciar Usuários</h2>

              <p>Adicione ou remova usuários do sistema</p>
            </div>

            <button
              className="btn-adicionar"
              onClick={() => setAbrirAdicionar(true)}
            >
              <i className="fa-solid fa-user-plus"></i>
              Adicionar Usuário
            </button>
          </div>

          <div className="busca">
            <i className="fa-solid fa-magnifying-glass"></i>

            <input
              type="text"
              placeholder="Buscar por nome ou e-mail"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="lista-usuarios">
            {usuariosFiltrados.map((usuarioLista) => (
              <div className="usuario-card" key={usuarioLista.id}>
                <div className="usuario-info">
                  <i className="fa-regular fa-user"></i>

                  <div>
                    <h3>{usuarioLista.nome}</h3>

                    <p>{usuarioLista.email}</p>
                  </div>
                </div>

                <div className="acoes">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Selo
                      texto={obterTextoSelo(usuarioLista)}
                      cor={obterCorSelo(usuarioLista)}
                    />
                  </div>

                  <button
                    className="editar"
                    onClick={() => {
                      setUsuarioEditando(usuarioLista);
                      setAbrirEditar(true);
                    }}
                  >
                    <i className="fa-regular fa-pen-to-square"></i>
                  </button>

                  <button
                    className="excluir"
                    onClick={() => excluirUsuario(usuarioLista.id)}
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <AdicionarUsuario
        aberto={abrirAdicionar}
        fechar={() => setAbrirAdicionar(false)}
        adicionarUsuario={adicionarUsuario}
      />

      <EditarUsuario
        aberto={abrirEditar}
        fechar={() => {
          setAbrirEditar(false);
          setUsuarioEditando(null);
        }}
        usuario={usuarioEditando}
        salvarUsuario={editarUsuario}
      />
    </Layout>
  );
}
