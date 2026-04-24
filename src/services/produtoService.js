import api from './api';

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/1a1a25/f97316?text=Produto';

function safeText(value, fallback = '') {
  if (value === null || value === undefined) return fallback;
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
  return (
    !normalized ||
    normalized.includes('placehold.co') ||
    normalized.includes('via.placeholder.com') ||
    normalized.endsWith('produto-placeholder.svg')
  );
}

function normalizePrecoOferta(rawPrice) {
  const text = safeText(rawPrice);
  if (!text) return 'Consulte na loja';

  // Já está formatado como "R$ X,XX" — retorna direto
  if (text.startsWith('R$')) return text;

  const asNumber = Number(String(rawPrice).replace(',', '.').replace(/[^0-9.]/g, ''));
  if (!Number.isNaN(asNumber) && asNumber > 0) {
    return asNumber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return text;
}

function buildStoreSearchLink(loja, nomeProduto) {
  const term = encodeURIComponent(safeText(nomeProduto, 'produto'));
  const normalizedStore = safeText(loja).toLowerCase();

  if (normalizedStore.includes('amazon'))
    return `https://www.amazon.com.br/s?k=${term}`;
  if (normalizedStore.includes('mercado'))
    return `https://lista.mercadolivre.com.br/${term}`;
  if (normalizedStore.includes('magazine') || normalizedStore.includes('magalu'))
    return `https://www.magazineluiza.com.br/busca/${term}/`;
  if (normalizedStore.includes('shopee'))
    return `https://shopee.com.br/search?keyword=${term}`;
  if (normalizedStore.includes('americanas'))
    return `https://www.americanas.com.br/busca/${term}`;
  if (normalizedStore.includes('kabum'))
    return `https://www.kabum.com.br/busca/${term}`;

  return `https://www.google.com/search?q=${term}+${encodeURIComponent(loja)}`;
}

function normalizeLink(rawLink, loja, nomeProduto) {
  // Se não tem link válido, gera um de busca
  if (!isValidHttpUrl(safeText(rawLink))) {
    return buildStoreSearchLink(loja, nomeProduto);
  }
  // Link válido — retorna como está (o backend já corrigiu o formato)
  return rawLink;
}

function normalizeProduto(produto) {
  const nomeProduto = safeText(produto?.nomeProduto ?? produto?.nome, 'Produto sem nome');
  const loja = safeText(produto?.loja ?? produto?.nomeLoja, 'Loja não informada');

  const imagemUrlRaw = safeText(
    produto?.imagemUrl ?? produto?.imagemURL ?? produto?.imageUrl ?? produto?.urlImagem
  );

  const precoOferta = normalizePrecoOferta(
    produto?.precoOferta ?? produto?.preco ?? produto?.valorOferta
  );

  const imagemUrl = isPlaceholderImage(imagemUrlRaw) ? PLACEHOLDER_IMAGE : imagemUrlRaw;

  const linkProduto = normalizeLink(
    produto?.linkProduto ?? produto?.urlProduto ?? produto?.link,
    loja,
    nomeProduto
  );

  return {
    // id pode ser null para produtos gerados pela IA — tudo bem
    id: produto?.id ?? produto?.produtoId ?? null,
    nomeProduto,
    precoOferta,
    descricao: safeText(produto?.descricao ?? produto?.descricaoProduto, 'Sem descrição'),
    imagemUrl,
    loja,
    linkProduto,
    categoriaNome: safeText(produto?.categoriaNome ?? produto?.categoria, ''),
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
    // NUNCA usar id como chave — pode ser null para todos os produtos da IA
    const key = `${produto.nomeProduto}|${produto.loja}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(produto);
    }
  }
  return result;
}

function scoreProduto(produto) {
  let score = 0;
  if (!isPlaceholderImage(produto.imagemUrl)) score += 2;
  if (produto.precoOferta && produto.precoOferta.toLowerCase() !== 'consulte na loja') score += 2;
  if (isValidHttpUrl(produto.linkProduto)) score += 1;
  return score;
}

function prioritizeProdutos(produtos) {
  return [...produtos].sort((a, b) => scoreProduto(b) - scoreProduto(a));
}

export const produtoService = {
  recommendations: async (minimo = 10) => {
    const response = await api.get('/api/products/recommendations');
    let recomendacoes = normalizeLista(response.data);

    if (recomendacoes.length >= minimo) {
      return dedupeProdutos(recomendacoes);
    }

    // Complementa se tiver menos de 10
    try {
      const complemento = await api.get('/api/products/search', { params: { query: 'ofertas' } });
      recomendacoes = dedupeProdutos([...recomendacoes, ...normalizeLista(complemento.data)]);
    } catch {
      // mantém só as recomendações se a busca complementar falhar
    }

    return prioritizeProdutos(recomendacoes).slice(0, minimo);
  },

  search: async (query) => {
    const response = await api.get('/api/products/search', { params: { query } });
    const lista = normalizeLista(response.data);
    return prioritizeProdutos(dedupeProdutos(lista));
  },
};