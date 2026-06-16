import { useState, useEffect } from "react";
import "./usuario.css";

export default function EditarUsuario({
  aberto,
  fechar,
  usuario,
  salvarUsuario
}) {

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("");
  const [cargo, setCargo] = useState("");

  useEffect(() => {

    if (usuario) {

      setNome(usuario.nome);
      setEmail(usuario.email);
      setTipo(usuario.tipo);
      setCargo(usuario.cargo || "");

    }

  }, [usuario]);

  if (!aberto || !usuario) return null;

  const handleSalvar = () => {

    salvarUsuario({
      ...usuario,
      nome,
      email,
      tipo,
      cargo
    });

    fechar();
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

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="Aluno">Aluno</option>
            <option value="Responsável">Responsável</option>
            <option value="Profissional">Profissional</option>
          </select>
        </div>

        {tipo === "Profissional" && (
          <div className="campo">

            <label>Cargo/Função</label>

            <input
              type="text"
              value={cargo}
              placeholder="Professor(a), Coordenador(a)..."
              onChange={(e) => setCargo(e.target.value)}
            />

          </div>
        )}

        <div className="modal-botoes">

          <button
            className="cancelar"
            onClick={fechar}
          >
            Cancelar
          </button>

          <button
            className="confirmar"
            onClick={handleSalvar}
          >
            Salvar
          </button>

        </div>

      </div>

    </div>
  );
}