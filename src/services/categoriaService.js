import api from './api';

const CATEGORY_ENDPOINTS = [
  '/api/Usuario/categorias/disponiveis',
  '/api/Usuario/categorias',
  '/api/usuario/categorias/disponiveis',
  '/api/categorias/disponiveis',
];

function normalizeCategorias(payload) {
  const list = Array.isArray(payload)
    ? payload
    : payload?.categorias || payload?.data || payload?.items || [];

  return list.map((cat) => ({
    id: Number(cat.id ?? cat.categoriaId ?? 0),
    nome: cat.nome ?? cat.nomeCategoria ?? cat.descricao ?? 'Sem nome',
    descricao: cat.descricao ?? '',
  })).filter((cat) => cat.id > 0);
}

export const categoriaService = {
  disponiveis: async () => {
    let lastError;

    for (const endpoint of CATEGORY_ENDPOINTS) {
      try {
        const response = await api.get(endpoint);
        const categorias = normalizeCategorias(response.data);

        if (categorias.length > 0) {
          return categorias;
        }
      } catch (error) {
        // Se a API respondeu algo diferente de 404, esse é o erro real.
        // Evita mascarar 401 com erro de rota do fallback.
        if (error?.response?.status && error.response.status !== 404) {
          throw error;
        }
        lastError = error;
      }
    }

    throw lastError || new Error('Nenhum endpoint de categorias retornou dados.');
  },
};
