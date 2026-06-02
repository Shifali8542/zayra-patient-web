import React, { useState } from 'react'
import { AuthProvider, useAuthContext } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { BLEProvider } from './contexts/BLEContext'
import { LoginPage } from './pages/Login/Login'
import { SignupPage } from './pages/Signup/Signup'
import { DashboardPage } from './pages/Dashboard/Dashboard'

type Route = 'login' | 'signup'

function AppRoutes() {
  const { isAuthenticated, user, logout, loading } = useAuthContext()
  const [route, setRoute] = useState<Route>('login')

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#E4F7F5',
      }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/icon.png" alt="Zayra" style={{ width: 48, marginBottom: 16 }} />
          <p style={{ color: '#00C2B2', fontSize: 14, fontWeight: 600 }}>Loading...</p>
        </div>
      </div>
    )
  }

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
        <BLEProvider>
          <AppRoutes />
        </BLEProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}