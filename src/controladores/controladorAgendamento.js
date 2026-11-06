const model = require("../modelos/modeloAgendamento");
const listar = async (req, res) => {
  try {
    res.json(await model.listar());
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
};
const buscarPorId = async (req, res) => {
  try {
    const d = await model.buscarPorId(req.params.id);
    if (!d) return res.status(404).json({ erro: "Agendamento não encontrado" });
    res.json(d);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
};
const listarPorUsuario = async (req, res) => {
  try {
    res.json(await model.listarPorUsuario(req.params.id));
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
};

const listarAgendamentosRecebidos = async (req, res) => {
  try {
    res.json(await model.listarAgendamentosRecebidos(req.params.id));
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
};

const listarPorProfissional = async (req, res) => {
  try {
    res.json(await model.listarPorProfissional(req.params.id));
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
};
const criar = async (req, res) => {
  try {
    res.status(201).json(await model.criar(req.body));
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
};
const atualizar = async (req, res) => {
  try {
    const d = await model.atualizar(req.params.id, req.body);
    if (!d) return res.status(404).json({ erro: "Agendamento não encontrado" });
    res.json(d);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
};
const cancelar = async (req, res) => {
  try {
    const d = await model.cancelar(req.params.id, req.body);
    if (!d)
      return res
        .status(404)
        .json({ erro: "Não foi possível cancelar o agendamento" });
    res.json(d);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
};
const recusar = async (req, res) => {
  try {
    const d = await model.recusar(req.params.id, req.body);
    if (!d)
      return res
        .status(404)
        .json({ erro: "Não foi possível recusar o agendamento" });
    res.json(d);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
};
const confirmar = async (req, res) => {
  try {
    const d = await model.confirmar(req.params.id, req.body);
    if (!d)
      return res
        .status(404)
        .json({ erro: "Não foi possível confirmar o agendamento" });
    res.json(d);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
};
const deletar = async (req, res) => {
  try {
    if (!(await model.deletar(req.params.id)))
      return res.status(404).json({ erro: "Agendamento não encontrado" });
    res.status(204).send();
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
};
module.exports = {
  listar,
  buscarPorId,
  listarPorUsuario,
  listarPorProfissional,
  listarAgendamentosRecebidos,
  criar,
  atualizar,
  recusar,
  cancelar,
  confirmar,
  deletar,
};
