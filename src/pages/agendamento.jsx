// ===== PROFISSIONAIS =====
const profissionais = [
  {
    nome: "Maria Júlia",
    dias: [1, 3, 5], // Segunda, Quarta, Sexta
    horarios: ["09:00", "10:00", "14:00"]
  },
  {
    nome: "João Pedro",
    dias: [2, 4], // Terça, Quinta
    horarios: ["08:00", "11:00", "15:00"]
  }
];

let profissionalSelecionado = null;
let dataSelecionada = null;
let horaSelecionada = null;

// ===== GERAR SEMANA =====
function gerarSemana() {
  const hoje = new Date();
  const semana = [];

  for (let i = 0; i < 7; i++) {
    const dia = new Date();
    dia.setDate(hoje.getDate() - hoje.getDay() + i);
    semana.push(dia);
  }

  return semana;
}

// ===== MOSTRAR DIAS =====
function mostrarDias(prof) {
  const container = document.getElementById("dias");
  container.innerHTML = "";

  const semana = gerarSemana();

  semana.forEach(dia => {
    if (prof.dias.includes(dia.getDay())) {

      const btn = document.createElement("button");
      btn.textContent = dia.toLocaleDateString("pt-BR");

      btn.onclick = () => {
        dataSelecionada = dia;
        mostrarHorarios(prof);
      };

      container.appendChild(btn);
    }
  });
}

// ===== MOSTRAR HORÁRIOS =====
function mostrarHorarios(prof) {
  const container = document.getElementById("horarios");
  container.innerHTML = "";

  prof.horarios.forEach(hora => {
    const btn = document.createElement("button");
    btn.textContent = hora;

    btn.onclick = () => {
      horaSelecionada = hora;
      alert("Horário selecionado: " + hora);
    };

    container.appendChild(btn);
  });
}

// ===== SELECIONAR PROFISSIONAL =====
document.getElementById("profissional").addEventListener("change", function() {
  const index = this.value;

  if (index !== "") {
    profissionalSelecionado = profissionais[index];
    mostrarDias(profissionalSelecionado);
  }
});

// ===== CONFIRMAR =====
document.getElementById("confirmar").addEventListener("click", () => {
  if (!profissionalSelecionado || !dataSelecionada || !horaSelecionada) {
    alert("Selecione tudo!");
    return;
  }

  const agendamento = {
    profissional: profissionalSelecionado.nome,
    data: dataSelecionada,
    hora: horaSelecionada,
    motivo: "Agendamento"
  };

  localStorage.setItem("agendamento", JSON.stringify(agendamento));

  window.location.href = "solicitacao.html";
});