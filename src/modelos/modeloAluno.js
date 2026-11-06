const supabase = require("../database");

const alunoModel = {
  async listar() {
    const { data, error } = await supabase.from("alunos").select("*").order("id");
    if (error) throw error;
    return data;
  },
  async buscarPorId(id) {
    const { data, error } = await supabase.from("alunos").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  },
  async listarPorResponsavel(id) {
    const { data, error } = await supabase.from("alunos").select("*").eq("responsavel_id", id).order("id");
    if (error) throw error;
    return data;
  },
  async criar(dados) {
    const { data, error } = await supabase.from("alunos").insert([dados]).select().single();
    if (error) throw error;
    return data;
  },
  async atualizar(id, dados) {
    const { data, error } = await supabase.from("alunos").update(dados).eq("id", id).select().maybeSingle();
    if (error) throw error;
    return data;
  },
  async deletar(id) {
    const { data, error } = await supabase.from("alunos").delete().eq("id", id).select();
    if (error) throw error;
    return data.length > 0;
  }
};
module.exports = alunoModel;
