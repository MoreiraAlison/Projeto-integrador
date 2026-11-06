const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const usuarioRoutes = require("./rotas/rotasUsuario");
const alunoRoutes = require("./rotas/rotasAluno");
const profissionalRoutes = require("./rotas/rotasProfissional");
const agendamentoRoutes = require("./rotas/rotasAgendamento");
const disponibilidadeRoutes = require("./rotas/rotasDisponibilidade");
const notificacaoRoutes = require("./rotas/rotasNotificacao");

app.use("/usuarios", usuarioRoutes);
app.use("/alunos", alunoRoutes);
app.use("/profissionais", profissionalRoutes);
app.use("/agendamentos", agendamentoRoutes);
app.use("/disponibilidade", disponibilidadeRoutes);
app.use("/notificacoes", notificacaoRoutes);

app.get("/", (req, res) => {
  res.json({ mensagem: "Bem-vindo à API do Agende+" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor" });
});

module.exports = app;
