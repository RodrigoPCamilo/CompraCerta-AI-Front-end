import api from './api';

export const usuarioService = {
  criar: async (userData) => {
    const response = await api.post('/api/usuario', userData);
    return response.data;
  },

  perfil: async () => {
    const response = await api.get('/api/usuario/perfil');
    return response.data;
  },

  obterPorId: async (id) => {
    const response = await api.get(`/api/usuario/${id}`);
    return response.data;
  },

  atualizar: async (id, userData) => {
    const response = await api.put(`/api/usuario/${id}`, userData);
    return response.data;
  },
};
