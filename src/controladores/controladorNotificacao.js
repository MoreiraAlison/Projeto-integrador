const model=require("../modelos/modeloNotificacao");
const listar=async(req,res)=>{try{res.json(await model.listarPorUsuario(req.params.usuarioId))}catch(e){res.status(500).json({erro:e.message})}};
const criar=async(req,res)=>{try{res.status(201).json(await model.criar(req.body))}catch(e){res.status(400).json({erro:e.message})}};
const marcarComoLida=async(req,res)=>{try{res.json(await model.marcarComoLida(req.params.id))}catch(e){res.status(400).json({erro:e.message})}};
module.exports={listar,criar,marcarComoLida};
