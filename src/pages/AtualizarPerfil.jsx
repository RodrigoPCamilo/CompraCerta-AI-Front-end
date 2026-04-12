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

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);

      // Carrega perfil e categorias em paralelo
      const [perfilData, categoriasData] = await Promise.all([
        usuarioService.perfil(),
        categoriaService.disponiveis(),
      ]);

      setNome(perfilData.nome);
      setEmail(perfilData.email);
      setCategorias(categoriasData);

      // Acha a categoria atual do usuário
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

      // Atualiza contexto
      updateUser({
        nome: response.nome,
        email: response.email,
      });

      setSucesso('Perfil atualizado com sucesso!');
      setTimeout(() => {
        navigate('/perfil');
      }, 1500);
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);

      if (err.response?.status === 403) {
        setErro('Você não tem permissão para alterar este perfil.');
      } else if (err.response?.status === 400) {
        setErro(err.response?.data?.mensagem || 'Erro ao atualizar perfil.');
      } else {
        setErro('Erro ao atualizar perfil. Tente novamente.');
      }
    } finally {
      setSalvando(false);
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

  return (
    <>
      <Header />
      <div className="atualizar-perfil-container">
        <div className="atualizar-perfil-card">
          <h1 className="atualizar-perfil-title">Atualizar Perfil</h1>

          {erro && <div className="error-message">{erro}</div>}
          {sucesso && <div className="success-message">{sucesso}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome">Nome completo</label>
              <input
                id="nome"
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={salvando}
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
                disabled={salvando}
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoria">Categoria favorita</label>
              <select
                id="categoria"
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                disabled={salvando}
              >
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-buttons">
              <button
                type="submit"
                className="save-button"
                disabled={salvando}
              >
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate('/perfil')}
                disabled={salvando}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
