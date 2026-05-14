// =============================================================================
// src/hooks/useAuth.ts
// Thin wrapper around AuthContext for Login/Signup pages.
// =============================================================================

import { useAuthContext } from '../contexts/AuthContext'

export function useAuth() {
  const { isAuthenticated, user, login, signup, logout, loading, error, clearError } = useAuthContext()
  return { isAuthenticated, user, login, signup, logout, loading, error, clearError }
}