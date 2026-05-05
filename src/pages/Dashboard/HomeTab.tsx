import React from 'react'
import { ShieldCheck } from 'lucide-react'
import { ECGChart } from '../../components/ui/ECGChart'
import type { HealthMetric, TimelineEvent, User } from '../../types'

interface HomeTabProps {
  user: User
  metrics: HealthMetric
  timeline: TimelineEvent[]
}

const timelineIconColor = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'observation': return 'bg-zayra-teal/20 text-zayra-teal'
    case 'confirmation': return 'bg-blue-100 text-blue-500'
    case 'alert': return 'bg-red-100 text-red-500'
    case 'insight': return 'bg-purple-100 text-purple-500'
    default: return 'bg-gray-100 text-gray-500'
  }
}

export function HomeTab({ user, metrics, timeline }: HomeTabProps) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING'

  return (
    <div className="px-4 pb-4 space-y-4 animate-fade-in">
      {/* Greeting + Care badge */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">{greeting}</p>
          <h2 className="font-display font-bold text-2xl text-zayra-navy dark:text-white mt-0.5">
            {user.name.toLowerCase()}.
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zayra-mint/60 rounded-full border border-zayra-teal/20">
          <ShieldCheck size={13} className="text-zayra-teal" />
          <span className="text-xs font-semibold text-zayra-navy uppercase tracking-wider">Care</span>
        </div>
      </div>

      {/* Live Monitor Card */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-zayra-teal animate-pulse" />
            <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Axiom — Live</span>
          </div>
          <span className="text-xs font-semibold bg-zayra-teal/10 text-zayra-teal px-2 py-0.5 rounded-full">
            Signal {metrics.signalStrength}%
          </span>
        </div>

        <p className="text-sm font-medium text-zayra-navy dark:text-white mb-3">
          You are being monitored continuously. Nothing has changed in the last 24 hours.
        </p>

        <ECGChart height={56} />

        <div className="flex items-center justify-around mt-3 pt-3 border-t border-gray-100">
          <div className="text-center">
            <p className="font-display font-bold text-2xl text-zayra-navy dark:text-white">{metrics.avgHr}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Avg HR</p>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="text-center">
            <p className="font-display font-bold text-2xl text-zayra-navy dark:text-white">{metrics.spo2}%</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">SpO₂</p>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="text-center">
            <p className="font-display font-bold text-2xl text-zayra-navy dark:text-white">{metrics.anomalies}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Anomalies</p>
          </div>
        </div>
      </div>

      {/* Alyna Timeline */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Alyna Timeline</p>
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
      </div>
    </div>
  )
}
