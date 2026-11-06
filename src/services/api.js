const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function requisicao(endpoint, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(opcoes.headers || {}),
    },
    ...opcoes,
  });

  if (resposta.status === 204) return null;

  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.erro || "Erro na requisição");
  return dados;
}

export const api = {
  login: (dados) =>
    requisicao("/usuarios/login", {
      method: "POST",
      body: JSON.stringify(dados),
    }),

  usuarios: () => requisicao("/usuarios"),

  criarUsuario: (dados) =>
    requisicao("/usuarios", { method: "POST", body: JSON.stringify(dados) }),

  atualizarUsuario: (id, dados) =>
    requisicao(`/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    }),

  excluirUsuario: (id) => requisicao(`/usuarios/${id}`, { method: "DELETE" }),
  alunos: () => requisicao("/alunos"),

  alunosPorResponsavel: (id) => requisicao(`/alunos/responsavel/${id}`),

  profissionais: () => requisicao("/profissionais"),

  disponibilidade: (profissionalId) =>
    requisicao(`/disponibilidade/profissional/${profissionalId}`),

  criarDisponibilidade: (dados) =>
    requisicao("/disponibilidade", {
      method: "POST",
      body: JSON.stringify(dados),
    }),

  excluirDisponibilidade: (id) =>
    requisicao(`/disponibilidade/${id}`, {
      method: "DELETE",
    }),

  agendamentosPorUsuario: (id) => requisicao(`/agendamentos/usuario/${id}`),
  agendamentosRecebido: (id) =>
    requisicao(`/agendamentos/usuario/recebido/${id}`),

  agendamentosPorProfissional: (id) =>
    requisicao(`/agendamentos/profissional/${id}`),

  criarAgendamento: (dados) =>
    requisicao("/agendamentos", {
      method: "POST",
      body: JSON.stringify(dados),
    }),

  buscarAgendamento: (id) => requisicao(`/agendamentos/${id}`),

  atualizarAgendamento: (id, dados) =>
    requisicao(`/agendamentos/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    }),

  cancelarAgendamento: (id, dados) =>
    requisicao(`/agendamentos/cancelar/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    }),

  recusarAgendamento: (id, dados) =>
    requisicao(`/agendamentos/recusar/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    }),

  confirmarAgendamento: (id, dados) =>
    requisicao(`/agendamentos/confirmar/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    }),

  excluirAgendamento: (id) =>
    requisicao(`/agendamentos/${id}`, { method: "DELETE" }),

  notificacoes: (id) => requisicao(`/notificacoes/${id}`),
};
