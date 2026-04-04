import React, { createContext, useState, useContext, useCallback } from 'react';

export const AuthContext = createContext(null);

const loadUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      return JSON.parse(storedUser);
    }
    return null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadUser);

  const login = useCallback((userData) => {
    // Handle both 'token' and 'Token' from backend
    const token = userData.token || userData.Token;
    
    // Create a clean user object without the token for storage if needed,
    // but usually, we keep it consistent.
    const userToStore = { 
      ...userData,
      id: userData.id || userData.Id,
      name: userData.name || userData.Name,
      email: userData.email || userData.Email,
      role: userData.role || userData.Role,
    };
    if (token) userToStore.token = token; // Ensure lowercase 'token' in state/storage

    setUser(userToStore);
    localStorage.setItem('user', JSON.stringify(userToStore));
    if (token) {
      localStorage.setItem('token', token);
    }
    
    window.dispatchEvent(new Event('userLogin'));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Clear legacy keys if they exist
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('userLogout'));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
