import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { useNavigate } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';
import './Perfil.css';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => { carregarPerfil(); }, []);

  const carregarPerfil = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.perfil();
      setUsuario(data);
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      setErro('Erro ao carregar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const initials = usuario?.nome
    ? usuario.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  if (loading) return <><Header /><Loading message="Carregando seu perfil..." /></>;

  return (
    <>
      <Header />
      <div className="perfil-page">
        <div className="perfil-inner">
          <div className="perfil-page-header">
            <p className="perfil-page-label">Conta</p>
            <h1 className="perfil-page-title">Meu Perfil</h1>
          </div>

          {erro && <div className="alert-error">{erro}</div>}

          {usuario && (
            <>
              {/* Avatar card */}
              <div className="perfil-avatar-card">
                <div className="perfil-avatar-circle">{initials}</div>
                <div className="perfil-avatar-info">
                  <h2>{usuario.nome}</h2>
                  <p className="perfil-avatar-email">{usuario.email}</p>
                </div>
              </div>

              {/* Info cards */}
              <div className="perfil-cards">
                <div className="perfil-info-card">
                  <p className="perfil-info-label">Nome completo</p>
                  <p className="perfil-info-value">{usuario.nome}</p>
                </div>
                <div className="perfil-info-card">
                  <p className="perfil-info-label">Email</p>
                  <p className="perfil-info-value">{usuario.email}</p>
                </div>
              </div>

              {/* Categories */}
              <div className="perfil-categories-card">
                <p className="perfil-categories-title">Categorias Favoritas</p>
                {usuario.categorias && usuario.categorias.length > 0 ? (
                  <div className="categories-tags">
                    {usuario.categorias.map((cat) => (
                      <span key={cat.id} className="category-tag">
                        🏷️ {cat.nome}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
                    Nenhuma categoria selecionada
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="perfil-actions">
                <button className="btn-update" onClick={() => navigate('/atualizar-perfil')}>
                  ✏️ Atualizar Perfil
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}