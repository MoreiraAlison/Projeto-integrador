const usuarioModel = require("../modelos/modeloUsuario");

const listar = async (req, res) => {
  try {
    const usuarios = await usuarioModel.listar();
    res.json(usuarios);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const usuario = await usuarioModel.buscarPorId(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        erro: "Usuário não encontrado",
      });
    }

    res.json(usuario);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: "E-mail e senha são obrigatórios",
      });
    }

    const usuario = await usuarioModel.login(email, senha);

    if (!usuario) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos",
      });
    }

    const { senha: _, ...seguro } = usuario;

    res.json(seguro);
  } catch (e) {
    res.status(500).json({
      erro: e.message,
    });
  }
};

/*
  Converte o tipo que vem do formulário
  para o ID existente na tabela tipo_usuario.

  1 = Aluno
  2 = Responsável
  3 = Profissional
  4 = Administrador
*/
const normalizarTipo = (tipo) => {
  if (tipo === undefined || tipo === null || tipo === "") {
    return null;
  }

  if (!isNaN(Number(tipo))) {
    const id = Number(tipo);

    if ([1, 2, 3, 4].includes(id)) {
      return id;
    }
  }

  const valor = String(tipo).trim().toLowerCase();

  const tipos = {
    aluno: 1,
    responsável: 2,
    responsavel: 2,
    profissional: 3,
    administrador: 4,
    adm: 4,
  };

  return tipos[valor] || null;
};

const criar = async (req, res) => {
  try {
    const dados = {
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha,
      tipo_de_usuario:
        req.body.tipo_de_usuario !== undefined
          ? normalizarTipo(req.body.tipo_de_usuario)
          : normalizarTipo(req.body.tipo),

      // Mantém o funcionamento do cadastro de profissional
      funcao: req.body.funcao || null,
    };

    if (!dados.nome || !dados.email || !dados.senha) {
      return res.status(400).json({
        erro: "Nome, e-mail e senha são obrigatórios",
      });
    }

    if (!dados.tipo_de_usuario) {
      return res.status(400).json({
        erro: "Tipo de usuário inválido",
      });
    }

    const novo = await usuarioModel.criar(dados);

    const { senha, ...seguro } = novo;

    res.status(201).json(seguro);
  } catch (e) {
    res.status(400).json({
      erro: e.message,
    });
  }
};

const atualizar = async (req, res) => {
  try {
    const dados = {};

    if (req.body.nome !== undefined) {
      dados.nome = req.body.nome;
    }

    if (req.body.email !== undefined) {
      dados.email = req.body.email;
    }

    if (req.body.senha !== undefined && req.body.senha !== "") {
      dados.senha = req.body.senha;
    }

    if (req.body.tipo_de_usuario !== undefined) {
      dados.tipo_de_usuario = normalizarTipo(req.body.tipo_de_usuario);
    } else if (req.body.tipo !== undefined) {
      dados.tipo_de_usuario = normalizarTipo(req.body.tipo);
    }

    if (dados.tipo_de_usuario !== undefined && !dados.tipo_de_usuario) {
      return res.status(400).json({
        erro: "Tipo de usuário inválido",
      });
    }

    // CORREÇÃO:
    // recebe a função enviada pelo formulário de edição
    if (req.body.funcao !== undefined) {
      dados.funcao =
        req.body.funcao === null ? null : String(req.body.funcao).trim();
    }

    const atualizado = await usuarioModel.atualizar(req.params.id, dados);

    if (!atualizado) {
      return res.status(404).json({
        erro: "Usuário não encontrado",
      });
    }

    const { senha, ...seguro } = atualizado;

    res.json(seguro);
  } catch (e) {
    res.status(400).json({
      erro: e.message,
    });
  }
};

const deletar = async (req, res) => {
  try {
    const ok = await usuarioModel.deletar(req.params.id);

    if (!ok) {
      return res.status(404).json({
        erro: "Usuário não encontrado",
      });
    }

    res.status(204).send();
  } catch (e) {
    res.status(400).json({
      erro: e.message,
    });
  }
};

module.exports = {
  listar,
  buscarPorId,
  login,
  criar,
  atualizar,
  deletar,
};
