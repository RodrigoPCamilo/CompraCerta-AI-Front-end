import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';
import { categoriaService } from '../services/categoriaService';
import { Loading } from '../components/Loading';
import './Cadastro.css';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const navigate = useNavigate();

  useEffect(() => { carregarCategorias(); }, []);

  const carregarCategorias = async () => {
    setErro('');
    try {
      const data = await categoriaService.disponiveis();
      setCategorias(data);
      if (data.length > 0) setCategoriaId(data[0].id);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
      setCategorias([]);
      setCategoriaId('');
      setErro(err.response?.data?.mensagem || 'Erro ao carregar categorias. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setEnviando(true);

    try {
      if (!nome || !email || !senha || !categoriaId) {
        setErro('Preencha todos os campos');
        setEnviando(false);
        return;
      }

      if (senha.length < 6) {
        setErro('Senha deve ter no mínimo 6 caracteres');
        setEnviando(false);
        return;
      }

      await usuarioService.criar({ nome, email, senha, categoriaIds: [parseInt(categoriaId, 10)] });

      setSucesso('Cadastro realizado! Redirecionando para o login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error('Erro no cadastro:', err);
      setErro(err.response?.data?.mensagem || 'Erro ao cadastrar usuário. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="cadastro-page">
      <div className="cadastro-container">
        <div className="cadastro-header">
          <div className="cadastro-logo">
            <div className="cadastro-logo-icon">🛍️</div>
            <p className="cadastro-logo-text">CompraCertaAI</p>
          </div>
          <h1 className="cadastro-title">Crie sua conta</h1>
          <p className="cadastro-subtitle">Comece a economizar com IA hoje mesmo</p>
        </div>

        <div className="cadastro-card">
          {erro && <div className="alert-error">{erro}</div>}
          {sucesso && <div className="alert-success">{sucesso}</div>}

          {categorias.length === 0 && (
            <button type="button" className="reload-btn" onClick={carregarCategorias}>
              ↻ Recarregar categorias
            </button>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label" htmlFor="nome">Nome completo</label>
              <input id="nome" type="text" placeholder="Seu nome completo" value={nome} onChange={(e) => setNome(e.target.value)} disabled={enviando} />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={enviando} />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="senha">Senha</label>
              <div className="form-input-wrap">
                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  disabled={enviando}
                />
                <button type="button" className="toggle-password" onClick={() => setMostrarSenha(!mostrarSenha)}>
                  {mostrarSenha ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Categoria favorita</label>
              {categorias.length > 0 ? (
                <div className="category-grid">
                  {categorias.map((cat) => (
                    <div
                      key={cat.id}
                      className={`category-option${String(categoriaId) === String(cat.id) ? ' selected' : ''}`}
                      onClick={() => !enviando && setCategoriaId(cat.id)}
                    >
                      <span>{cat.nome}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <select id="categoria" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} disabled>
                  <option value="">Nenhuma categoria disponível</option>
                </select>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={enviando} style={{ marginTop: '8px' }}>
              {enviando ? 'Cadastrando...' : 'Criar conta'}
            </button>
          </form>
        </div>

        <p className="cadastro-footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}