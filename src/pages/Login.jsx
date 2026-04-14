import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { authService } from '../services/authService';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      if (!email || !senha) {
        setErro('Preencha todos os campos');
        setLoading(false);
        return;
      }

      const response = await authService.login(email, senha);
      login(response, { nome: email });
      navigate('/home');
    } catch (err) {
      console.error('Erro no login:', err);
      if (err.response?.status === 401) {
        setErro('Email ou senha inválidos');
      } else {
        setErro('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg" />

      <div className="login-split">
        {/* Aside decorativo */}
        <aside className="login-aside">
          <div className="login-aside-logo">
            <div className="login-aside-icon">🛍️</div>
            <p className="login-aside-brand">CompraCertaAI</p>
          </div>

          <h2 className="login-aside-headline">
            As melhores <span>ofertas</span> do Brasil,<br />
            direto para você.
          </h2>
          <p className="login-aside-sub">
            Nossa IA analisa milhares de produtos em tempo real nos maiores marketplaces
            e seleciona as melhores oportunidades baseado no seu perfil.
          </p>

          <div className="login-features">
            {['Amazon, Mercado Livre, Shopee e mais', 'Recomendações personalizadas por categoria', 'Histórico completo de pesquisas'].map((f) => (
              <div className="login-feature" key={f}>
                <div className="login-feature-dot" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Form */}
        <main className="login-main">
          <div className="login-card">
            <div className="login-card-header">
              <h1 className="login-card-title">Bem-vindo de volta</h1>
              <p className="login-card-subtitle">Entre com sua conta para continuar</p>
            </div>

            {erro && <div className="alert-error">{erro}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="password">Senha</label>
                <div className="form-input-wrap">
                  <input
                    id="password"
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                  >
                    {mostrarSenha ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary login-submit"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p className="login-footer">
              Não tem conta?{' '}
              <Link to="/cadastro">Cadastre-se grátis</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}