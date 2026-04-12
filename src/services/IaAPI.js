import api from "./client";

const IaAPI = {
  async perguntarAsync(usuarioId, pergunta) {
    try {
      const response = await api.post(`/ia/perguntar/${usuarioId}`, { pergunta });
      return response.data;
    } catch (error) {
      console.error("Erro ao perguntar para IA", error);
      throw error;
    }
  },

  async historicoAsync() {
    try {
      const response = await api.get("/ia/historico");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar histórico", error);
      throw error;
    }
  }
};

export default IaAPI;
