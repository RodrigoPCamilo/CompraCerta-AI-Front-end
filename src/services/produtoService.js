import api from './api';

export const produtoService = {
  recommendations: async () => {
    const response = await api.get('/api/products/recommendations');
    return response.data;
  },

  search: async (query) => {
    const response = await api.get('/api/products/search', { params: { query } });
    return response.data;
  },
};
