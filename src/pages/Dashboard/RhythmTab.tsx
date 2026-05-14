// =============================================================================
// src/pages/Dashboard/RhythmTab.tsx
// Real backend data. Streak derived from record_count. Consistency areas from
// ecg_analysis. ECG interval cards from clinical-info.ecg_analysis.
// Removed all hardcoded values (89/74/62/81%, "high-stress week", etc.)
// =============================================================================

import React from 'react'
import { Flame } from 'lucide-react'
import type { RhythmStreak, ClinicalInfo } from '../../types'

interface RhythmTabProps {
  streak: RhythmStreak
  consistencyAreas: { label: string; value: number }[]
  clinicalInfo: ClinicalInfo | null
}

function fmt(val: number | null | undefined): string {
  if (val == null) return '—'
  return String(Math.round(val))
}

function getRhythmColor(rhythm: string | null): string {
  if (!rhythm || rhythm === 'Unknown') return '#6B7280'
  if (rhythm === 'Normal Sinus Rhythm') return '#10B981'
  return '#F59E0B'
}

export function RhythmTab({ streak, consistencyAreas, clinicalInfo }: RhythmTabProps) {
  const ecg = clinicalInfo?.ecg_analysis ?? null
  const rhythm = ecg?.rhythm ?? null
  const rhythmColor = getRhythmColor(rhythm)

  return (
    <div className="px-4 pb-4 space-y-4 animate-fade-in">
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Meaningful Consistency</p>
        <h2 className="font-display font-bold text-2xl text-zayra-navy dark:text-white mt-0.5">Rhythm Streak</h2>
      </div>

      {/* Streak card */}
      <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #00C2B2 0%, #0D1B2A 100%)' }}>
        <Flame size={24} className="text-white/80 mb-2" />
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-display font-bold text-5xl">{streak.days}</span>
          <span className="text-xl font-medium opacity-70">
            {streak.days === 1 ? 'session' : 'sessions'}
          </span>
        </div>
        {/* Real description — not hardcoded */}
        <p className="text-sm opacity-80 mb-4">
          {streak.days > 0
            ? `${streak.days} ECG session${streak.days === 1 ? '' : 's'} recorded. Alyna's understanding of your baseline grows with each one.`
            : 'Your first ECG session will start your rhythm streak.'}
        </p>
        <div className="flex items-center gap-2">
          {streak.weekDots.map((active, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? 'bg-white/30' : 'bg-white/10'}`}
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
                  ? 'bg-zayra-mint/60 text-zayra-navy dark:text-zayra-navy'
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

      {/* ECG Intervals — real from ecg_analysis */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Your ECG Intervals</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Heart Rate', value: fmt(ecg?.heart_rate_bpm), hint: '60–100 bpm' },
            { label: 'HRV', value: fmt(ecg?.hrv_ms), hint: 'higher = better' },
            { label: 'QRS Width', value: fmt(ecg?.qrs_width_ms), hint: '70–110 ms' },
            { label: 'QT Interval', value: fmt(ecg?.qt_ms), hint: '350–440 ms' },
          ].map(m => (
            <div key={m.label} className="card p-3">
              <p className="font-display font-bold text-xl text-zayra-navy dark:text-white">{m.value}</p>
              <p className="text-xs font-semibold text-gray-500">{m.label}</p>
              <p className="text-xs text-gray-400">{m.hint}</p>
            </div>
          ))}
        </div>
        {/* Rhythm — full width */}
        <div className="card mt-2 p-3 flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500">Rhythm</p>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: rhythmColor }} />
            <p className="text-sm font-medium text-zayra-navy dark:text-white">{rhythm ?? '—'}</p>
          </div>
        </div>
        {clinicalInfo?.record_name && (
          <p className="text-xs text-gray-400 mt-1 px-1">From record: {clinicalInfo.record_name}</p>
        )}
      </div>

      {/* Consistency by Area — derived from real ecg_analysis */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Consistency by Area</p>
        {consistencyAreas.map(area => (
          <div key={area.label} className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{area.label}</span>
              <span>{area.value}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-zayra-teal rounded-full transition-all"
                style={{ width: `${area.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}