const express = require("express");
const router = express.Router();
const c = require("../controladores/controladorDisponibilidade");
router.get("/", c.listar);
router.get("/profissional/:profissionalId", c.listar);
router.post("/", c.criar);
router.put("/:id", c.atualizar);
router.delete("/:id", c.deletar);
module.exports = router;
