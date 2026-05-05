import React from 'react'
import { Home, Sparkles, Users, Flame, BookOpen, User } from 'lucide-react'

interface BottomNavProps {
  active: string
  onNavigate: (tab: string) => void
  homeCount?: number
}

const navItems = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'alyna', label: 'Alyna', Icon: Sparkles },
  { id: 'circle', label: 'Circle', Icon: Users },
  { id: 'rhythm', label: 'Rhythm', Icon: Flame },
  { id: 'stories', label: 'Stories', Icon: BookOpen },
  { id: 'profile', label: 'Profile', Icon: User },
]

export function BottomNav({ active, onNavigate, homeCount }: BottomNavProps) {
  return (
    <div className="flex items-center justify-around py-2 border-t border-gray-100 bg-white">
      {navItems.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`nav-item ${active === id ? 'active' : ''}`}
        >
          <div className="relative">
            <Icon size={20} />
            {id === 'home' && homeCount && homeCount > 0 ? (
              <span className="absolute -top-1 -right-1 bg-zayra-teal text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {homeCount}
              </span>
            ) : null}
          </div>
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}
