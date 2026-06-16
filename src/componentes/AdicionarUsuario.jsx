import { useState } from "react";
import "./usuario.css";

export default function AdicionarUsuario({
  aberto,
  fechar,
  adicionarUsuario
}) {

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("Aluno");
  const [cargo, setCargo] = useState("");

  if (!aberto) return null;

  const handleSubmit = () => {

    if (!nome || !email || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    adicionarUsuario({
      id: Date.now(),
      nome,
      email,
      senha,
      tipo,
      cargo
    });

    setNome("");
    setEmail("");
    setSenha("");
    setTipo("Aluno");
    setCargo("");

    fechar();
  };

  return (
    <div className="modal-overlay">

      <div className="modal-container">

        <h2>Adicionar Usuário</h2>

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
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Tipo de Usuário</label>

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
              placeholder="Professor(a), Coordenador(a)..."
              value={cargo}
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
            onClick={handleSubmit}
          >
            Confirmar
          </button>

        </div>

      </div>

    </div>
  );
}