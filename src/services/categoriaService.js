import api from './api';

export const categoriaService = {
  disponiveis: async () => {
    const response = await api.get('/api/usuario/categorias/disponiveis');
    return response.data;
  },
};
