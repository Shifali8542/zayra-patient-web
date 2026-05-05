import React, { useState } from 'react'
import { ArrowRight, Eye, EyeOff, Moon, Sun } from 'lucide-react'
import { ZayraLogo } from '../../components/ui/ZayraLogo'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../contexts/ThemeContext'

interface LoginPageProps {
  onNavigateSignup: () => void
}

export function LoginPage({ onNavigateSignup }: LoginPageProps) {
  const { login, skipAuth, loading, error } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div className="min-h-screen flex flex-col"
         style={{ background: 'linear-gradient(160deg, #D6F3F0 0%, #C8EEE9 30%, #D8F2EF 60%, #E4F7F5 100%)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5">
        <ZayraLogo size={44} />
        <button onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-white/60 transition-colors text-gray-500 dark:text-gray-300">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          <div className="inline-flex items-center gap-2 bg-white/60 border border-white/80
                          rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-zayra-teal animate-pulse" />
            <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Adaptive Health OS · Iteration 1
            </span>
          </div>

          <h1 className="font-display font-black text-5xl text-zayra-navy dark:text-white mb-2 tracking-tight">
            Welcome back.
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-10 text-base">
            Your body has been keeping your baseline.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                className="w-full px-4 py-3.5 rounded-2xl border border-white/80 bg-white/70 dark:bg-zayra-navy-mid/50
                           text-gray-900 dark:text-white placeholder-gray-400 focus:border-zayra-teal
                           focus:ring-2 focus:ring-zayra-teal/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                  className="w-full px-4 py-3.5 rounded-2xl border border-white/80 bg-white/70 dark:bg-zayra-navy-mid/50
                             text-gray-900 dark:text-white placeholder-gray-400 focus:border-zayra-teal
                             focus:ring-2 focus:ring-zayra-teal/20 transition-all pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" disabled={loading}
                    className="bg-zayra-navy text-white font-semibold w-full mt-6 py-4 rounded-full
                               flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95">
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Sign in</span><ArrowRight size={18} /></>}
            </button>

            {/* Skip for now */}
            <button type="button" onClick={skipAuth}
                    className="w-full py-3 text-sm font-medium text-gray-500 hover:text-zayra-teal
                               border border-white/60 bg-white/40 hover:bg-white/60 rounded-full transition-all">
              Skip for now →
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200/60 dark:bg-gray-700" />
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200/60 dark:bg-gray-700" />
          </div>

          <p className="text-center text-sm text-gray-500">
            New to Zayra?{' '}
            <button onClick={onNavigateSignup}
                    className="font-semibold text-zayra-teal hover:text-zayra-accent transition-colors">
              Create your profile
            </button>
          </p>

          <p className="text-center text-xs text-gray-400 mt-8">
            Calm vigilance. Clinician-validated. © Zayra Health.
          </p>
        </div>
      </div>
    </div>
  )
}
