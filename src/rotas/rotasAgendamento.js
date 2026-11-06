const express = require("express");
const router = express.Router();
const c = require("../controladores/controladorAgendamento");

router.get("/", c.listar);
router.get("/usuario/:id", c.listarPorUsuario);
router.get("/usuario/recebido/:id", c.listarAgendamentosRecebidos);
router.get("/profissional/:id", c.listarPorProfissional);
router.get("/:id", c.buscarPorId);
router.post("/", c.criar);

router.put("/:id", c.atualizar);
router.put("/cancelar/:id", c.cancelar);
router.put("/recusar/:id", c.recusar);
router.put("/confirmar/:id", c.confirmar);

router.delete("/:id", c.deletar);

module.exports = router;
