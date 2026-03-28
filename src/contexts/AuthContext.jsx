import React, { createContext, useState, useContext, useCallback } from 'react';

export const AuthContext = createContext(null);

const loadUser = () => {
  try {
    const stored = localStorage.getItem('user') || localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadUser);

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('currentUser', JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    window.dispatchEvent(new Event('userLogin'));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('userLogout'));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
