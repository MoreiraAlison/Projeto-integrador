// Preencher nome e tipo do usuário no header
const dados = JSON.parse(localStorage.getItem("usuario"));
if (dados) {
  document.getElementById("nomeUsuario").textContent = dados.nome;
  if (dados.tipo === "aluno") document.getElementById("tipoUsuario").textContent = "Aluno";
  else if (dados.tipo === "profissional") document.getElementById("tipoUsuario").textContent = dados.cargo;
  else document.getElementById("tipoUsuario").textContent = "Responsável";
}

// Logout
document.querySelector(".logout").addEventListener("click", () => {
  if (confirm("Deseja sair da conta?")) {
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
  }
});

// Notificações
document.querySelector(".fa-bell").addEventListener("click", () => {
  alert("Notificações");
});

// Pegar dados do agendamento do localStorage
const agendamento = JSON.parse(localStorage.getItem("agendamento"));

const profissionalNome = document.getElementById("profissional-nome");
const profissionalArea = document.getElementById("profissional-area");
const dataAgendamento = document.getElementById("data-agendamento");
const horaAgendamento = document.getElementById("hora-agendamento");
const motivoAgendamento = document.getElementById("motivo-agendamento");

if (agendamento) {
  // Profissional
  profissionalNome.textContent = agendamento.profissional || "-";
  profissionalArea.textContent = "-"; // Não existe área no Agendamento.jsx, pode deixar em branco

  // Data formatada
  if (agendamento.data) {
    const dataObj = new Date(agendamento.data);
    const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dataAgendamento.textContent = dataObj.toLocaleDateString('pt-BR', opcoes);
  } else {
    dataAgendamento.textContent = "-";
  }

  // Hora formatada 12h
  if (agendamento.hora) {
    const [h, m] = agendamento.hora.split(":");
    let horaInt = parseInt(h, 10);
    const ampm = horaInt >= 12 ? "PM" : "AM";
    horaInt = horaInt % 12 || 12;
    horaAgendamento.textContent = `${horaInt}:${m} ${ampm}`;
  } else {
    horaAgendamento.textContent = "-";
  }

  // Motivo
  motivoAgendamento.textContent = agendamento.motivo || "-";
} else {
  // Caso não haja agendamento
  profissionalNome.textContent = "-";
  profissionalArea.textContent = "-";
  dataAgendamento.textContent = "-";
  horaAgendamento.textContent = "-";
  motivoAgendamento.textContent = "-";
}

// Botões
document.getElementById("btn-voltar").addEventListener("click", () => {
  window.location.href = "inicio.html";
});

document.getElementById("btn-ver-agendamentos").addEventListener("click", () => {
  window.location.href = "visualizar.html"; // Página de visualização de agendamentos
});