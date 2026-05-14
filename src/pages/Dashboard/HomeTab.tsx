// =============================================================================
// src/pages/Dashboard/HomeTab.tsx
// Real backend data. Metrics: Avg HR, HRV, QRS (ECG-derived, no SpO2).
// ST emergency alert shown when stemi_suspected = true.
// =============================================================================

import React from 'react'
import { ECGChart } from '../../components/ui/ECGChart'
import type { HealthMetric, TimelineEvent, TimelineEventType, PatientSTResult, User } from '../../types'

interface HomeTabProps {
  user: User
  metrics: HealthMetric | null
  timeline: TimelineEvent[]
  interpretation: string | null
  stResult: PatientSTResult | null
}

function fmt(val: number | null | undefined): string {
  if (val == null) return '—'
  return String(Math.round(val))
}

function timelineIconColor(type: TimelineEventType) {
  switch (type) {
    case 'observation': return 'bg-zayra-teal/20 text-zayra-teal'
    case 'confirmation': return 'bg-blue-100 text-blue-500'
    case 'alert': return 'bg-red-100 text-red-500'
    case 'insight': return 'bg-purple-100 text-purple-500'
    default: return 'bg-gray-100 text-gray-500'
  }
}

function getGreeting(): string {
  const hour = new Date().getHours()
  return hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING'
}

export function HomeTab({ user, metrics, timeline, interpretation, stResult }: HomeTabProps) {
  const firstName = user.first_name?.toLowerCase() || user.name?.toLowerCase() || ''

  return (
    <div className="px-4 pb-4 space-y-4 animate-fade-in">

      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">{getGreeting()}</p>
          <h2 className="font-display font-bold text-2xl text-zayra-navy dark:text-white mt-0.5">
            {firstName}.
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zayra-mint/60 rounded-full border border-zayra-teal/20">
          <span className="text-xs font-semibold text-zayra-navy uppercase tracking-wider">{user.journey}</span>
        </div>
      </div>

      {/* ST Emergency Alert — only when stemi_suspected = true */}
      {stResult?.emergency_alert && (
        <div className="flex items-start gap-2 p-3 rounded-2xl border"
             style={{ backgroundColor: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)' }}>
          <span className="text-base">🚨</span>
          <p className="text-xs font-medium" style={{ color: '#EF4444' }}>
            {stResult.your_result} — {stResult.what_this_means}
          </p>
        </div>
      )}

      {/* Live Monitor Card */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-zayra-teal animate-pulse" />
            <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Axiom — Live</span>
          </div>
          <span className="text-xs font-semibold bg-zayra-teal/10 text-zayra-teal px-2 py-0.5 rounded-full">
            {metrics?.signalStrength != null ? `Signal ${metrics.signalStrength}%` : 'Signal —'}
          </span>
        </div>

        {/* Real AI narrative */}
        <p className="text-sm font-medium text-zayra-navy dark:text-white mb-3">
          {interpretation ?? 'Monitoring your ECG data continuously.'}
        </p>

        <ECGChart height={56} />

        <div className="flex items-center justify-around mt-3 pt-3 border-t border-gray-100">
          {/* Avg HR */}
          <div className="text-center">
            <p className="font-display font-bold text-2xl text-zayra-navy dark:text-white">{fmt(metrics?.avgHr)}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Avg HR</p>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          {/* HRV — replaces SpO₂ (not from ECG datasets) */}
          <div className="text-center">
            <p className="font-display font-bold text-2xl text-zayra-navy dark:text-white">{fmt(metrics?.hrv_ms)}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">HRV ms</p>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          {/* QRS Width — replaces Anomalies */}
          <div className="text-center">
            <p className="font-display font-bold text-2xl text-zayra-navy dark:text-white">{fmt(metrics?.qrs_width_ms)}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">QRS ms</p>
          </div>
        </div>
      </div>

      {/* Alyna Timeline */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Alyna Timeline</p>

        {timeline.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <span className="text-2xl">🩺</span>
            <p className="text-xs text-gray-400">No AI insights yet. Run an AI analysis from your ECG tab.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {timeline.map(event => (
              <div key={event.id} className="flex items-start gap-3 card px-3 py-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${timelineIconColor(event.type)}`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <circle cx="6" cy="6" r="4" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zayra-navy dark:text-white leading-snug">{event.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}