import React from 'react'
import { Flame } from 'lucide-react'
import type { RhythmStreak } from '../../types'

interface RhythmTabProps {
  streak: RhythmStreak
}

export function RhythmTab({ streak }: RhythmTabProps) {
  return (
    <div className="px-4 pb-4 space-y-4 animate-fade-in">
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Meaningful Consistency</p>
        <h2 className="font-display font-bold text-2xl text-zayra-navy dark:text-white mt-0.5">Rhythm Streak</h2>
      </div>

      {/* Main streak card */}
      <div className="rounded-2xl bg-teal-gradient p-5 text-white">
        <Flame size={24} className="text-white/80 mb-2" />
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-display font-bold text-5xl">{streak.days}</span>
          <span className="text-xl font-medium opacity-70">days</span>
        </div>
        <p className="text-sm opacity-80 mb-4">
          Your rhythm held through a high-stress week. Alyna's understanding of your baseline deepened.
        </p>
        <div className="flex items-center gap-2">
          {streak.weekDots.map((active, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                active ? 'bg-white/30' : 'bg-white/10'
              }`}
            >
              {active && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Milestones</p>
        <div className="grid grid-cols-3 gap-2">
          {streak.milestones.map(milestone => (
            <div
              key={milestone.label}
              className={`rounded-2xl p-3 text-center ${
                milestone.active
                  ? 'bg-zayra-teal text-white'
                  : milestone.achieved
                  ? 'bg-zayra-mint/60 text-zayra-navy'
                  : 'bg-gray-50 dark:bg-zayra-navy-mid text-gray-400'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" className="mx-auto mb-1 opacity-70" fill="currentColor">
                <path d="M10 1l2 6h6l-5 3.5 2 6L10 13l-5 3.5 2-6L2 7h6z" />
              </svg>
              <p className="font-display font-bold text-lg">{milestone.days}</p>
              <p className="text-xs uppercase tracking-wider opacity-70">{milestone.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Consistency by area */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Consistency by Area</p>
        {['Heart Rhythm', 'Sleep Rhythm', 'Stress Management', 'Activity'].map((area, i) => (
          <div key={area} className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{area}</span>
              <span>{[89, 74, 62, 81][i]}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-zayra-teal rounded-full transition-all"
                style={{ width: `${[89, 74, 62, 81][i]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
