const supabase = require("../database");

const usuarioModel = {
  async listar() {
    const { data, error } = await supabase
      .from("usuario")
      .select(
        `
        *,
        tipo_usuario (*)
      `,
      )
      .order("id");

    if (error) throw error;

    return data;
  },

  async buscarPorId(id) {
    const { data, error } = await supabase
      .from("usuario")
      .select(
        `
        *,
        tipo_usuario (*)
      `,
      )
      .eq("id", id)
      .single();

    if (error && error.code === "PGRST116") {
      return null;
    }

    if (error) throw error;

    return data;
  },

  async buscarPorEmail(email) {
    const { data, error } = await supabase
      .from("usuario")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;

    return data;
  },

  async login(email, senha) {
    const { data, error } = await supabase
      .from("usuario")
      .select(
        `
        *,
        tipo_usuario (*)
      `,
      )
      .eq("email", email)
      .eq("senha", senha)
      .maybeSingle();

    if (error) throw error;

    return data;
  },

  async criar(dados) {
    const existente = await usuarioModel.buscarPorEmail(dados.email);

    if (existente) {
      throw new Error("E-mail já cadastrado");
    }

    const { data, error } = await supabase
      .from("usuario")
      .insert([
        {
          nome: dados.nome,
          email: dados.email,
          senha: dados.senha,
          tipo_de_usuario: dados.tipo_de_usuario,
          funcao: dados.funcao || null,
        },
      ])
      .select(
        `
        *,
        tipo_usuario (*)
      `,
      )
      .single();

    if (error) throw error;

    return data;
  },

  async atualizar(id, dados) {
    const dadosAtualizacao = {};

    if (dados.nome !== undefined) {
      dadosAtualizacao.nome = dados.nome;
    }

    if (dados.email !== undefined) {
      dadosAtualizacao.email = dados.email;
    }

    if (dados.senha !== undefined) {
      dadosAtualizacao.senha = dados.senha;
    }

    if (dados.tipo_de_usuario !== undefined) {
      dadosAtualizacao.tipo_de_usuario = dados.tipo_de_usuario;
    }

    // CORREÇÃO:
    // salva a função na coluna usuario.funcao
    if (dados.funcao !== undefined) {
      dadosAtualizacao.funcao = dados.funcao;
    }

    if (dados.email !== undefined) {
      const usuarioExistente = await usuarioModel.buscarPorEmail(dados.email);

      if (usuarioExistente && Number(usuarioExistente.id) !== Number(id)) {
        throw new Error("E-mail já cadastrado");
      }
    }

    const { data, error } = await supabase
      .from("usuario")
      .update(dadosAtualizacao)
      .eq("id", id)
      .select(
        `
        *,
        tipo_usuario (*)
      `,
      )
      .single();

    if (error && error.code === "PGRST116") {
      return null;
    }

    if (error) throw error;

    return data;
  },

  async deletar(id) {
    const { data, error } = await supabase
      .from("usuario")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;

    return data && data.length > 0;
  },
};

module.exports = usuarioModel;
