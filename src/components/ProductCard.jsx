import './ProductCard.css';
import { getProductImage } from '../utils/Getproductimage';

function isUrl(url) {
  try { const p = new URL(url); return p.protocol === 'http:' || p.protocol === 'https:'; }
  catch { return false; }
}

function isBroken(url) {
  if (!url) return true;
  const u = url.toLowerCase();
  return u.includes('placehold.co') || u.includes('via.placeholder') ||
    u.endsWith('produto-placeholder.svg') || u.endsWith('vite.svg') ||
    u.includes('dicebear') || u.includes('unsplash') === false && u.length < 10;
}

const STORE_COLORS = {
  amazon:           { bg: '#ff9900', text: '#111' },
  'mercado livre':  { bg: '#ffe600', text: '#111' },
  'magazine luiza': { bg: '#0086ff', text: '#fff' },
  magalu:           { bg: '#0086ff', text: '#fff' },
  shopee:           { bg: '#ee4d2d', text: '#fff' },
  americanas:       { bg: '#cc0022', text: '#fff' },
  kabum:            { bg: '#ff6a00', text: '#fff' },
};

function storeColor(loja) {
  if (!loja) return null;
  const l = loja.toLowerCase();
  for (const [k, v] of Object.entries(STORE_COLORS))
    if (l.includes(k)) return v;
  return null;
}

function calcDesc(oferta, original) {
  const parse = s => parseFloat(String(s || '').replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
  const o = parse(oferta), g = parse(original);
  if (g > o && o > 0) { const p = Math.round((1 - o / g) * 100); return p > 1 ? p : null; }
  return null;
}

export function ProductCard({ produto }) {
  const nome     = produto?.nomeProduto || 'Produto';
  const desc     = produto?.descricao   || '';
  const hasLink  = isUrl(produto?.linkProduto || '');
  const cor      = storeColor(produto?.loja);
  const desconto = calcDesc(produto?.precoOferta, produto?.precoOriginal)
    ?? (produto?.desconto ? parseInt(produto.desconto) || null : null);
  const temOriginal = produto?.precoOriginal &&
    produto.precoOriginal !== produto.precoOferta &&
    produto.precoOriginal !== 'R$ 0,00' &&
    produto.precoOriginal !== 'Consulte na loja';

  // Passa descrição junto ao nome → melhor detecção de categoria para a imagem
  const imgSrc = getProductImage(nome, desc);

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          src={imgSrc}
          alt={nome}
          className="product-image loaded"
          loading="lazy"
          onLoad={(e) => e.currentTarget.classList.add('loaded')}
          onError={(e) => {
            e.currentTarget.classList.add('loaded');
            e.currentTarget.src = getProductImage(nome + '_b', desc);
          }}
        />

        {produto?.loja && (
          <span className="product-store-badge"
            style={cor ? { background: cor.bg, color: cor.text, borderColor: 'transparent' } : {}}>
            {produto.loja}
          </span>
        )}

        {desconto && (
          <span className="product-discount-badge">-{desconto}%</span>
        )}
      </div>

      <div className="product-body">
        {produto?.categoriaNome && produto.categoriaNome !== 'Categoria não informada' && (
          <span className="product-category-tag">{produto.categoriaNome}</span>
        )}

        <h3 className="product-name">{nome}</h3>

        {desc && desc !== 'Sem descrição' && (
          <p className="product-description">{desc}</p>
        )}

        <div className="product-footer">
          <div className="product-price-group">
            {temOriginal && (
              <span className="product-price-original">{produto.precoOriginal}</span>
            )}
            <p className="product-price">
              {produto?.precoOferta || 'Consulte na loja'}
            </p>
            <span className="product-price-disclaimer">Estimativa · confira na loja</span>
          </div>

          {hasLink ? (
            <a href={produto.linkProduto} target="_blank"
               rel="noopener noreferrer" className="btn-offer">
              Ver oferta →
            </a>
          ) : (
            <button className="btn-offer btn-offer--disabled" disabled>
              Indisponível
            </button>
          )}
        </div>
      </div>
    </article>
  );
}