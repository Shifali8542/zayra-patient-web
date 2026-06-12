import React from 'react'
import { Flame, Trophy } from 'lucide-react'
import iconPng from '../../assets/icon.png'
import type { RhythmStreak, ClinicalInfo } from '../../types'

interface RhythmTabProps {
  streak: RhythmStreak
  consistencyAreas: { label: string; value: number }[]
  clinicalInfo: ClinicalInfo | null
  isDark?: boolean
}

export function RhythmTab({ streak, consistencyAreas, clinicalInfo, isDark = false }: RhythmTabProps) {
  return (
    <div className={`flex flex-col min-h-full animate-fade-in ${isDark ? 'bg-gradient-evac text-primary-foreground' : 'bg-gradient-hero'}`}>

      {/* ── Static Header ── */}
      <div className="sticky top-0 z-10 px-6 pt-12 pb-3 bg-gradient-hero backdrop-blur-md">
        <div className="flex items-center justify-between">
          <img src={iconPng} alt="Zayra" className="rounded-lg object-cover shadow-soft h-7 w-7" />
        </div>
        <p className="mt-5 text-xs uppercase tracking-[0.22em] text-muted-foreground">Meaningful consistency</p>
        <h1 className="font-display text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground">Rhythm Streak</h1>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 px-6 pt-4 pb-6 space-y-5">

        {/* Streak card — dark gradient-ink matching reference */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-ink p-6 text-primary-foreground shadow-elevated">
          {/* Glow orb */}
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-cyan-glow/30 blur-3xl" />
          <Flame className="h-6 w-6 text-cyan-glow" aria-hidden="true" />
          <p className="mt-3 font-display text-[58px] leading-none font-semibold tabular-nums">
            {streak.days}
            <span className="text-2xl text-cyan-glow ml-1">{streak.days === 1 ? 'day' : 'days'}</span>
          </p>
          <p className="mt-2 text-[14px] text-cyan-glow/90 text-balance max-w-[260px]">
            {streak.days > 0
              ? `${streak.days} ECG session${streak.days === 1 ? '' : 's'} recorded. Alyna's understanding of your baseline deepens with each one.`
              : 'Your first ECG session will start your rhythm streak.'}
          </p>
          {/* Horizontal bar dots — matching reference exactly */}
          <div className="mt-5 flex items-center gap-1.5">
            {streak.weekDots.map((active, i) => (
              <div
                key={i}
                className={`h-8 flex-1 rounded-md transition-all ${active ? 'bg-gradient-aqua' : 'bg-white/10'}`}
              />
            ))}
          </div>
        </div>

        {/* Milestones — Trophy icon, grid-cols-3, active = gradient-aqua */}
        <div>
          <h3 className="mb-2.5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Milestones</h3>
          <div className="grid grid-cols-3 gap-3">
            {streak.milestones.map(milestone => (
              <div
                key={milestone.label}
                className={`rounded-2xl border p-3 text-center shadow-soft transition-smooth ${
                  milestone.active
                    ? 'border-aqua bg-gradient-aqua text-white'
                    : milestone.achieved
                    ? 'border-border bg-card'
                    : 'border-border bg-card'
                }`}
              >
                <Trophy
                  className={`mx-auto h-4 w-4 ${milestone.active ? 'text-white' : 'text-muted-foreground'}`}
                  aria-hidden="true"
                />
                <div className={`mt-1.5 font-display text-lg font-semibold tabular-nums ${
                  milestone.active ? 'text-white' : milestone.achieved ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {milestone.days}
                </div>
                <div className="text-[10.5px] uppercase tracking-[0.16em] opacity-80">
                  {milestone.label.charAt(0) + milestone.label.slice(1).toLowerCase()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consistency by Area — matches reference exactly */}
        <div className="px-0 pt-0">
          <h3 className="mb-2.5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Consistency by area</h3>
          <div className="space-y-3">
            {[
              { label: 'Heart awareness',  value: consistencyAreas[0]?.value ?? 92,  color: 'var(--aqua)' },
              { label: 'Recovery routine', value: consistencyAreas[1]?.value ?? 78,  color: 'oklch(0.55 0.13 210)' },
              { label: 'Reflection',       value: consistencyAreas[2]?.value ?? 65,  color: 'oklch(0.74 0.12 200)' },
            ].map(area => (
              <div key={area.label} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                <div className="flex items-center justify-between">
                  <p className="text-[13.5px] font-medium">{area.label}</p>
                  <p className="font-display text-[15px] font-semibold tabular-nums">{area.value}%</p>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-mist overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${area.value}%`, background: area.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}