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
    /* ✅ FIXED: Transparent bg like Image 1, generous horizontal padding */
    <nav className="flex items-center justify-between px-8 md:px-12 py-5 bg-transparent">
      {/* ✅ FIXED: Larger logo matching Image 1 */}
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
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-white/60 transition-colors text-gray-500 dark:text-gray-300"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* ✅ FIXED: Large pill-shaped dark navy button like Image 1 */}
        <button
          onClick={onRequestAccess}
          className="bg-zayra-navy text-white text-sm font-semibold px-6 py-3 rounded-full
                     hover:opacity-90 transition-all active:scale-95 whitespace-nowrap"
        >
          Request access
        </button>
      </div>
    </nav>
  )
}
