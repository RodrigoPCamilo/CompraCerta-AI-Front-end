import './ProductCard.css';

const PLACEHOLDER_IMAGE = '/produto-placeholder.svg';

function isValidHttpUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function ProductCard({ produto }) {
  const hasValidLink = isValidHttpUrl(produto?.linkProduto || '');

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          src={produto?.imagemUrl || PLACEHOLDER_IMAGE}
          alt={produto?.nomeProduto || 'Produto'}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            if (e.currentTarget.src.endsWith(PLACEHOLDER_IMAGE)) return;
            e.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
        />
        {produto?.loja && (
          <span className="product-store-badge">{produto.loja}</span>
        )}
      </div>

      <div className="product-body">
        {produto?.categoriaNome && produto.categoriaNome !== 'Categoria não informada' && (
          <span className="product-category-tag">{produto.categoriaNome}</span>
        )}

        <h3 className="product-name">{produto?.nomeProduto || 'Produto sem nome'}</h3>

        {produto?.descricao && produto.descricao !== 'Sem descrição' && (
          <p className="product-description">{produto.descricao}</p>
        )}

        <div className="product-footer">
          <p className="product-price">{produto?.precoOferta || 'Consulte na loja'}</p>

          {hasValidLink ? (
            <a
              href={produto.linkProduto}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-offer"
            >
              Ver oferta →
            </a>
          ) : (
            <button className="btn-offer disabled" disabled>
              Indisponível
            </button>
          )}
        </div>
      </div>
    </article>
  );
}