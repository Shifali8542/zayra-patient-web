// =============================================================================
// src/App.tsx
// =============================================================================

import React, { useState } from 'react'
import { AuthProvider, useAuthContext } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { LoginPage } from './pages/Login/Login'
import { SignupPage } from './pages/Signup/Signup'
import { DashboardPage } from './pages/Dashboard/Dashboard'

type Route = 'login' | 'signup'

function AppRoutes() {
  const { isAuthenticated, user, logout } = useAuthContext()
  const [route, setRoute] = useState<Route>('login')

  if (isAuthenticated && user) {
    return (
      <DashboardPage
        user={user}
        onLogout={async () => {
          await logout()
          setRoute('login')
        }}
      />
    )
  }

  if (route === 'signup') {
    return <SignupPage onNavigateLogin={() => setRoute('login')} />
  }

  return <LoginPage onNavigateSignup={() => setRoute('signup')} />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}