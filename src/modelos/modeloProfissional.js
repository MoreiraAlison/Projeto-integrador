const supabase = require("../database");

const profissionalModel = {
  async listar() {
    const { data, error } = await supabase
      .from("usuario")
      .select("id, nome, email, tipo_de_usuario")
      .eq("tipo_de_usuario", 3)
      .order("id");
    if (error) throw error;
    return data;
  },
  async buscarPorId(id) {
    const { data, error } = await supabase
      .from("usuario")
      .select("*, usuario(nome,email)")
      .eq("tipo_usuario", 3)
      .order("id");
    if (error) throw error;
    return data;
  },
  async criar(dados) {
    const { data, error } = await supabase
      .from("profissionais")
      .insert([dados])
      .select("*, usuarios(nome,email,cargo)")
      .single();
    if (error) throw error;
    return data;
  },
  async atualizar(id, dados) {
    const { data, error } = await supabase
      .from("profissionais")
      .update(dados)
      .eq("id", id)
      .select("*, usuarios(nome,email,cargo)")
      .maybeSingle();
    if (error) throw error;
    return data;
  },
  async deletar(id) {
    const { data, error } = await supabase
      .from("profissionais")
      .delete()
      .eq("id", id)
      .select();
    if (error) throw error;
    return data.length > 0;
  },
};
module.exports = profissionalModel;
