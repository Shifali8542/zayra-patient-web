import { useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext'

export function useAuth() {
  const { isAuthenticated, user, login, signup, logout, skipAuth } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
    } catch {
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (name: string, email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      await signup(name, email, password)
    } catch {
      setError('Could not create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login: handleLogin,
    signup: handleSignup,
    logout,
    skipAuth,
  }
}
