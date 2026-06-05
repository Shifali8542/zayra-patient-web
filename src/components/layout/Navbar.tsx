import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { ZayraLogo } from '../ui/ZayraLogo'
import { useTheme } from '../../contexts/ThemeContext'

interface NavbarProps {
  onRequestAccess?: () => void
}

export function Navbar({ onRequestAccess }: NavbarProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="relative z-10 bg-transparent px-6 py-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
      <ZayraLogo size={44} />

      <div className="hidden md:flex items-center gap-10">
        {['Wellness', 'Care', 'Evac', 'Hospital'].map(item => (
          <a
            key={item}
            href="#"
            className="text-sm font-medium text-gray-600 hover:text-zayra-navy dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            {item}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {/* <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-white/60 transition-colors text-gray-500 dark:text-gray-300"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button> */}

        <button
          onClick={onRequestAccess}
          className="rounded-full bg-gradient-to-r from-[#0D1B2A] to-[#004C61] px-5 py-2 text-sm font-medium text-white shadow-[0_10px_24px_rgba(13,27,42,0.16)] transition hover:shadow-[0_14px_30px_rgba(13,27,42,0.22)] active:scale-95 whitespace-nowrap"
        >
          Request access
        </button>
        </div>
      </div>
    </nav>
  )
}
