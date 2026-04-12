import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Loading } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { produtoService } from '../services/produtoService';
import './Home.css';

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    carregarRecomendacoes();
  }, []);

  const carregarRecomendacoes = async () => {
    try {
      setLoading(true);
      setErro('');
      const data = await produtoService.recommendations();
      setProdutos(data);
    } catch (err) {
      console.error('Erro ao carregar recomendações:', err);
      setErro('Erro ao carregar produtos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      carregarRecomendacoes();
      return;
    }

    try {
      setBuscando(true);
      setErro('');
      const data = await produtoService.search(searchQuery);
      setProdutos(data);
    } catch (err) {
      console.error('Erro na busca:', err);
      setErro('Erro ao buscar produtos. Tente novamente.');
    } finally {
      setBuscando(false);
    }
  };

  const handleLimparBusca = () => {
    setSearchQuery('');
    carregarRecomendacoes();
  };

  if (loading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="home-container">
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={buscando}
              className="search-input"
            />
            <button
              type="submit"
              disabled={buscando}
              className="search-button"
            >
              {buscando ? 'Buscando...' : 'Buscar'}
            </button>
          </form>

          {searchQuery && (
            <button onClick={handleLimparBusca} className="clear-search-btn">
              Limpar busca
            </button>
          )}
        </div>

        {erro && <div className="error-message">{erro}</div>}

        {produtos.length === 0 ? (
          <EmptyState message="Nenhum produto encontrado" />
        ) : (
          <div className="products-grid">
            {produtos.slice(0, 10).map((produto) => (
              <ProductCard
                key={produto.id}
                imagemUrl={produto.imagemUrl}
                nomeProduto={produto.nomeProduto}
                descricao={produto.descricao}
                loja={produto.loja}
                categoriaNome={produto.categoriaNome}
                linkProduto={produto.linkProduto}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
