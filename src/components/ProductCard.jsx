import './ProductCard.css';

export function ProductCard({ imagemUrl, nomeProduto, descricao, loja, categoriaNome, linkProduto }) {
  const placeholderImage = 'https://via.placeholder.com/200?text=Produto';

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={imagemUrl || placeholderImage} alt={nomeProduto} />
      </div>

      <div className="product-info">
        <h3 className="product-nome">{nomeProduto}</h3>

        <p className="product-descricao">{descricao}</p>

        <div className="product-meta">
          <span className="product-loja">🏪 {loja}</span>
          <span className="product-categoria">📌 {categoriaNome}</span>
        </div>

        <a
          href={linkProduto}
          target="_blank"
          rel="noopener noreferrer"
          className="product-btn"
        >
          Ver oferta
        </a>
      </div>
    </div>
  );
}
