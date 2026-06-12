import React from 'react'
import { MessageCircleHeart } from 'lucide-react'
import iconPng from '../../assets/icon.png'
import type { CircleMember, Journey, User } from '../../types'

interface CircleTabProps {
  members: CircleMember[]
  journeys: Journey[]
  user: User | null
  isDark?: boolean
}

// Static data matching reference exactly
const STATIC_CIRCLE = [
  { id: '1', initials: 'P', name: 'Priya' },
  { id: '2', initials: 'R', name: 'Rohan' },
  { id: '3', initials: 'A', name: 'Anjali' },
]

const EXPERT_ROOMS = [
  { initials: 'M', name: 'Dr. Mehta',    sub: 'Cardiologist · Q&A live',  time: 'Today · 19:00' },
  { initials: 'S', name: 'Dr. Saanvi Rao', sub: "Women's Health",         time: 'Sat · 10:30' },
  { initials: 'A', name: 'Coach Aarav',  sub: 'Recovery & Stress',        time: 'Replay' },
]

const QUIET_SUPPORT = ['With you', 'Stay steady', 'Sending calm', 'Proud of you', "You're doing well"]

const JOURNEY_STYLES = [
  { bg: 'bg-gradient-to-br from-ink/90 to-aqua/40',    titleCls: 'text-primary-foreground', subCls: 'text-cyan-glow' },
  { bg: 'bg-gradient-to-br from-aqua/40 to-cyan-glow/30', titleCls: 'text-ink',             subCls: 'text-ink/70' },
  { bg: 'bg-gradient-to-br from-cyan-glow/40 to-mist',  titleCls: 'text-ink',               subCls: 'text-ink/70' },
]

export function CircleTab({ members, journeys, user, isDark = false }: CircleTabProps) {
  return (
    <div className={`flex flex-col min-h-full animate-fade-in ${isDark ? 'bg-gradient-evac text-primary-foreground' : 'bg-gradient-hero'}`}>

      {/* ── Static Header ── */}
      <div className="sticky top-0 z-10 px-6 pt-12 pb-3 bg-gradient-hero backdrop-blur-md">
        <div className="flex items-center justify-between">
          <img src={iconPng} alt="Zayra" className="rounded-lg object-cover shadow-soft h-7 w-7" />
        </div>
        <p className="mt-5 text-xs uppercase tracking-[0.22em] text-muted-foreground">Calm support, real journeys</p>
        <h1 className="font-display text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground">Community</h1>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 px-6 pt-4 pb-6 space-y-3">

        {/* My Circle card */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">My Circle</p>
            <span className="rounded-full bg-mist px-2 py-0.5 text-[10.5px] uppercase tracking-[0.16em] text-ink">
              {STATIC_CIRCLE.length} with you
            </span>
          </div>
          <div className="mt-3 flex -space-x-2">
            {STATIC_CIRCLE.map(m => (
              <div key={m.id}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-card bg-gradient-aqua text-white text-xs font-semibold">
                {m.initials}
              </div>
            ))}
            <button className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-card bg-mist text-ink text-sm font-medium">
              +
            </button>
          </div>
          <p className="mt-3 text-[13px] text-muted-foreground">Priya sent you "Stay steady" this morning.</p>
        </div>

        {/* Shared Journeys */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-2 px-1">Shared journeys</p>
          <div className="space-y-2.5">
            {journeys.map((journey, i) => {
              const style = JOURNEY_STYLES[i % JOURNEY_STYLES.length]
              return (
                <button key={journey.id}
                  className={`relative w-full overflow-hidden rounded-2xl border border-border p-4 text-left shadow-soft hover:shadow-elevated transition-smooth ${style.bg}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-display text-[15px] font-semibold ${style.titleCls}`}>{journey.title}</p>
                      <p className={`text-[12px] mt-0.5 ${style.subCls}`}>{journey.subtitle}</p>
                    </div>
                    <span className="text-2xl">{journey.emoji}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Expert Rooms */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-2 px-1">Expert rooms</p>
          <div className="rounded-2xl border border-border bg-card divide-y divide-border shadow-soft">
            {EXPERT_ROOMS.map(room => (
              <div key={room.name} className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-ink text-primary-foreground text-sm font-semibold shrink-0">
                  {room.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-foreground">{room.name}</p>
                  <p className="text-[12px] text-muted-foreground truncate">{room.sub}</p>
                </div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-aqua shrink-0">{room.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiet Support */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-2 px-1">Quiet support</p>
          <div className="flex flex-wrap gap-2">
            {QUIET_SUPPORT.map(msg => (
              <span key={msg}
                className="rounded-full border border-border bg-card px-3.5 py-1.5 text-[12.5px] text-ink cursor-pointer hover:border-aqua/50 transition-smooth">
                <MessageCircleHeart className="mr-1 inline h-3 w-3 text-aqua" aria-hidden="true" />
                {msg}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}