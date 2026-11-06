import http from "./http";

const usuarioAPI = {
  login: async (dados) => {
    try {
      const resposta = await http.post("/usuarios/login", dados);

      return resposta.data;
    } catch (erro) {
      throw new Error(
        erro.response?.data?.mensagem || "E-mail ou senha incorretos!",
      );
    }
  },
  listar: async () => {
    try {
      const resposta = await http.get("/usuarios");

      return resposta.data;
    } catch (erro) {
      throw new Error(erro.response?.data?.mensagem || "Erro");
    }
  },
  criar: async (nome, email, senha, tipo_usuario) => {},
  // criar as funções de listagem, deleção, buscar usuario especifico
};

export default usuarioAPI;
