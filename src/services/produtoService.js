import api from './api';

const PLACEHOLDER_IMAGE = '/produto-placeholder.svg';

function safeText(value, fallback = '') {
  if (value === null || value === undefined) {
    return fallback;
  }
  const text = String(value).trim();
  return text || fallback;
}

function isValidHttpUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function isPlaceholderImage(url) {
  const normalized = safeText(url).toLowerCase();
  return !normalized || normalized.includes('placehold.co') || normalized.includes('via.placeholder.com');
}

function normalizePrecoOferta(rawPrice) {
  const text = safeText(rawPrice);
  if (!text) {
    return 'Consulte na loja';
  }

  const asNumber = Number(String(rawPrice).replace(',', '.').replace(/[^0-9.]/g, ''));
  if (!Number.isNaN(asNumber) && asNumber > 0) {
    return asNumber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return text;
}

function isConsultePrice(preco) {
  return safeText(preco).toLowerCase() === 'consulte na loja';
}

function buildStoreSearchLink(loja, nomeProduto) {
  const term = encodeURIComponent(safeText(nomeProduto, 'produto'));
  const normalizedStore = safeText(loja).toLowerCase();

  if (normalizedStore.includes('shopee')) {
    return `https://shopee.com.br/search?keyword=${term}`;
  }
  if (normalizedStore.includes('magazine') || normalizedStore.includes('magalu')) {
    return `https://www.magazineluiza.com.br/busca/${term}/`;
  }
  if (normalizedStore.includes('mercado')) {
    return `https://lista.mercadolivre.com.br/${term}`;
  }
  if (normalizedStore.includes('amazon')) {
    return `https://www.amazon.com.br/s?k=${term}`;
  }

  return `https://www.google.com/search?q=${term}`;
}

function chooseStableLink(rawLink, loja, nomeProduto, precoOferta) {
  const link = safeText(rawLink);
  if (!isValidHttpUrl(link)) {
    return buildStoreSearchLink(loja, nomeProduto);
  }

  const lower = link.toLowerCase();
  const isSearchLike =
    lower.includes('/search') ||
    lower.includes('/busca') ||
    lower.includes('s?k=') ||
    lower.includes('lista.mercadolivre');

  // Produtos com preço costumam vir com links diretos expirados.
  // Nesses casos, prioriza link de busca por loja para reduzir 404.
  if (!isConsultePrice(precoOferta) && !isSearchLike) {
    return buildStoreSearchLink(loja, nomeProduto);
  }

  return link;
}

function scoreProduto(produto) {
  let score = 0;
  if (!isPlaceholderImage(produto.imagemUrl)) {
    score += 2;
  }
  if (safeText(produto.precoOferta).toLowerCase() !== 'consulte na loja') {
    score += 2;
  }
  if (isValidHttpUrl(produto.linkProduto)) {
    score += 1;
  }
  return score;
}

function normalizeProduto(produto) {
  const nomeProduto = safeText(produto?.nomeProduto ?? produto?.nome, 'Produto sem nome');
  const loja = safeText(produto?.loja ?? produto?.nomeLoja, 'Loja não informada');
  const imagemUrlRaw = safeText(
    produto?.imagemUrl ??
      produto?.imagemURL ??
      produto?.imageUrl ??
      produto?.urlImagem
  );

  const precoOferta = normalizePrecoOferta(produto?.precoOferta ?? produto?.preco ?? produto?.valorOferta);

  return {
    id: produto?.id ?? produto?.produtoId ?? null,
    nomeProduto,
    precoOferta,
    descricao: safeText(produto?.descricao ?? produto?.descricaoProduto, 'Sem descrição'),
    imagemUrl: isPlaceholderImage(imagemUrlRaw) ? PLACEHOLDER_IMAGE : imagemUrlRaw,
    loja,
    linkProduto: chooseStableLink(produto?.linkProduto ?? produto?.urlProduto ?? produto?.link, loja, nomeProduto, precoOferta),
    categoriaNome: safeText(produto?.categoriaNome ?? produto?.categoria, 'Categoria não informada'),
  };
}

function normalizeLista(payload) {
  const list = Array.isArray(payload)
    ? payload
    : payload?.produtos || payload?.data || payload?.items || [];

  return list.map(normalizeProduto);
}

function dedupeProdutos(produtos) {
  const seen = new Set();
  const result = [];

  for (const produto of produtos) {
    const key = produto.id || `${produto.nomeProduto}-${produto.linkProduto}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(produto);
    }
  }

  return result;
}

function prioritizeProdutos(produtos) {
  return [...produtos].sort((a, b) => scoreProduto(b) - scoreProduto(a));
}

export const produtoService = {
  recommendations: async (minimo = 10) => {
    const response = await api.get('/api/products/recommendations');
    let recomendacoes = normalizeLista(response.data);

    if (recomendacoes.length >= minimo) {
      return recomendacoes;
    }

    // Completa a lista com resultados gerais para manter no mínimo 10 cards.
    try {
      const complemento = await api.get('/api/products/search', { params: { query: 'a' } });
      recomendacoes = dedupeProdutos([...recomendacoes, ...normalizeLista(complemento.data)]);
    } catch {
      // Mantém apenas recomendações se busca de complemento falhar.
    }

    return prioritizeProdutos(recomendacoes).slice(0, minimo);
  },

  search: async (query) => {
    const response = await api.get('/api/products/search', { params: { query } });
    return prioritizeProdutos(normalizeLista(response.data));
  },
};
