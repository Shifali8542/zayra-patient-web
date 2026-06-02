import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User, AuthTokens } from '../types'
import { api, setTokens, setRefreshFailedCallback } from '../services/api'

// ── Persistence keys ──────────────────────────────────────────────────────────
const STORAGE_KEY_ACCESS = 'zayra_access_token'
const STORAGE_KEY_REFRESH = 'zayra_refresh_token'
const STORAGE_KEY_USER = 'zayra_user'

function persistSession(user: User, tokens: AuthTokens): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACCESS, tokens.access)
    localStorage.setItem(STORAGE_KEY_REFRESH, tokens.refresh)
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user))
  } catch { /* storage quota exceeded — ignore */ }
}

function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY_ACCESS)
  localStorage.removeItem(STORAGE_KEY_REFRESH)
  localStorage.removeItem(STORAGE_KEY_USER)
}

function restoreSession(): { user: User; tokens: AuthTokens } | null {
  try {
    const access = localStorage.getItem(STORAGE_KEY_ACCESS)
    const refresh = localStorage.getItem(STORAGE_KEY_REFRESH)
    const userRaw = localStorage.getItem(STORAGE_KEY_USER)
    if (!access || !refresh || !userRaw) return null
    const user = JSON.parse(userRaw) as User
    return { user, tokens: { access, refresh } }
  } catch {
    return null
  }
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  tokens: AuthTokens | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokensState] = useState<AuthTokens | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)   // true on first load — wait for restore
  const [error, setError] = useState<string | null>(null)

  // ── Restore session on app startup (page refresh) ─────────────────────────
  useEffect(() => {
    const saved = restoreSession()
    if (saved) {
      // Restore tokens into api service so API calls work immediately
      setTokens(saved.tokens)
      setUser(saved.user)
      setTokensState(saved.tokens)
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  // ── Register forced-logout callback for expired refresh tokens ────────────
  useEffect(() => {
    setRefreshFailedCallback(() => {
      clearSession()
      setUser(null)
      setTokensState(null)
      setIsAuthenticated(false)
      setTokens(null)
    })
  }, [])
  const clearError = useCallback(() => setError(null), [])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const { user: u, tokens: t } = await api.auth.login(email, password)
      persistSession(u, t)   // ← save to localStorage
      setUser(u)
      setTokensState(t)
      setIsAuthenticated(true)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Invalid credentials. Please try again.'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const { user: u, tokens: t } = await api.auth.register(name, email, password)
      persistSession(u, t)
      setUser(u)
      setTokensState(t)
      setIsAuthenticated(true)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not create account. Please try again.'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      await api.auth.logout()
    } finally {
      clearSession() 
      setUser(null)
      setTokensState(null)
      setIsAuthenticated(false)
      setTokens(null)
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      isAuthenticated, user, tokens,
      login, signup, logout,
      loading, error, clearError,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}