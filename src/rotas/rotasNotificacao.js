const express=require("express");const router=express.Router();const c=require("../controladores/controladorNotificacao");
router.get("/:usuarioId",c.listar);router.post("/",c.criar);router.put("/:id/lida",c.marcarComoLida);module.exports=router;
