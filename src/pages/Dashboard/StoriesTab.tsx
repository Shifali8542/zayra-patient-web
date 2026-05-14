// =============================================================================
// src/pages/Dashboard/StoriesTab.tsx
// Stories = static content (no backend endpoint yet). Marked in api.ts.
// UI unchanged from original.
// =============================================================================

import React from 'react'
import type { Story } from '../../types'

interface StoriesTabProps {
  stories: Story[]
}

export function StoriesTab({ stories }: StoriesTabProps) {
  return (
    <div className="px-4 pb-4 space-y-4 animate-fade-in">
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Real Stories. Real Outcomes.</p>
        <h2 className="font-display font-bold text-2xl text-zayra-navy dark:text-white mt-0.5">Zayra Journeys</h2>
      </div>

      <div className="space-y-3">
        {stories.map((story, i) => (
          <div
            key={story.id}
            className={`rounded-2xl p-5 ${
              i % 2 === 0
                ? 'text-white'
                : 'card'
            }`}
            style={i % 2 === 0 ? { background: 'linear-gradient(135deg, #1B3A55 0%, #0D1B2A 100%)' } : {}}
          >
            <svg
              width="28" height="22" viewBox="0 0 28 22"
              className="mb-3 text-zayra-teal" fill="currentColor"
            >
              <path d="M0 22V13.273C0 5.942 4.667 1.455 14 0l1.867 2.909C11.244 3.97 8.756 5.97 8.178 9.09H12V22H0zm16 0V13.273C16 5.942 20.667 1.455 30 0l1.867 2.909C27.244 3.97 24.756 5.97 24.178 9.09H28V22H16z" transform="scale(0.9)" />
            </svg>
            <p className={`text-xs font-semibold tracking-widest uppercase mb-2 ${i % 2 === 0 ? 'text-white/60' : 'text-gray-400'}`}>
              {story.type}
            </p>
            <p className={`text-sm font-medium leading-relaxed mb-3 ${i % 2 === 0 ? 'text-white' : 'text-zayra-navy dark:text-white'}`}>
              "{story.quote}"
            </p>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${i % 2 === 0 ? 'text-white/70' : 'text-gray-500'}`}>
                {story.author}{story.authorAge ? `, ${story.authorAge}` : ''}
              </span>
              <span className={`text-xs font-semibold tracking-wide px-2 py-1 rounded-full ${
                i % 2 === 0 ? 'bg-zayra-teal/20 text-zayra-teal' : 'bg-zayra-mint/60 text-zayra-teal'
              }`}>
                {story.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}