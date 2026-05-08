import api from './api';
import { getProductImage } from '../utils/Getproductimage';

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
  const invalidos = ['0', '0,00', '0.00', 'r$ 0,00', 'r$ 0', 'r$0,00', 'null', 'undefined'];
  if (invalidos.includes(t.toLowerCase().trim())) return 'Consulte na loja';
  if (t.startsWith('R$') || t.startsWith('r$')) {
    const num = parseFloat(t.replace(/[^0-9.,]/g, '').replace(',', '.'));
    if (isNaN(num) || num <= 0) return 'Consulte na loja';
    return t;
  }
  const n = parseFloat(t.replace(/[^0-9.,]/g, '').replace(',', '.'));
  if (!isNaN(n) && n > 0)
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return null;
}

// ─── Links de busca por loja ──────────────────────────────────────────────────
const TODAS_LOJAS = ['Amazon', 'Mercado Livre', 'Magazine Luiza', 'Shopee', 'Americanas', 'Kabum'];

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

// ─── Compatibilidade loja × produto (allowlist) ───────────────────────────────
const LOJAS_RESTRITAS = {
  kabum: [
    'iphone', 'galaxy', 'smartphone', 'celular', 'tablet', 'ipad', 'xiaomi', 'moto ',
    'notebook', 'laptop', 'macbook', 'desktop', 'computador', 'pc gamer',
    'processador', 'placa mae', 'placa mãe', 'memoria ram', 'memória ram',
    'ssd', 'hd externo', 'fonte atx', 'gabinete', 'cooler',
    'rtx', 'gtx', 'rx 6', 'rx 7', 'placa de video', 'placa de vídeo', 'gpu',
    'monitor', 'teclado', 'mouse gamer', 'mousepad', 'webcam', 'cadeira gamer',
    'headset', 'fone gamer', 'headphone gamer',
    'camera', 'câmera', 'gopro', 'smart tv', 'televisao', 'televisão', 'tv ',
    'playstation', 'ps5', 'ps4', 'xbox', 'nintendo', 'controle gamer',
    'jogo ps', 'jogo xbox', 'jogo nintendo', 'game ',
    'smartwatch', 'apple watch', 'galaxy watch',
    'roteador', 'cabo hdmi', 'cabo usb', 'pen drive', 'carregador',
    'nobreak', 'impressora', 'projetor',
  ],
};

function lojaProvavelmenteTemProduto(loja, nomeProduto, descricao = '') {
  const l = loja.toLowerCase();
  const texto = (nomeProduto + ' ' + descricao).toLowerCase();
  for (const [lojaKey, termosPermitidos] of Object.entries(LOJAS_RESTRITAS)) {
    if (l.includes(lojaKey)) {
      const compativel = termosPermitidos.some(t => texto.includes(t));
      if (!compativel) return false;
    }
  }
  return true;
}

// ─── Filtra e completa cards com lojas válidas ────────────────────────────────
async function filtrarECompletar(produtos, limite = 12) {
  if (!produtos.length) return produtos;

  const validos   = [];
  const suspeitos = [];

  for (const p of produtos) {
    if (!lojaProvavelmenteTemProduto(p.loja, p.nomeProduto, p.descricao)) {
      suspeitos.push(p);
    } else {
      validos.push(p);
    }
  }

  const lojasJaUsadas = new Set(
    validos.map(p => `${norm(p.nomeProduto)}|${norm(p.loja)}`)
  );

  const extras = [];

  for (const prod of suspeitos) {
    const candidatas = TODAS_LOJAS.filter(loja => {
      const chave = `${norm(prod.nomeProduto)}|${norm(loja)}`;
      return !lojasJaUsadas.has(chave) &&
             lojaProvavelmenteTemProduto(loja, prod.nomeProduto, prod.descricao);
    });

    if (candidatas.length > 0) {
      const lojaAlternativa = candidatas[0];
      const chave = `${norm(prod.nomeProduto)}|${norm(lojaAlternativa)}`;
      lojasJaUsadas.add(chave);
      extras.push({
        ...prod,
        loja: lojaAlternativa,
        linkProduto: buildLink(lojaAlternativa, prod.nomeProduto),
      });
    }
  }

  const resultado = dedup([...validos, ...extras]).slice(0, limite);

  if (resultado.length < limite && validos.length > 0) {
    const produtosBase = validos.slice(0, 3);
    for (const prod of produtosBase) {
      for (const loja of TODAS_LOJAS) {
        if (resultado.length >= limite) break;
        const chave = `${norm(prod.nomeProduto)}|${norm(loja)}`;
        if (lojasJaUsadas.has(chave)) continue;
        if (!lojaProvavelmenteTemProduto(loja, prod.nomeProduto, prod.descricao)) continue;
        lojasJaUsadas.add(chave);
        resultado.push({
          ...prod,
          id: `fill_${norm(prod.nomeProduto)}_${norm(loja)}`,
          loja,
          linkProduto: buildLink(loja, prod.nomeProduto),
        });
      }
      if (resultado.length >= limite) break;
    }
  }

  return resultado.slice(0, limite);
}

function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

// ─── Estimativa de preço ──────────────────────────────────────────────────────
function estimarPreco(nome) {
  const n = (nome || '').toLowerCase();
  if (/playstation 5|ps5\b/.test(n))    return 'R$ 3.699,90';
  if (/xbox series x/.test(n))          return 'R$ 3.999,90';
  if (/xbox series s/.test(n))          return 'R$ 2.199,90';
  if (/nintendo switch oled/.test(n))   return 'R$ 2.499,90';
  if (/nintendo switch lite/.test(n))   return 'R$ 1.599,90';
  if (/nintendo switch/.test(n))        return 'R$ 1.999,90';
  if (/iphone 15 pro max/.test(n))      return 'R$ 8.499,90';
  if (/iphone 15 pro/.test(n))          return 'R$ 7.299,90';
  if (/iphone 15/.test(n))              return 'R$ 5.499,90';
  if (/iphone 14/.test(n))              return 'R$ 4.299,90';
  if (/iphone/.test(n))                 return 'R$ 2.999,90';
  if (/galaxy s24 ultra/.test(n))       return 'R$ 8.299,90';
  if (/galaxy s24/.test(n))             return 'R$ 4.499,90';
  if (/galaxy a/.test(n))               return 'R$ 1.299,90';
  if (/redmi note/.test(n))             return 'R$ 1.299,90';
  if (/moto g/.test(n))                 return 'R$ 999,90';
  if (/macbook pro m3/.test(n))         return 'R$ 14.999,90';
  if (/macbook air m3/.test(n))         return 'R$ 9.499,90';
  if (/macbook air m2/.test(n))         return 'R$ 7.999,90';
  if (/macbook pro/.test(n))            return 'R$ 11.999,90';
  if (/macbook air/.test(n))            return 'R$ 8.499,90';
  if (/notebook gamer/.test(n))         return 'R$ 5.999,90';
  if (/notebook|laptop/.test(n))        return 'R$ 2.999,90';
  if (/airpods pro/.test(n))            return 'R$ 1.799,90';
  if (/airpods max/.test(n))            return 'R$ 4.299,90';
  if (/airpods/.test(n))                return 'R$ 1.199,90';
  if (/sony wh-1000xm5/.test(n))        return 'R$ 1.599,90';
  if (/jbl flip/.test(n))               return 'R$ 699,90';
  if (/jbl/.test(n))                    return 'R$ 399,90';
  if (/apple watch ultra/.test(n))      return 'R$ 6.499,90';
  if (/apple watch se/.test(n))         return 'R$ 2.499,90';
  if (/apple watch/.test(n))            return 'R$ 3.499,90';
  if (/galaxy watch/.test(n))           return 'R$ 1.799,90';
  if (/garmin/.test(n))                 return 'R$ 2.499,90';
  if (/amazfit/.test(n))                return 'R$ 499,90';
  if (/smartwatch/.test(n))             return 'R$ 499,90';
  if (/oled|qled/.test(n))              return 'R$ 3.999,90';
  if (/smart tv/.test(n))               return 'R$ 1.499,90';
  if (/adidas ultraboost/.test(n))      return 'R$ 699,90';
  if (/nike air max|air force 1/.test(n)) return 'R$ 699,90';
  if (/air jordan/.test(n))             return 'R$ 1.199,90';
  if (/yeezy/.test(n))                  return 'R$ 1.299,90';
  if (/adidas|nike/.test(n))            return 'R$ 499,90';
  if (/tênis|tenis/.test(n))            return 'R$ 299,90';
  if (/whey protein/.test(n))           return 'R$ 99,90';
  if (/creatina/.test(n))               return 'R$ 59,90';
  if (/kettlebell/.test(n))             return 'R$ 149,90';
  if (/halter/.test(n))                 return 'R$ 89,90';
  if (/esteira/.test(n))                return 'R$ 1.499,90';
  if (/geladeira|refrigerador/.test(n)) return 'R$ 2.999,90';
  if (/lavadora|máquina de lavar/.test(n)) return 'R$ 1.999,90';
  if (/airfryer|fritadeira/.test(n))    return 'R$ 399,90';
  if (/microondas/.test(n))             return 'R$ 499,90';
  if (/perfume/.test(n))                return 'R$ 199,90';
  if (/livro|mangá/.test(n))            return 'R$ 49,90';
  if (/camiseta|camisa|vestido/.test(n)) return 'R$ 89,90';
  if (/jaqueta|moletom/.test(n))        return 'R$ 199,90';
  return 'R$ 299,90';
}

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
  const desc  = safe(p?.descricao ?? p?.descricaoProduto);
  const imgRaw = safe(p?.imagemUrl ?? p?.imagemURL ?? p?.imageUrl ?? p?.urlImagem);

  return {
    id:            p?.id ?? gerarIdTemp(nome, loja),
    nomeProduto:   nome,
    precoOferta:   formatPreco(p?.precoOferta ?? p?.preco) ?? estimarPreco(nome),
    precoOriginal: formatPreco(p?.precoOriginal) === 'Consulte na loja'
      ? '' : formatPreco(p?.precoOriginal),
    desconto:      safe(p?.desconto),
    descricao:     desc,
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
    const k = `${norm(p.nomeProduto)}|${norm(p.loja)}`;
    return seen.has(k) ? false : seen.add(k);
  });
}

export const produtoService = {
  recommendations: async () => {
    const res = await api.get('/api/products/recommendations');
    const produtos = dedup(normalizeList(res.data));
    return filtrarECompletar(produtos, 12);
  },

  search: async (query) => {
    const res = await api.get('/api/products/search', { params: { query } });
    const produtos = dedup(normalizeList(res.data));
    return filtrarECompletar(produtos, 12);
  },
};