import React, { useState } from 'react'
import { ArrowRight, Eye, EyeOff, Moon, Sun } from 'lucide-react'
import { ZayraLogo } from '../../components/ui/ZayraLogo'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../contexts/ThemeContext'

interface SignupPageProps {
  onNavigateLogin: () => void
}

export function SignupPage({ onNavigateLogin }: SignupPageProps) {
  const { signup, loading, error } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signup(name, email, password)
  }

  return (
    <div className="min-h-screen flex flex-col"
         style={{ background: 'linear-gradient(160deg, #D6F3F0 0%, #C8EEE9 30%, #D8F2EF 60%, #E4F7F5 100%)' }}>

      <div className="flex items-center justify-between px-8 py-5">
        <ZayraLogo size={44} />
        <button onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-white/60 transition-colors text-gray-500 dark:text-gray-300">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">

          <div className="inline-flex items-center gap-2 bg-white/60 border border-white/80
                          rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-zayra-teal animate-pulse" />
            <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Adaptive Health OS · Iteration 1
            </span>
          </div>

          <h1 className="font-display font-black text-5xl text-zayra-navy dark:text-white mb-2 tracking-tight">
            Know your body.
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-base">
            Create your Zayra profile. Your baseline starts here.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'First name', type: 'text', val: name, set: setName, ph: 'Your first name' },
              { label: 'Email', type: 'email', val: email, set: setEmail, ph: 'you@example.com' },
            ].map(field => (
              <div key={field.label}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{field.label}</label>
                <input
                  type={field.type} value={field.val}
                  onChange={e => field.set(e.target.value)} placeholder={field.ph} required
                  className="w-full px-4 py-3.5 rounded-2xl border border-white/80 bg-white/70 dark:bg-zayra-navy-mid/50
                             text-gray-900 dark:text-white placeholder-gray-400 focus:border-zayra-teal
                             focus:ring-2 focus:ring-zayra-teal/20 transition-all"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" minLength={8} required
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
                : <><span>Begin my journey</span><ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-8 space-y-2.5">
            {[
              "We'll begin learning your baseline.",
              'Alyna will adapt to your body, not an average.',
              'Your data stays yours — visible only as you choose.',
            ].map((promise, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-zayra-teal/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l2.5 2.5L9 1" stroke="#00C2B2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{promise}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200/60" />
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200/60" />
          </div>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <button onClick={onNavigateLogin}
                    className="font-semibold text-zayra-teal hover:text-zayra-accent transition-colors">
              Sign in
            </button>
          </p>

          <p className="text-center text-xs text-gray-400 mt-6">
            Calm vigilance. Clinician-validated. © Zayra Health.
          </p>
        </div>
      </div>
    </div>
  )
}
