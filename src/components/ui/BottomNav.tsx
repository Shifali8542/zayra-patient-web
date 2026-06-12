import React from 'react'
import { Home, Sparkles, Users, Flame, BookOpen, User, LifeBuoy } from 'lucide-react'
interface BottomNavProps {
  active: string
  onNavigate: (tab: string) => void
  dark?: boolean
}
const navItems = [
  { id: 'home',    label: 'Home',    Icon: Home },
  { id: 'alyna',   label: 'Alyna',   Icon: Sparkles },
  { id: 'rhythm',  label: 'Rhythm',  Icon: Flame },
  { id: 'circle',  label: 'Circle',  Icon: Users },
  { id: 'stories', label: 'Stories', Icon: BookOpen },
  { id: 'support', label: 'Support', Icon: LifeBuoy },
  { id: 'profile', label: 'Profile', Icon: User },
]

export function BottomNav({ active, onNavigate, dark = false }: BottomNavProps) {
  return (
    <div className={`px-3 pb-3 pt-2 backdrop-blur-md ${dark ? 'bg-transparent' : 'bg-[var(--pearl)]'}`}>
      <div className={`flex items-center justify-between rounded-3xl px-2 py-2 shadow-elevated border ${dark ? 'border-white/10 bg-white/5 backdrop-blur-md' : 'border-border/60 bg-pearl/80 backdrop-blur-md'}`}>
        {navItems.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 transition-smooth ${isActive ? 'bg-gradient-to-b from-aqua/15 to-transparent' : ''}`}
            >
              <Icon className={`h-[18px] w-[18px] transition-smooth ${
                isActive
                  ? 'text-aqua'
                  : dark ? 'text-white/60' : 'text-muted-foreground'
              }`} />
              <span className={`text-[10px] font-medium tracking-wide transition-smooth ${
                isActive
                  ? dark ? 'text-cyan-glow' : 'text-ink'
                  : dark ? 'text-white/50' : 'text-muted-foreground'
              }`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}