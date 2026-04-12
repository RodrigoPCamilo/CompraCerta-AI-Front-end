
import api from "./client";

const AuthAPI = {
  async loginAsync(email, senha) {
    try {
      const response = await api.post("/auth/login", { email, senha });
      return response.data;
    } catch (error) {
      console.error("Erro no login", error);
      throw error;
    }
  },
};

export default AuthAPI;
