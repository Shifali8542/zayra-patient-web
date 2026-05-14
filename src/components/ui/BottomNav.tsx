// =============================================================================
// src/components/ui/BottomNav.tsx
// ECG tab added to match the mobile app's tab order.
// =============================================================================

import React from 'react'
import { Home, Heart, Sparkles, Users, Flame, BookOpen, User } from 'lucide-react'

interface BottomNavProps {
  active: string
  onNavigate: (tab: string) => void
}

const navItems = [
  { id: 'home',    label: 'Home',    Icon: Home },
  { id: 'ecg',     label: 'ECG',     Icon: Heart },
  { id: 'alyna',   label: 'Alyna',   Icon: Sparkles },
  { id: 'rhythm',  label: 'Rhythm',  Icon: Flame },
  { id: 'circle',  label: 'Circle',  Icon: Users },
  { id: 'stories', label: 'Stories', Icon: BookOpen },
  { id: 'profile', label: 'Profile', Icon: User },
]

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <div className="flex items-center justify-around py-2 border-t border-gray-100 bg-white">
      {navItems.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`nav-item ${active === id ? 'active' : ''}`}
        >
          <Icon size={18} />
          <span className="text-[9px]">{label}</span>
        </button>
      ))}
    </div>
  )
}