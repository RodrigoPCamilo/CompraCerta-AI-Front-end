import api from './api';

export const historicoService = {
  listar: async () => {
    const response = await api.get('/api/historico-pesquisa');
    return response.data;
  },
};
