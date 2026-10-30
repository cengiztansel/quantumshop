import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { setUnauthorizedHandler, tokenStore } from '../api/client'
import * as shop from '../api/shop'
import type { AuthResponse, Session } from '../types'

const SESSION_KEY = 'qs_session'

interface AuthContextValue {
  session: Session | null
  login(username: string, password: string): Promise<void>
  register(username: string, email: string, password: string): Promise<void>
  logout(): void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(loadSession)

  const logout = useCallback(() => {
    tokenStore.clear()
    localStorage.removeItem(SESSION_KEY)
    setSession(null)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(logout)
  }, [logout])

  const start = useCallback((data: AuthResponse) => {
    tokenStore.set(data.token)
    const next: Session = { username: data.username, role: data.role }
    localStorage.setItem(SESSION_KEY, JSON.stringify(next))
    setSession(next)
  }, [])

  const login = useCallback(
    async (username: string, password: string) => start(await shop.login(username, password)),
    [start],
  )
  const register = useCallback(
    async (username: string, email: string, password: string) =>
      start(await shop.register(username, email, password)),
    [start],
  )

  const value = useMemo(() => ({ session, login, register, logout }), [session, login, register, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
