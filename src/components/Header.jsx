import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './Header.css';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <h1>CompraCertaAI</h1>
        </div>

        <nav className="header-nav">
          <a href="/home" className="nav-link">Home</a>
          <a href="/perfil" className="nav-link">Perfil</a>
          <a href="/historico" className="nav-link">Histórico</a>
        </nav>

        <div className="header-user">
          <span className="user-name">{user?.nome || user?.email}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
