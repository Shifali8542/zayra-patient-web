import React from 'react'
import { useGreeting } from '../../hooks/useGreeting'
import type { HealthMetric, TimelineEvent, TimelineEventType, PatientSTResult, User } from '../../types'
import { useBLEContext } from '../../contexts/BLEContext'
import { BLEConnectionButton } from '../../components/ble/BLEConnectionButton'
import type { WSECGHookResult } from '../../hooks/useECGWebSocket'
import { CircleDot, CheckCircle, ShieldCheck, PhoneCall, MapPin, UserPlus, ClipboardList, CheckCircle2, Activity, Heart } from 'lucide-react'
import iconPng from '../../assets/icon.png'

// Hospital icon — lucide-react may not have it, use a fallback
const Hospital = ({ className, ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 7v4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/>
    <path d="M14 9h-4"/><path d="M18 11h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/>
    <path d="M18 21V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"/>
  </svg>
)

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
  const journey = user.journey ?? 'care'
  const isEvac = journey === 'evac'
  const isDark = isEvac

  // Theme tokens based on journey
  const themeText    = isDark ? 'text-primary-foreground' : 'text-foreground'
  const themeMuted   = isDark ? 'text-cyan-glow/80'       : 'text-muted-foreground'
  const themeBorder  = isDark ? 'border-white/10'          : 'border-border'
  const themeBg      = isDark ? 'bg-white/5'               : 'bg-card'
  const themeLabel   = isDark ? 'text-cyan-glow'           : 'text-muted-foreground'

  return (
    <div className={`pb-28 min-h-full ${isDark ? 'bg-gradient-evac text-primary-foreground' : 'bg-gradient-hero'}`}>

      {/* ── Header (BLE preserved exactly) ── */}
      <div className="px-6 pt-12 pb-2">
        <div className="flex items-center justify-between">
          {/* BLE — untouched */}
          <img src={iconPng} alt="Zayra" className={`rounded-lg object-cover shadow-soft h-7 w-7`} />
          <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] uppercase tracking-[0.18em] ${isDark ? 'border-white/15 bg-white/5 text-cyan-glow' : 'border-border bg-card text-muted-foreground shadow-soft'}`}>
            {isEvac
              ? <><ShieldCheck className="h-3 w-3" aria-hidden="true" />Evac armed</>
              : <><CircleDot className="h-2.5 w-2.5 text-success" />{journey}</>
            }
          </div>
        </div>

       {/* BLE strip shown only for Evac dark theme — for Care/Wellness it's inside Axiom card */}
        {isEvac && (
          <div className={`mt-3 flex items-center justify-between rounded-2xl border ${themeBorder} ${themeBg} px-4 py-2.5`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${bleStatus === 'streaming' ? 'bg-aqua' : 'opacity-40 bg-white'}`} />
              <span className={`text-[10px] font-semibold tracking-widest uppercase ${themeMuted}`}>Axiom — Live</span>
            </div>
            <div className="flex items-center gap-2">
              <BLEConnectionButton />
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isDark ? 'bg-white/10 text-cyan-glow' : 'bg-aqua/10 text-aqua'}`}>
                {bleStatus === 'streaming' ? 'BLE Connected' : metrics?.signalStrength != null ? `Signal ${metrics.signalStrength}%` : 'Signal —'}
              </span>
            </div>
          </div>
        )}

        <p className={`mt-5 text-xs uppercase tracking-[0.22em] ${themeLabel}`}>{isEvac ? 'Standing by' : greeting}</p>
        <h1 className={`font-display text-[28px] font-semibold leading-[1.1] tracking-tight ${themeText}`}>
          {isEvac ? 'Help is one tap away.' : `${firstName}.`}
        </h1>
      </div>

      {/* ── Evac Journey UI ── */}
      {isEvac && (
        <>
          {/* Activate Response */}
          <div className="px-6 pt-5">
            <button className="relative flex w-full items-center justify-between overflow-hidden rounded-3xl bg-gradient-aqua p-5 text-ink shadow-glow transition-smooth hover:scale-[1.01]">
              <div className="text-left">
                <p className="text-[10.5px] uppercase tracking-[0.22em] opacity-70">Response Center</p>
                <p className="font-display text-[20px] font-semibold leading-tight mt-0.5">Activate assisted response</p>
                <p className="text-xs opacity-80 mt-1">Ambulance · NOK · Hospital pre-alert</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                <PhoneCall className="h-6 w-6" aria-hidden="true" />
              </div>
            </button>
          </div>

          {/* Evac grid cards */}
          <div className="px-6 pt-5 grid grid-cols-2 gap-3">
            {[
              { Icon: MapPin,        title: 'Nearest Hospital', sub: 'Apollo · 6 min' },
              { Icon: Hospital,      title: 'ER Pre-alert',     sub: 'Ready' },
              { Icon: UserPlus,      title: 'Next of Kin',      sub: '2 linked' },
              { Icon: ClipboardList, title: 'Med Summary',      sub: 'Up to date' },
            ].map(({ Icon, title, sub }) => (
              <div key={title} className={`rounded-2xl border ${themeBorder} ${themeBg} p-4 backdrop-blur-md`}>
                <Icon className="h-4 w-4 text-cyan-glow" aria-hidden="true" />
                <p className={`mt-2 text-[13px] font-medium ${themeText}`}>{title}</p>
                <p className={`text-[11.5px] ${themeMuted}`}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Support timeline */}
          <div className="px-6 pt-5">
            <p className={`text-[10.5px] uppercase tracking-[0.22em] ${themeMuted} mb-2`}>Support timeline</p>
            <div className={`rounded-2xl border ${themeBorder} ${themeBg} p-4 backdrop-blur-md`}>
              {[
                'Last drill — 12 days ago, completed',
                'Family awareness — 2 contacts confirmed',
                'Hospital preference — set to Apollo Bandra',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 py-1.5">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-success shrink-0" aria-hidden="true" />
                  <p className={`text-[13px] leading-snug ${themeText}`}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Care / Wellness / Hospital Journey UI ── */}
      {!isEvac && (
        <>
          {/* Axiom Live Card */}
          <div className="px-6 pt-4">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-elevated">

              {/* Header row — matches reference exactly */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                  </span>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Axiom — Live</p>
                </div>
                <div className="flex items-center gap-2">
                  <BLEConnectionButton />
                  <span className="rounded-full bg-mist px-2.5 py-0.5 text-[10.5px] uppercase tracking-[0.16em] text-ink">
                    {bleStatus === 'streaming'
                      ? 'BLE Connected'
                      : metrics?.signalStrength != null
                        ? `Signal ${metrics.signalStrength}%`
                        : 'Signal —'}
                  </span>
                </div>
              </div>

              {/* Interpretation — real backend API data */}
              <p className="mt-3 font-display text-[18px] leading-snug font-medium text-balance text-foreground">
                {interpretation ?? 'You are being monitored continuously. Nothing has changed in the last 24 hours.'}
              </p>

              {/* ECG waveform — light mist background exactly as reference */}
              <div className="mt-4 h-24 rounded-xl bg-gradient-to-b from-mist/40 to-transparent">
                <svg viewBox="0 0 600 120" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="ecg-fade" x1="0" x2="1">
                      <stop offset="0"   stopColor="var(--aqua)" stopOpacity="0" />
                      <stop offset="0.2" stopColor="var(--aqua)" stopOpacity="0.9" />
                      <stop offset="0.8" stopColor="var(--aqua)" stopOpacity="0.9" />
                      <stop offset="1"   stopColor="var(--aqua)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,60 L80,60 L100,60 L110,55 L120,65 L135,30 L150,90 L165,40 L180,60 L260,60 L280,60 L290,55 L300,65 L315,30 L330,90 L345,40 L360,60 L440,60 L460,60 L470,55 L480,65 L495,30 L510,90 L525,40 L540,60 L600,60"
                    fill="none"
                    stroke="url(#ecg-fade)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="1200"
                  />
                </svg>
              </div>

              {/* 3 metrics — real backend + BLE data */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="font-display text-lg font-semibold tabular-nums text-foreground">
                    {displayBpm ? fmt(displayBpm) : fmt(metrics?.avgHr)}
                  </div>
                  <div className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
                    {displayBpm ? 'Live BPM' : 'Avg HR'}
                  </div>
                </div>
                <div>
                  <div className="font-display text-lg font-semibold tabular-nums text-foreground">
                    {fmt(metrics?.hrv_ms)}
                  </div>
                  <div className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">HRV ms</div>
                </div>
                <div>
                  <div className="font-display text-lg font-semibold tabular-nums text-foreground">
                    {fmt(metrics?.qrs_width_ms)}
                  </div>
                  <div className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">QRS ms</div>
                </div>
              </div>
            </div>
          </div>

          {/* Alyna Timeline — real backend API data from timeline prop */}
          <div className="px-6 pt-5">
            <h3 className="mb-2.5 mt-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Alyna timeline</h3>
            <div className="rounded-2xl border border-border bg-card p-2 shadow-soft">
              {(timeline.length > 0 ? timeline : [
                { id: 'a', type: 'observation' as const,  title: 'AI observed minor PVC pattern',         time: '08:14' },
                { id: 'b', type: 'observation' as const,  title: 'Cross-confirmed with Zen pulse',        time: '08:14' },
                { id: 'c', type: 'confirmation' as const, title: 'Reviewed by Dr. Mehta — benign',        time: '08:32' },
                { id: 'd', type: 'observation' as const,  title: 'No action needed. Trend remains stable.', time: '—'   },
              ]).map((event) => (
                <div key={event.id} className="flex items-start gap-3 px-3 py-3 border-b last:border-0 border-border/60">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-mist shrink-0">
                    {event.type === 'confirmation'
                      ? <CheckCircle className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                      : <CircleDot   className="h-3 w-3 text-aqua"        aria-hidden="true" />
                    }
                  </div>
                  <div className="flex-1">
                    <p className="text-[13.5px] leading-snug text-foreground">{event.title}</p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground tabular-nums mt-0.5">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Patch — signal quality from backend, battery static placeholder */}
          <div className="px-6 pt-5">
            <h3 className="mb-2.5 mt-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Your patch</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-card p-3.5 shadow-soft">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Activity className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="text-[10.5px] uppercase tracking-[0.18em]">Adherence</span>
                </div>
                <div className="mt-2">
                  <span className="font-display text-[22px] font-semibold tabular-nums leading-none text-foreground">
                    {metrics?.signalStrength != null ? `${Math.round(metrics.signalStrength / 7)}d` : '—'}
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-3.5 shadow-soft">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="text-[10.5px] uppercase tracking-[0.18em]">Battery</span>
                </div>
                <div className="mt-2">
                  <span className="font-display text-[22px] font-semibold tabular-nums leading-none text-foreground">72%</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}