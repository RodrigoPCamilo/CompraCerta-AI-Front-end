import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './Header.css';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.nome
    ? user.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : (user?.email?.[0] || 'U').toUpperCase();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <a href="/home" className="header-brand">
          <div className="header-brand-icon">🛍️</div>
          <h1>CompraCertaAI</h1>
        </a>

        <nav className="header-nav">
          <a href="/home" className={`nav-link${isActive('/home') ? ' active' : ''}`}>Home</a>
          <a href="/perfil" className={`nav-link${isActive('/perfil') ? ' active' : ''}`}>Perfil do Usuário</a>
          <a href="/historico" className={`nav-link${isActive('/historico') ? ' active' : ''}`}>Histórico de Busca</a>
        </nav>

        <div className="header-right">
          <div className="user-chip">
            <div className="user-avatar">{initials}</div>
            <span className="user-name">{user?.nome || user?.email}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            ← Sair
          </button>
        </div>
      </div>
    </header>
  );
}