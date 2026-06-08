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
    <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
      <ZayraLogo size={32} />

      <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
        {['Wellness', 'Care', 'Evac', 'Hospital'].map(item => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="hover:text-foreground transition-smooth"
          >
            {item}
          </a>
        ))}
      </nav>

      <button
        onClick={onRequestAccess}
        className="rounded-full bg-gradient-ink px-5 py-2 text-sm font-medium text-primary-foreground shadow-soft transition-smooth hover:shadow-elevated whitespace-nowrap"
      >
        Request access
      </button>
    </header>
  )
}
