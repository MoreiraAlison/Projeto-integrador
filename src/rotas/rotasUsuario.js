const express=require("express");
const router=express.Router();
const controller=require("../controladores/controladorUsuario");

router.post("/login",controller.login);
router.get("/",controller.listar);
router.get("/:id",controller.buscarPorId);
router.post("/",controller.criar);
router.put("/:id",controller.atualizar);
router.delete("/:id",controller.deletar);

module.exports=router;
