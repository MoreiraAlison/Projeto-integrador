import { useState, useEffect } from "react";
import "./admin.css";
import { useNavigate } from "react-router-dom";

import Layout from "./Layout";
import AdicionarUsuario from "../componentes/AdicionarUsuario";
import EditarUsuario from "../componentes/EditarUsuario";
import Selo from "../componentes/Selo";

export default function Admin() {

  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: "Rivani de Jesus Silva",
      email: "rivani@agende.com",
      tipo: "Responsável"
    },
    {
      id: 2,
      nome: "Jonas Amaral Soares",
      email: "jonas@agende.com",
      tipo: "Aluno"
    }
  ]);

  const [busca, setBusca] = useState("");
  const [usuario, setUsuario] = useState(null);

  const [abrirAdicionar, setAbrirAdicionar] = useState(false);

  const [abrirEditar, setAbrirEditar] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

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
    if (window.confirm("Deseja sair?")) {
      localStorage.removeItem("usuario");
      navigate("/login");
    }
  };

  const adicionarUsuario = (novoUsuario) => {
    setUsuarios([
      ...usuarios,
      {
        ...novoUsuario,
        id: Date.now()
      }
    ]);
  };

  const editarUsuario = (usuarioAtualizado) => {
    setUsuarios(
      usuarios.map((u) =>
        u.id === usuarioAtualizado.id
          ? usuarioAtualizado
          : u
      )
    );
  };

  const excluirUsuario = (id) => {
    if (window.confirm("Deseja excluir este usuário?")) {
      setUsuarios(
        usuarios.filter((u) => u.id !== id)
      );
    }
  };

  const corSelo = {
    Profissional: "azul-escuro",
    Responsável: "roxo",
    Aluno: "azul-claro"
  }


  return (
    <Layout
      usuario={usuario}
      onLogout={handleLogout}
    >
      <div className="admin-page">

        <main className="admin-container">

          <div className="titulo-area">

            <div>
              <h2>Gerenciar Usuários</h2>

              <p>
                Adicione ou remova usuários do sistema
              </p>
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

            {usuarios
              .filter(
                (usuario) =>
                  usuario.nome
                    .toLowerCase()
                    .includes(busca.toLowerCase()) ||
                  usuario.email
                    .toLowerCase()
                    .includes(busca.toLowerCase())
              )
              .map((usuarioLista) => (

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
                        gap: "5px"
                      }}
                    >

                      <Selo
                        texto={usuarioLista.tipo}
                        textoSecundario={
                          usuarioLista.tipo.toLocaleLowerCase() === "profissional"
                            ? usuarioLista.cargo : undefined
                        }
                        cor={corSelo[usuarioLista.tipo]}
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
                      onClick={() =>
                        excluirUsuario(usuarioLista.id)
                      }
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
        fechar={() => setAbrirEditar(false)}
        usuario={usuarioEditando}
        salvarUsuario={editarUsuario}
      />

    </Layout>
  );
}