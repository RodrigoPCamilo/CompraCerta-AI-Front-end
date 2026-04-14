import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { usuarioService } from '../services/usuarioService';
import { categoriaService } from '../services/categoriaService';
import './AtualizarPerfil.css';

export default function AtualizarPerfil() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [perfilData, categoriasData] = await Promise.all([
        usuarioService.perfil(),
        categoriaService.disponiveis(),
      ]);
      setNome(perfilData.nome);
      setEmail(perfilData.email);
      setCategorias(categoriasData);
      if (perfilData.categorias && perfilData.categorias.length > 0) {
        setCategoriaId(perfilData.categorias[0].id);
      } else if (categoriasData.length > 0) {
        setCategoriaId(categoriasData[0].id);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setErro('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setSalvando(true);

    try {
      if (!nome || !email || !categoriaId) {
        setErro('Preencha todos os campos');
        setSalvando(false);
        return;
      }

      const response = await usuarioService.atualizar(user.id, {
        nome,
        email,
        categoriaIds: [parseInt(categoriaId)],
      });

      updateUser({ nome: response.nome, email: response.email });
      setSucesso('Perfil atualizado com sucesso!');
      setTimeout(() => navigate('/perfil'), 1500);
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      if (err.response?.status === 403) {
        setErro('Você não tem permissão para alterar este perfil.');
      } else {
        setErro(err.response?.data?.mensagem || 'Erro ao atualizar perfil. Tente novamente.');
      }
    } finally {
      setSalvando(false);
    }
  };

  if (loading) return <><Header /><Loading message="Carregando dados..." /></>;

  return (
    <>
      <Header />
      <div className="atualizar-page">
        <div className="atualizar-inner">
          <div className="atualizar-page-header">
            <button className="atualizar-back-btn" onClick={() => navigate('/perfil')}>
              ← Voltar ao perfil
            </button>
            <p className="atualizar-page-label">Conta</p>
            <h1 className="atualizar-page-title">Atualizar Perfil</h1>
          </div>

          <div className="atualizar-card">
            {erro && <div className="alert-error">{erro}</div>}
            {sucesso && <div className="alert-success">{sucesso}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label className="form-label" htmlFor="nome">Nome completo</label>
                <input
                  id="nome"
                  type="text"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={salvando}
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={salvando}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Categoria favorita</label>
                {categorias.length > 0 ? (
                  <div className="category-grid">
                    {categorias.map((cat) => (
                      <div
                        key={cat.id}
                        className={`category-option${String(categoriaId) === String(cat.id) ? ' selected' : ''}`}
                        onClick={() => !salvando && setCategoriaId(cat.id)}
                      >
                        <span>{cat.nome}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} disabled={salvando}>
                    <option value="">Nenhuma categoria disponível</option>
                  </select>
                )}
              </div>

              <div className="atualizar-actions">
                <button type="submit" className="btn-save" disabled={salvando}>
                  {salvando ? 'Salvando...' : '✓ Salvar alterações'}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => navigate('/perfil')}
                  disabled={salvando}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}