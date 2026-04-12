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

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const data = await categoriaService.disponiveis();
      setCategorias(data);
      if (data.length > 0) {
        setCategoriaId(data[0].id);
      }
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
      setErro('Erro ao carregar categorias. Tente novamente.');
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

      await usuarioService.criar({
        nome,
        email,
        senha,
        categoriaIds: [parseInt(categoriaId)],
      });

      setSucesso('Cadastro realizado! Fazendo login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error('Erro no cadastro:', err);

      if (err.response?.status === 400) {
        setErro(err.response?.data?.mensagem || 'Erro ao cadastrar. Tente novamente.');
      } else {
        setErro('Erro ao cadastrar usuário. Tente novamente.');
      }
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <h1 className="cadastro-title">CompraCertaAI</h1>
        <p className="cadastro-subtitle">Crie sua conta</p>

        {erro && <div className="error-message">{erro}</div>}
        {sucesso && <div className="success-message">{sucesso}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              type="text"
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={enviando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={enviando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <div className="password-wrapper">
              <input
                id="senha"
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={enviando}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                disabled={enviando}
              >
                {mostrarSenha ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoria favorita</label>
            <select
              id="categoria"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              disabled={enviando}
            >
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="cadastro-button"
            disabled={enviando}
          >
            {enviando ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="login-link">
          Já tem conta?{' '}
          <Link to="/login" className="link">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
