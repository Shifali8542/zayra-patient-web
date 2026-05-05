import React from 'react'
import { ChevronRight, Shield, Users, FileText, Cpu, LogOut } from 'lucide-react'
import type { User } from '../../types'
import { useTheme } from '../../contexts/ThemeContext'
import { Moon, Sun } from 'lucide-react'

interface ProfileTabProps {
  user: User
  onLogout: () => void
}

export function ProfileTab({ user, onLogout }: ProfileTabProps) {
  const { theme, toggleTheme } = useTheme()

  const menuItems = [
    {
      icon: <div className="w-8 h-8 rounded-full bg-zayra-teal flex items-center justify-center text-white font-bold text-sm">{user.name[0]}</div>,
      label: 'Your baseline',
      sub: `${user.baseline.hrv} ms HRV · ${user.baseline.restingHr} bpm rest · ${user.baseline.stressSignature} stress signature`,
    },
    { icon: <Cpu size={18} className="text-zayra-navy dark:text-white" />, label: 'Devices', sub: 'Zen · Axiom · Alyna' },
    { icon: <Shield size={18} className="text-zayra-navy dark:text-white" />, label: 'Privacy Center', sub: 'What Zayra sees · what others see' },
    { icon: <Users size={18} className="text-zayra-navy dark:text-white" />, label: 'Family & Circle', sub: 'Sharing & emergency awareness' },
    { icon: <FileText size={18} className="text-zayra-navy dark:text-white" />, label: 'Reports', sub: 'Clinician-ready PDFs' },
  ]

  return (
    <div className="px-4 pb-4 space-y-4 animate-fade-in">
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Your Zayra, Your Control</p>
        <h2 className="font-display font-bold text-2xl text-zayra-navy dark:text-white mt-0.5">Profile</h2>
      </div>

      <div className="space-y-2">
        {menuItems.map((item, i) => (
          <div key={i} className="card px-4 py-3 flex items-center gap-3 cursor-pointer hover:shadow-zayra transition-shadow">
            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-zayra-navy flex items-center justify-center flex-shrink-0">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zayra-navy dark:text-white">{item.label}</p>
              <p className="text-xs text-gray-400 truncate">{item.sub}</p>
            </div>
            <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
          </div>
        ))}
      </div>

      {/* Theme toggle */}
      <div className="card px-4 py-3 flex items-center gap-3 cursor-pointer" onClick={toggleTheme}>
        <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-zayra-navy flex items-center justify-center">
          {theme === 'light' ? <Moon size={18} className="text-zayra-navy" /> : <Sun size={18} className="text-white" />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-zayra-navy dark:text-white">
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </p>
          <p className="text-xs text-gray-400">Currently: {theme} theme</p>
        </div>
      </div>

      {/* Journey switcher */}
      <div className="card px-4 py-3">
        <p className="text-xs text-gray-400 mb-2">Switch journey</p>
        <div className="flex gap-2">
          {['Wellness', 'Care', 'Evac', 'Hospital'].map(j => (
            <button
              key={j}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                user.journey === j.toLowerCase()
                  ? 'bg-zayra-navy text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-zayra-mint/40 hover:text-zayra-teal'
              }`}
            >
              {j}
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-red-400 hover:text-red-500 border border-red-100 hover:border-red-200 rounded-2xl transition-all"
      >
        <LogOut size={16} />
        Sign out
      </button>

      <p className="text-center text-xs text-gray-400 pb-2">
        Calm vigilance. Clinician-validated. © Zayra Health.
      </p>
    </div>
  )
}
