// =============================================================================
// src/contexts/AuthContext.tsx
// Real backend authentication. Zero mock imports.
// =============================================================================

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User, AuthTokens } from '../types'
import { api, setTokens, setRefreshFailedCallback } from '../services/api'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Register forced-logout callback for expired refresh tokens
  useEffect(() => {
    setRefreshFailedCallback(() => {
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