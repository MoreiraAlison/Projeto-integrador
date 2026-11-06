const express = require("express");
const router = express.Router();
const c = require("../controladores/controladorProfissional");
router.get("/", c.listar);
router.get("/:id", c.buscarPorId);
router.post("/", c.criar);
router.put("/:id", c.atualizar);
router.delete("/:id", c.deletar);
module.exports = router;
