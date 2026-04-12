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

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    try {
      setLoading(true);
      const data = await historicoService.listar();

      // Ordena por data (mais recente primeiro)
      const ordenado = data.sort(
        (a, b) => new Date(b.searchDate) - new Date(a.searchDate)
      );

      setHistorico(ordenado);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      setErro('Erro ao carregar histórico. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(data);
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
      <div className="historico-container">
        <div className="historico-header">
          <h1 className="historico-title">Histórico de Pesquisas</h1>
        </div>

        {erro && <div className="error-message">{erro}</div>}

        {historico.length === 0 ? (
          <EmptyState message="Você ainda não fez nenhuma pesquisa." />
        ) : (
          <div className="historico-list">
            {historico.map((item) => (
              <div key={item.id} className="historico-item">
                <div className="historico-content">
                  <p className="historico-query">{item.query}</p>
                  <span className="historico-date">
                    {formatarData(item.searchDate)}
                  </span>
                </div>
                <button
                  className="historico-action"
                  onClick={() => {
                    navigate('/home');
                    // Aqui poderia fazer uma busca automática no Home se quisesse
                  }}
                >
                  Buscar novamente
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="historico-footer">
          <button
            onClick={() => navigate('/home')}
            className="voltar-home-btn"
          >
            ← Voltar para Home
          </button>
        </div>
      </div>
    </>
  );
}
