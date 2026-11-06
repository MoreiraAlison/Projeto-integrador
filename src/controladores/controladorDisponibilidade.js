const model = require("../modelos/modeloDisponibilidade");
const listar = async (req, res) => {
  try {
    res.json(
      req.params.profissionalId
        ? await model.listarPorProfissional(req.params.profissionalId)
        : await model.listar(),
    );
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
    res.json(await model.atualizar(req.params.id, req.body));
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
};
const deletar = async (req, res) => {
  try {
    if (!(await model.deletar(req.params.id)))
      return res.status(404).json({ erro: "Disponibilidade não encontrada" });
    res.status(204).send();
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
};
module.exports = { listar, criar, atualizar, deletar };
