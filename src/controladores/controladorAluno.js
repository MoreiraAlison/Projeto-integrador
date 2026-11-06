const model = require("../modelos/modeloAluno");
const listar = async (req,res)=>{try{res.json(req.params.id?await model.listarPorResponsavel(req.params.id):await model.listar())}catch(e){res.status(500).json({erro:e.message})}};
const buscarPorId = async(req,res)=>{try{const d=await model.buscarPorId(req.params.id);if(!d)return res.status(404).json({erro:"Aluno não encontrado"});res.json(d)}catch(e){res.status(500).json({erro:e.message})}};
const criar = async(req,res)=>{try{res.status(201).json(await model.criar(req.body))}catch(e){res.status(400).json({erro:e.message})}};
const atualizar = async(req,res)=>{try{res.json(await model.atualizar(req.params.id,req.body))}catch(e){res.status(400).json({erro:e.message})}};
const deletar = async(req,res)=>{try{if(!await model.deletar(req.params.id))return res.status(404).json({erro:"Aluno não encontrado"});res.status(204).send()}catch(e){res.status(400).json({erro:e.message})}};
module.exports={listar,buscarPorId,criar,atualizar,deletar};
