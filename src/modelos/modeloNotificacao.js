const supabase = require("../database");

const notificacaoModel = {
  async listarPorUsuario(usuario_id) {
    const { data, error } = await supabase.from("notificacoes").select("*").eq("usuario_id", usuario_id).order("data", { ascending: false });
    if (error) throw error;
    return data;
  },
  async criar(dados) {
    const { data, error } = await supabase.from("notificacoes").insert([dados]).select().single();
    if (error) throw error;
    return data;
  },
  async marcarComoLida(id) {
    const { data, error } = await supabase.from("notificacoes").update({ lida: true }).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }
};
module.exports = notificacaoModel;
