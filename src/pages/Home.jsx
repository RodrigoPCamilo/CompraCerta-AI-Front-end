import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Loading } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { produtoService } from '../services/produtoService';
import './Home.css';

const STORES = ['Amazon', 'Mercado Livre', 'Shopee', 'Magalu', 'Americanas','Kabum'];

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchAtivo, setSearchAtivo] = useState('');

  // Chave de refresh — ao incrementar força novas recomendações
  const [refreshKey, setRefreshKey] = useState(0);

  const location = useLocation();

  // Roda ao montar E sempre que refreshKey mudar (clique em Home ou botão atualizar)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setSearchQuery(q);
      executarBusca(q);
    } else {
      setSearchAtivo('');
      setSearchQuery('');
      carregarRecomendacoes();
    }
  }, [refreshKey]);

  // Detecta clique no link Home (mesmo estando na home) para forçar novos produtos
  useEffect(() => {
    const handleHomeClick = () => {
      if (window.location.pathname === '/home') {
        setRefreshKey(k => k + 1);
      }
    };

    // Força reload quando categoria favorita é atualizada no perfil
    const handleCategoriaAtualizada = () => {
      setRefreshKey(k => k + 1);
    };

    window.addEventListener('home-refresh', handleHomeClick);
    window.addEventListener('categoria-atualizada', handleCategoriaAtualizada);
    return () => {
      window.removeEventListener('home-refresh', handleHomeClick);
      window.removeEventListener('categoria-atualizada', handleCategoriaAtualizada);
    };
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

  const executarBusca = async (query) => {
    try {
      setBuscando(true);
      setLoading(true);
      setErro('');
      const data = await produtoService.search(query);
      setProdutos(data);
      setSearchAtivo(query);
    } catch (err) {
      console.error('Erro na busca:', err);
      setErro('Erro ao buscar produtos. Tente novamente.');
    } finally {
      setBuscando(false);
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchAtivo('');
      carregarRecomendacoes();
      return;
    }
    executarBusca(searchQuery);
  };

  const handleLimpar = () => {
    setSearchQuery('');
    setSearchAtivo('');
    carregarRecomendacoes();
  };

  const handleAtualizar = () => {
    setSearchAtivo('');
    setSearchQuery('');
    carregarRecomendacoes();
  };

  if (loading) {
    return (
      <>
        <Header />
        <Loading message={buscando ? 'Buscando ofertas...' : 'Carregando recomendações...'} />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="home-page">
        {/* Hero Search */}
        <section className="home-hero">
          <div className="home-hero-inner">
            <p className="home-hero-title">Busca inteligente com IA</p>
            <h1 className="home-hero-heading">
              Encontre as melhores <span>ofertas</span>
            </h1>

            <form className="search-bar" onSubmit={handleSearch}>
              <div className="search-input-wrap">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Ex: notebook, tênis, fone de ouvido..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={buscando}
                />
              </div>
              <button type="submit" className="search-btn" disabled={buscando}>
                {buscando ? 'Buscando...' : 'Buscar Ofertas'}
              </button>
            </form>

            {searchAtivo && (
              <button className="clear-search" onClick={handleLimpar}>
                ✕ Limpar busca "{searchAtivo}"
              </button>
            )}

            <div className="store-filters">
              {STORES.map((store) => (
                <span key={store} className="store-badge">{store}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="home-results">
          {erro && <div className="error-banner">{erro}</div>}

          <div className="results-header">
            <p className="results-title">
              {searchAtivo ? `Resultados para "${searchAtivo}"` : 'Recomendados para você'}
            </p>
            <div className="results-header-actions">
              {produtos.length > 0 && (
                <span className="results-count">{produtos.length} ofertas</span>
              )}
              {!searchAtivo && (
                <button
                  className="btn-refresh"
                  onClick={handleAtualizar}
                  disabled={loading}
                  title="Buscar novas ofertas"
                >
                  ↺ Atualizar
                </button>
              )}
            </div>
          </div>

          {produtos.length === 0 ? (
            <EmptyState message="Nenhum produto encontrado" icon="🛍️" />
          ) : (
            <div className="products-grid">
              {produtos.slice(0, 12).map((produto) => (
                <ProductCard
                  key={`${produto.nomeProduto}-${produto.loja}-${produto.precoOferta}`}
                  produto={produto}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}