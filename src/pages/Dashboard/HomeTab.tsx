import React from 'react'
import { useGreeting } from '../../hooks/useGreeting'
import type { HealthMetric, TimelineEvent, TimelineEventType, PatientSTResult, User } from '../../types'
import { useBLEContext } from '../../contexts/BLEContext'
import { BLEConnectionButton } from '../../components/ble/BLEConnectionButton'
import type { WSECGHookResult } from '../../hooks/useECGWebSocket'
import { CircleDot, ChevronRight, CheckCircle, Stethoscope, CalendarCheck } from 'lucide-react'
import { ZayraLogo } from '../../components/ui/ZayraLogo'

interface HomeTabProps {
  user: User
  metrics: HealthMetric | null
  timeline: TimelineEvent[]
  interpretation: string | null
  stResult: PatientSTResult | null
  ecgWS: WSECGHookResult
}

function fmt(val: number | null | undefined): string {
  if (val == null) return '—'
  return String(Math.round(val))
}

export function HomeTab({ user, metrics, timeline, interpretation, stResult, ecgWS }: HomeTabProps) {
  const greeting = useGreeting()
  const { status: bleStatus } = useBLEContext()
  const displayBpm = ecgWS.liveBpm
  const firstName = user.first_name?.toLowerCase() || user.name?.toLowerCase() || ''

  return (
    <div className="pb-28 animate-fade-in">
      {/* Header */}
      <div className="px-6 pt-12 pb-2">
        <div className="flex items-center justify-between">
          <ZayraLogo size={36} showText={false} variant="icon" imgClassName="animate-heartbeat shadow-soft rounded-full" />
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground shadow-soft">
            <CircleDot className="h-2.5 w-2.5 text-success" />
            {user.journey}
          </div>
        </div>
        <p className="mt-5 text-xs uppercase tracking-[0.22em] text-muted-foreground">{greeting}</p>
        <h1 className="font-display text-[30px] font-semibold leading-[1.1] tracking-tight text-foreground">{firstName}.</h1>
      </div>

      {/* Mock Section: Recovery Score */}
      <div className="px-6 pt-4">
        <div className="rounded-3xl border border-border bg-gradient-care p-5 shadow-elevated">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Recovery score</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="relative" style={{ width: 130, height: 130 }}>
              <svg width="130" height="130" className="rotate-[-90deg]">
                <defs>
                  <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="oklch(0.32 0.07 245)" />
                    <stop offset="0.6" stopColor="oklch(0.55 0.13 210)" />
                    <stop offset="1" stopColor="oklch(0.86 0.10 195)" />
                  </linearGradient>
                </defs>
                <circle cx="65" cy="65" r="53" fill="none" stroke="oklch(0.9 0.015 225)" strokeWidth="10" />
                <circle cx="65" cy="65" r="53" fill="none" stroke="url(#ring-grad)" strokeWidth="10" strokeLinecap="round" strokeDasharray="333" strokeDashoffset="93" style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-4xl font-semibold tabular-nums tracking-tight text-foreground">72</span>
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-1">Day 14 / 30</span>
              </div>
            </div>
            <div className="flex-1 pl-5">
              <p className="font-display text-[16px] leading-snug font-medium text-balance text-foreground">Steady recovery. Dr. Iyer reviewed your trace this morning.</p>
              <button className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-aqua">
                Open care plan <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Section: Today's Care Plan */}
      <div className="px-6 pt-5">
        <h3 className="mb-2.5 mt-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Today's care plan</h3>
        <div className="rounded-2xl border border-border bg-card p-2 shadow-soft">
          {[
            { label: 'Morning meds — Ramipril 5mg', done: true },
            { label: 'Walk 15 min — light pace', done: true },
            { label: 'Symptom log — chest, breath, energy', done: false },
            { label: 'Evening BP reading', done: false },
          ].map((task, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-3 border-b last:border-0 border-border/60">
              {task.done ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border bg-gradient-aqua border-transparent">
                  <CheckCircle className="h-3.5 w-3.5 text-white" />
                </div>
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card" />
              )}
              <p className={`text-[14px] flex-1 ${task.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {task.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mock Section: Your Care Team */}
      <div className="px-6 pt-5">
        <h3 className="mb-2.5 mt-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Your care team</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <Stethoscope className="h-4 w-4 text-aqua" />
            <p className="mt-2 text-[14px] font-medium text-foreground">Dr. Anjali Iyer</p>
            <p className="text-xs text-muted-foreground">Cardiology · Reviews daily</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <CalendarCheck className="h-4 w-4 text-aqua" />
            <p className="mt-2 text-[14px] font-medium text-foreground">Follow-up</p>
            <p className="text-xs text-muted-foreground">Tue, 14 May · 11:00</p>
          </div>
        </div>
      </div>

      {/* Preserved Live Monitor (Data Backend Intact & Required for BLE functionality) */}
      <div className="px-6 pt-5">
        <h3 className="mb-2.5 mt-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Live Monitor</h3>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-elevated">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${bleStatus === 'streaming' ? 'bg-aqua' : 'bg-muted'}`} />
              <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">Axiom — Live</span>
            </div>
            <div className="flex items-center gap-2">
              <BLEConnectionButton />
              <span className="text-[10px] font-semibold bg-aqua/10 text-aqua px-2 py-0.5 rounded-full">
                {bleStatus === 'streaming' ? 'BLE Connected' : metrics?.signalStrength != null ? `Signal ${metrics.signalStrength}%` : 'Signal —'}
              </span>
            </div>
          </div>

          <p className="text-sm font-medium text-foreground mb-4">
            {interpretation ?? 'Monitoring your ECG data continuously.'}
          </p>

          <div className="flex items-center justify-around mt-4 pt-4 border-t border-border/60">
            <div className="text-center">
              <p className="font-display font-bold text-2xl text-foreground">
                {displayBpm ? fmt(displayBpm) : fmt(metrics?.avgHr)}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{displayBpm ? 'Live BPM' : 'Avg HR'}</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="font-display font-bold text-2xl text-foreground">{fmt(metrics?.hrv_ms)}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">HRV ms</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="font-display font-bold text-2xl text-foreground">{fmt(metrics?.qrs_width_ms)}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">QRS ms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}