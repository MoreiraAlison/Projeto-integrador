import { useState, useEffect } from "react";
import "./usuario.css";

export default function EditarUsuario({
  aberto,
  fechar,
  usuario,
  salvarUsuario,
}) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("");
  const [cargo, setCargo] = useState("");

  useEffect(() => {
    if (!usuario) return;

    setNome(usuario.nome || "");
    setEmail(usuario.email || "");

    const tipoUsuario = usuario.tipo_usuario?.tipo || usuario.tipo || "";

    setTipo(tipoUsuario);

    setCargo(usuario.funcao || "");
  }, [usuario]);

  if (!aberto || !usuario) {
    return null;
  }

  const handleTipoChange = (e) => {
    const novoTipo = e.target.value;

    setTipo(novoTipo);

    if (novoTipo !== "Profissional") {
      setCargo("");
    }
  };

  const handleSalvar = async () => {
    if (!nome.trim() || !email.trim()) {
      alert("Preencha todos os campos!");
      return;
    }

    if (!tipo) {
      alert("Selecione o tipo de usuário!");
      return;
    }

    if (tipo === "Profissional" && !cargo.trim()) {
      alert("Informe a função do profissional!");
      return;
    }

    const usuarioAtualizado = {
      id: usuario.id,
      nome: nome.trim(),
      email: email.trim(),
      tipo: tipo,
      funcao: tipo === "Profissional" ? cargo.trim() : null,
    };

    try {
      await salvarUsuario(usuarioAtualizado);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Editar Usuário</h2>

        <div className="campo">
          <label>Nome</label>

          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="campo">
          <label>E-mail</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Tipo</label>

          <select value={tipo} onChange={handleTipoChange}>
            <option value="Aluno">Aluno</option>

            <option value="Responsável">Responsável</option>

            <option value="Profissional">Profissional</option>
          </select>
        </div>

        {tipo === "Profissional" && (
          <div className="campo">
            <label>Função na escola</label>

            <input
              type="text"
              placeholder="Professor(a), Coordenador(a), Diretor(a)..."
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
            />
          </div>
        )}

        <div className="modal-botoes">
          <button className="cancelar" onClick={fechar}>
            Cancelar
          </button>

          <button className="confirmar" onClick={handleSalvar}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
