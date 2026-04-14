import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { useNavigate } from 'react-router-dom';
import { historicoService } from '../services/historicoService';
import './Historico.css';

export default function Historico() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => { carregarHistorico(); }, []);

  const carregarHistorico = async () => {
    try {
      setLoading(true);
      const data = await historicoService.listar();
      const ordenado = data.sort((a, b) => new Date(b.searchDate) - new Date(a.searchDate));
      setHistorico(ordenado);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      setErro('Erro ao carregar histórico. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataString) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dataString));
  };

  const handleRebuscar = (query) => {
    navigate(`/home?q=${encodeURIComponent(query)}`);
  };

  if (loading) return <><Header /><Loading message="Carregando histórico..." /></>;

  return (
    <>
      <Header />
      <div className="historico-page">
        <div className="historico-inner">
          <div className="historico-page-header">
            <div>
              <p className="historico-page-label">Atividade</p>
              <h1 className="historico-page-title">Histórico de Busca</h1>
            </div>
            <button className="historico-back-btn" onClick={() => navigate('/home')}>
              ← Voltar para Home
            </button>
          </div>

          {erro && <div className="alert-error">{erro}</div>}

          {historico.length > 0 && (
            <div className="historico-stats">
              <div className="stat-chip">
                <span className="stat-value">{historico.length}</span>
                <span className="stat-label">Pesquisas realizadas</span>
              </div>
              <div className="stat-chip">
                <span className="stat-value">
                  {historico.length > 0 ? formatarData(historico[historico.length - 1].searchDate).split(' ')[0] : '—'}
                </span>
                <span className="stat-label">Primeira pesquisa</span>
              </div>
            </div>
          )}

          {historico.length === 0 ? (
            <EmptyState
              message="Você ainda não fez nenhuma pesquisa"
              icon="🔍"
            />
          ) : (
            <div className="historico-list">
              {historico.map((item, idx) => (
                <div key={item.id || idx} className="historico-item">
                  <div className="historico-item-icon">🔍</div>
                  <div className="historico-item-content">
                    <p className="historico-query">{item.query}</p>
                    <span className="historico-date">{formatarData(item.searchDate)}</span>
                  </div>
                  <button
                    className="historico-rebuscar"
                    onClick={() => handleRebuscar(item.query)}
                  >
                    ↺ Buscar novamente
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}