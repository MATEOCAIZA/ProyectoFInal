import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (data) => {
    localStorage.setItem('auth', JSON.stringify(data));
    setAuth(data);
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
