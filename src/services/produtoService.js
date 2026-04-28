import api from './api';

const PLACEHOLDER = 'https://api.dicebear.com/9.x/shapes/svg?seed=';

function safe(v, fb = '') {
  if (v == null) return fb;
  const s = String(v).trim();
  return s || fb;
}

function isUrl(url) {
  try { const p = new URL(url); return p.protocol === 'http:' || p.protocol === 'https:'; }
  catch { return false; }
}

function isBroken(url) {
  if (!url) return true;
  const u = url.toLowerCase();
  return u.includes('placehold.co') || u.includes('via.placeholder') ||
    u.endsWith('produto-placeholder.svg') || u.endsWith('vite.svg');
}

function formatPreco(raw) {
  const t = safe(raw);
  if (!t) return 'Consulte na loja';

  // Rejeita qualquer valor zero ou placeholder
  const zeros = ['0', '0,00', '0.00', 'r$ 0,00', 'r$ 0', 'r$0,00', 'null', 'undefined'];
  if (zeros.includes(t.toLowerCase().trim())) return 'Consulte na loja';

  if (t.startsWith('R$') || t.startsWith('r$')) {
    const num = parseFloat(t.replace(/[^0-9.,]/g, '').replace(',', '.'));
    if (isNaN(num) || num <= 0) return 'Consulte na loja';
    return t;
  }

  const n = parseFloat(t.replace(/[^0-9.,]/g, '').replace(',', '.'));
  if (!isNaN(n) && n > 0)
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return null; // será substituído por estimarPreco
}

function buildLink(loja, nome) {
  const q = encodeURIComponent(safe(nome, 'produto'));
  const l = safe(loja).toLowerCase();
  if (l.includes('amazon'))     return `https://www.amazon.com.br/s?k=${q}`;
  if (l.includes('mercado'))    return `https://lista.mercadolivre.com.br/${q}`;
  if (l.includes('magazine') || l.includes('magalu'))
                                return `https://www.magazineluiza.com.br/busca/${q}/`;
  if (l.includes('shopee'))     return `https://shopee.com.br/search?keyword=${q}`;
  if (l.includes('americanas')) return `https://www.americanas.com.br/busca/${q}`;
  if (l.includes('kabum'))      return `https://www.kabum.com.br/busca/${q}`;
  return `https://www.google.com/search?q=${q}+${encodeURIComponent(loja)}`;
}



// Estimativa de preço por nome quando a IA retorna zero
// Baseado em preços reais do mercado brasileiro
function estimarPreco(nome) {
  const n = (nome || '').toLowerCase();

  // Games — consoles
  if (/playstation 5|ps5 console/.test(n))       return 'R$ 3.999,90';
  if (/xbox series x/.test(n))                    return 'R$ 3.999,90';
  if (/xbox series s/.test(n))                    return 'R$ 2.299,90';
  if (/nintendo switch oled/.test(n))             return 'R$ 2.499,90';
  if (/nintendo switch lite/.test(n))             return 'R$ 1.599,90';
  if (/nintendo switch/.test(n))                  return 'R$ 1.999,90';
  if (/playstation 4|ps4/.test(n))                return 'R$ 1.899,90';
  // Games — jogos
  if (/the last of us|god of war|red dead|cyberpunk|gta|fortnite|fifa|nba 2k|assassin/.test(n))
                                                   return 'R$ 249,90';
  if (/controller ps5|controle ps5/.test(n))      return 'R$ 449,90';
  if (/controller xbox|controle xbox/.test(n))    return 'R$ 399,90';

  // Smartphones
  if (/iphone 15 pro max/.test(n))                return 'R$ 8.999,90';
  if (/iphone 15 pro/.test(n))                    return 'R$ 7.999,90';
  if (/iphone 15/.test(n))                        return 'R$ 5.999,90';
  if (/iphone 14/.test(n))                        return 'R$ 4.499,90';
  if (/iphone 13/.test(n))                        return 'R$ 3.299,90';
  if (/iphone/.test(n))                           return 'R$ 2.999,90';
  if (/galaxy s24 ultra/.test(n))                 return 'R$ 7.999,90';
  if (/galaxy s24|galaxy s23/.test(n))            return 'R$ 4.999,90';
  if (/galaxy s22|galaxy s21/.test(n))            return 'R$ 2.999,90';
  if (/galaxy a54|galaxy a53|galaxy a52/.test(n)) return 'R$ 1.799,90';
  if (/galaxy a/.test(n))                         return 'R$ 1.299,90';
  if (/redmi note/.test(n))                       return 'R$ 1.299,90';
  if (/moto g/.test(n))                           return 'R$ 999,90';

  // Notebooks
  if (/macbook pro/.test(n))                      return 'R$ 11.999,90';
  if (/macbook air/.test(n))                      return 'R$ 8.499,90';
  if (/rog zephyrus|razer blade/.test(n))         return 'R$ 9.999,90';
  if (/rog|predator|legion|alienware/.test(n))    return 'R$ 6.999,90';
  if (/notebook|laptop/.test(n))                  return 'R$ 2.999,90';

  // TVs
  if (/oled|qled/.test(n))                        return 'R$ 4.999,90';
  if (/55"|65"|75"/.test(n))                      return 'R$ 2.999,90';
  if (/43"|50"/.test(n))                          return 'R$ 1.799,90';
  if (/smart tv|televisão/.test(n))               return 'R$ 1.499,90';

  // Fones
  if (/airpods pro/.test(n))                      return 'R$ 1.799,90';
  if (/airpods/.test(n))                          return 'R$ 1.299,90';
  if (/sony wh-1000|bose 700/.test(n))            return 'R$ 1.499,90';
  if (/jbl/.test(n))                              return 'R$ 299,90';
  if (/fone|headphone|headset|earbuds/.test(n))   return 'R$ 199,90';

  // Tênis
  if (/yeezy|jordan/.test(n))                     return 'R$ 999,90';
  if (/ultraboost|air max/.test(n))               return 'R$ 699,90';
  if (/adidas|nike/.test(n))                      return 'R$ 499,90';
  if (/tênis|tenis/.test(n))                      return 'R$ 299,90';

  // Eletrodomésticos
  if (/geladeira|refrigerador/.test(n))           return 'R$ 2.999,90';
  if (/lavadora|máquina de lavar/.test(n))        return 'R$ 1.999,90';
  if (/ar condicionado|split/.test(n))            return 'R$ 1.799,90';
  if (/airfryer|fritadeira/.test(n))              return 'R$ 399,90';
  if (/microondas/.test(n))                       return 'R$ 499,90';

  return 'R$ 299,90';
}

// Gera ID temporário determinístico quando o produto vem da IA (sem ID do banco)
// Mesmo produto+loja sempre gera o mesmo ID — evita duplicatas no React key
function gerarIdTemp(nome, loja) {
  const str = `${nome}|${loja}`;
  let h = 5381;
  for (let i = 0; i < str.length; i++)
    h = ((h << 5) + h) ^ str.charCodeAt(i);
  return `ai_${Math.abs(h >>> 0)}`;
}

function normalize(p) {
  const nome  = safe(p?.nomeProduto ?? p?.nome, 'Produto sem nome');
  const loja  = safe(p?.loja ?? p?.nomeLoja, 'Loja');
  const imgRaw = safe(p?.imagemUrl ?? p?.imagemURL ?? p?.imageUrl ?? p?.urlImagem);

  return {
    id:            p?.id ?? gerarIdTemp(nome, loja),
    nomeProduto:   nome,
    precoOferta:   formatPreco(p?.precoOferta ?? p?.preco) ?? estimarPreco(nome),
    precoOriginal: formatPreco(p?.precoOriginal) === 'Consulte na loja' ? '' : formatPreco(p?.precoOriginal),
    desconto:      safe(p?.desconto),
    descricao:     safe(p?.descricao ?? p?.descricaoProduto),
    // Deixar vazio — ProductCard usa getProductImage(nome) como fallback
    // Não usar DiceBear pois bloqueia o getProductImage de funcionar
    imagemUrl:     isBroken(imgRaw) ? '' : imgRaw,
    loja,
    linkProduto:   isUrl(safe(p?.linkProduto ?? p?.urlProduto ?? p?.link))
      ? safe(p?.linkProduto ?? p?.urlProduto ?? p?.link)
      : buildLink(loja, nome),
    categoriaNome: safe(p?.categoriaNome ?? p?.categoria),
  };
}

function normalizeList(payload) {
  const list = Array.isArray(payload) ? payload
    : payload?.produtos || payload?.data || payload?.items || [];
  return list.map(normalize);
}

function dedup(list) {
  const seen = new Set();
  return list.filter(p => {
    const k = `${p.nomeProduto}|${p.loja}`;
    return seen.has(k) ? false : seen.add(k);
  });
}

export const produtoService = {
  // Recomendações baseadas na categoria favorita — máximo 12
  recommendations: async () => {
    const res = await api.get('/api/products/recommendations');
    return dedup(normalizeList(res.data));
  },

  // Busca livre — qualquer produto, sem depender da categoria favorita
  search: async (query) => {
    const res = await api.get('/api/products/search', { params: { query } });
    return dedup(normalizeList(res.data));
  },
};