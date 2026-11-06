const supabase = require("../database");

const disponibilidadeModel = {
  async listar() {
    const { data, error } = await supabase
      .from("disponibilidade")
      .select("*")
      .order("id_funcionario")
      .order("dia")
      .order("horario");
    if (error) throw error;
    return data;
  },
  async listarPorProfissional(id) {
    const { data, error } = await supabase
      .from("disponibilidade")
      .select("*")
      .eq("id_funcionario", id)
      .eq("reservado", false)
      .order("dia")
      .order("horario");
    if (error) throw error;
    return data;
  },
  async criar(dados) {
    const { data, error } = await supabase
      .from("disponibilidade")
      .insert([dados])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async atualizar(id, dados) {
    const { data, error } = await supabase
      .from("disponibilidade")
      .update(dados)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },
  async deletar(id) {
    const { data, error } = await supabase
      .from("disponibilidade")
      .delete()
      .eq("id", id)
      .select();
    if (error) throw error;
    return data.length > 0;
  },
};
module.exports = disponibilidadeModel;
