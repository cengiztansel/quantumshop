import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, setUnauthorizedHandler, tokenStore } from './api';

const SESSION_KEY = 'qs_session';
const AuthContext = createContext(null);

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  const logout = useCallback(() => {
    tokenStore.clear();
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  async function authenticate(path, payload) {
    const data = await api.post(path, payload); // { token, username, role }
    tokenStore.set(data.token);
    const next = { username: data.username, role: data.role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    setSession(next);
  }

  const login = (username, password) => authenticate('/auth/login', { username, password });
  const register = (username, email, password) =>
    authenticate('/auth/register', { username, email, password });

  return (
    <AuthContext.Provider value={{ session, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
