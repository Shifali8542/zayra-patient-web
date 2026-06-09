import React from 'react'
import { Home, Sparkles, Users, Flame, BookOpen, User, LifeBuoy } from 'lucide-react'
interface BottomNavProps {
  active: string
  onNavigate: (tab: string) => void
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

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <div className="px-3 pb-3 pt-2 bg-[var(--pearl)] backdrop-blur-md">
      <div className="flex items-center justify-between rounded-3xl px-2 py-2 shadow-elevated border border-border/60 bg-pearl/80 backdrop-blur-md">
        {navItems.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 transition-smooth ${isActive ? 'bg-gradient-to-b from-aqua/15 to-transparent' : ''}`}
            >
              <Icon className={`h-[18px] w-[18px] transition-smooth ${isActive ? 'text-aqua' : 'text-muted-foreground'}`} />
              <span className={`text-[10px] font-medium tracking-wide transition-smooth ${isActive ? 'text-ink' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}