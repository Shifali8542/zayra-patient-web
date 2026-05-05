import React, { createContext, useContext, useState, type ReactNode } from 'react'
import type { User } from '../types'
import { mockUser } from '../mocks/mockData'

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  skipAuth: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 800))
    setUser({ ...mockUser, email })
    setIsAuthenticated(true)
  }

  const signup = async (name: string, email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 800))
    setUser({ ...mockUser, name, email })
    setIsAuthenticated(true)
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  const skipAuth = () => {
    setUser(mockUser)
    setIsAuthenticated(true)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout, skipAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
