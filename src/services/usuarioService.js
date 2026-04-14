import api from './api';

function normalizeCategorias(categoriasRaw) {
  if (typeof categoriasRaw === 'string') {
    return [{ id: 0, nome: categoriasRaw }];
  }

  if (categoriasRaw && typeof categoriasRaw === 'object' && !Array.isArray(categoriasRaw)) {
    return [{
      id: Number(categoriasRaw.id ?? categoriasRaw.categoriaId ?? 0),
      nome: categoriasRaw.nome ?? categoriasRaw.nomeCategoria ?? categoriasRaw.descricao ?? 'Sem nome',
    }];
  }

  if (!Array.isArray(categoriasRaw)) {
    return [];
  }

  return categoriasRaw.map((cat) => ({
    id: Number(cat.id ?? cat.categoriaId ?? 0),
    nome: cat.nome ?? cat.nomeCategoria ?? cat.descricao ?? 'Sem nome',
  })).filter((cat) => cat.id > 0);
}

function normalizeUsuario(payload) {
  const usuario = payload?.usuario || payload;
  const categorias =
    usuario?.categorias ||
    usuario?.categoriasFavoritas ||
    usuario?.categoriaFavoritaNome ||
    usuario?.categoriaFavorita ||
    [];

  return {
    ...usuario,
    id: Number(usuario?.id ?? usuario?.usuarioId ?? 0),
    nome: usuario?.nome ?? '',
    email: usuario?.email ?? '',
    categorias: normalizeCategorias(categorias),
  };
}

export const usuarioService = {
  criar: async (userData) => {
    const response = await api.post('/api/Usuario', userData);
    return response.data;
  },

  perfil: async () => {
    const response = await api.get('/api/Usuario/perfil');
    return normalizeUsuario(response.data);
  },

  obterPorId: async (id) => {
    const response = await api.get(`/api/Usuario/${id}`);
    return normalizeUsuario(response.data);
  },

  atualizar: async (id, userData) => {
    const response = await api.put(`/api/Usuario/${id}`, userData);
    return normalizeUsuario(response.data);
  },
};
