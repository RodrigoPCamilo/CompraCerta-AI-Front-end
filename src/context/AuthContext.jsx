// eslint-disable

import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContextObject';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carregar token e dados do usuário do localStorage ao montar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Batch updates to avoid cascading renders
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setToken(storedToken);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao carregar dados de autenticação:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
    }, []);

  const login = useCallback((tokenData, userData) => {
    const { token: newToken, expiraEm, email, id } = tokenData;

    localStorage.setItem('token', newToken);
    localStorage.setItem('expiraEm', expiraEm);
    localStorage.setItem('user', JSON.stringify({
      id,
      email,
      nome: userData?.nome || email,
    }));

    setToken(newToken);
    setUser({
      id,
      email,
      nome: userData?.nome || email,
    });
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiraEm');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateUser = useCallback((userData) => {
    setUser((prevUser) => {
      const updatedUser = {
        ...prevUser,
        ...userData,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
