const TOKEN_KEY = 'qs_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

let onUnauthorized = () => {};
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

// Backend bazen JSON ({message}), bazen düz metin döner (gateway: "JWT token missing")
async function readMessage(res) {
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return json.message || json.error || text;
  } catch {
    return text || `${res.status} ${res.statusText}`;
  }
}

async function request(method, path, body) {
  const token = tokenStore.get();
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Is the gateway port-forward running?');
  }

  // Token varken 401 = oturum süresi dolmuş. Token yokken (yanlış parola) çıkış yaptırma.
  if (res.status === 401 && token) onUnauthorized();
  if (!res.ok) throw new ApiError(res.status, await readMessage(res));
  if (res.status === 204) return null;

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
};
ui/src/auth.jsx: oturum durumu
jsx
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
