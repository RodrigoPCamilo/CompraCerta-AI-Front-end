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

  useEffect(() => {
    carregarPerfil();
  }, []);

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

  if (loading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  if (erro) {
    return (
      <>
        <Header />
        <div className="perfil-container">
          <div className="error-message">{erro}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="perfil-container">
        <div className="perfil-card">
          <h1 className="perfil-title">Meu Perfil</h1>

          {usuario && (
            <div className="profile-info">
              <div className="info-group">
                <label className="info-label">Nome</label>
                <p className="info-value">{usuario.nome}</p>
              </div>

              <div className="info-group">
                <label className="info-label">Email</label>
                <p className="info-value">{usuario.email}</p>
              </div>

              <div className="info-group">
                <label className="info-label">Categorias Favoritas</label>
                {usuario.categorias && usuario.categorias.length > 0 ? (
                  <div className="categories-list">
                    {usuario.categorias.map((cat) => (
                      <span key={cat.id} className="category-tag">
                        {cat.nome}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="info-value">Nenhuma categoria selecionada</p>
                )}
              </div>
            </div>
          )}

          <button
            onClick={() => navigate('/atualizar-perfil')}
            className="update-perfil-btn"
          >
            Atualizar Perfil
          </button>
        </div>
      </div>
    </>
  );
}
