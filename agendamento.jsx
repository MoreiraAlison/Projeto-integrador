import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "./agendamento.css";

const profissionais = [
  {
    nome: "Maria Júlia",
    dias: [1, 3, 5],
    horarios: ["09:00", "10:00", "14:00"]
  },
  {
    nome: "João Pedro",
    dias: [2, 4],
    horarios: ["08:00", "11:00", "15:00"]
  }
];

function Agendamento() {
  const [usuario, setUsuario] = useState(null);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horaSelecionada, setHoraSelecionada] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [dias, setDias] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("usuario"));

    if (!dados) {
      navigate("/login");
    } else {
      setUsuario(dados);
    }
  }, [navigate]);

  const gerarSemana = () => {
    const hoje = new Date();
    const semana = [];

    for (let i = 0; i < 7; i++) {
      const dia = new Date();
      dia.setDate(hoje.getDate() - hoje.getDay() + i);
      semana.push(dia);
    }

    return semana;
  };

  const handleProfissionalChange = (index) => {
    if (index !== "") {
      const prof = profissionais[index];

      setProfissionalSelecionado(prof);

      const semana = gerarSemana();

      const diasDisponiveis = semana.filter((dia) =>
        prof.dias.includes(dia.getDay())
      );

      setDias(diasDisponiveis);
    } else {
      setProfissionalSelecionado(null);
      setDias([]);
      setHorarios([]);
    }
  };

  const handleDiaSelect = (dia) => {
    setDataSelecionada(dia);

    if (profissionalSelecionado) {
      setHorarios(profissionalSelecionado.horarios);
    }
  };

  const handleConfirmar = () => {
    if (!profissionalSelecionado || !dataSelecionada || !horaSelecionada) {
      alert("Selecione profissional, data e horário!");
      return;
    }

    const agendamento = {
      profissional: profissionalSelecionado.nome,
      data: dataSelecionada.toLocaleDateString("pt-BR"),
      hora: horaSelecionada,
      motivo: motivo || "Agendamento"
    };

    localStorage.setItem("agendamento", JSON.stringify(agendamento));

    setMostrarModal(true);

    setTimeout(() => {
      navigate("/solicitacao");
    }, 1800);
  };

  const handleLogout = () => {
    if (confirm("Deseja sair?")) {
      localStorage.removeItem("usuario");
      navigate("/login");
    }
  };

  const handleNotifications = () => {
    alert("Notificações");
  };

  if (!usuario) {
    return null;
  }

  return (
    <Layout
      usuario={usuario}
      onLogout={handleLogout}
      onNotifications={handleNotifications}
    >
      <div className="agendamento-content">

        <div className="voltar-container">
          <button
            className="voltar"
            onClick={() => navigate("/inicio")}
          >
            <i className="fa-solid fa-arrow-left"></i>
            Voltar para o início
          </button>
        </div>

        <div className="card">

          <h2>Criar Novo Agendamento</h2>

          <p className="subtitle">
            Preencha as informações abaixo para agendar sua reunião
          </p>

          <label>Selecione o profissional</label>

          <select onChange={(e) => handleProfissionalChange(e.target.value)}>
            <option value="">Selecione o profissional</option>

            {profissionais.map((prof, index) => (
              <option key={index} value={index}>
                {prof.nome}
              </option>
            ))}
          </select>

          {dias.length > 0 && (
            <>
              <label>Escolha a data</label>

              <div className="dias-container">
                {dias.map((dia, index) => (
                  <button
                    key={index}
                    className={`dia-btn ${
                      dataSelecionada?.getTime() === dia.getTime()
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleDiaSelect(dia)}
                  >
                    {dia.toLocaleDateString("pt-BR")}
                  </button>
                ))}
              </div>
            </>
          )}

          {horarios.length > 0 && (
            <>
              <label>Escolha o horário</label>

              <div className="horarios-container">
                {horarios.map((hora, index) => (
                  <button
                    key={index}
                    className={`hora-btn ${
                      horaSelecionada === hora ? "selected" : ""
                    }`}
                    onClick={() => setHoraSelecionada(hora)}
                  >
                    {hora}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="campo motivo">
            <label>Motivo do agendamento</label>

            <textarea
              placeholder="Ex: conversar sobre minhas notas..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            ></textarea>
          </div>

          <div className="botoes">
            <button
              className="cancelar"
              onClick={() => navigate("/inicio")}
            >
              Cancelar
            </button>

            <button
              className="confirmar"
              onClick={handleConfirmar}
            >
              Confirmar
            </button>
          </div>

        </div>

        {mostrarModal && (
          <div className="modal-overlay">
            <div className="modal-sucesso">
              <i className="fa-solid fa-circle-check"></i>

              <h3>Agendamento criado!</h3>

              <p>
                Seu agendamento foi enviado com sucesso.
              </p>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}

export default Agendamento;