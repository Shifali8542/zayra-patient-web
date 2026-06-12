import React from 'react'
import { Quote, Calendar, ChevronRight } from 'lucide-react'
import iconPng from '../../assets/icon.png'
import type { Story } from '../../types'

interface StoriesTabProps {
  stories: Story[]
  isDark?: boolean
}

export function StoriesTab({ stories, isDark = false }: StoriesTabProps) {
  return (
    <div className={`pb-4 animate-fade-in min-h-full ${isDark ? 'bg-gradient-evac text-primary-foreground' : 'bg-gradient-hero'}`}>

      {/* ── Header — scrolls with content, matches reference ── */}
      <div className="px-6 pt-12 pb-2">
        <div className="flex items-center justify-between">
          <img src={iconPng} alt="Zayra" className="rounded-lg object-cover shadow-soft h-7 w-7" />
        </div>
        <p className="mt-5 text-xs uppercase tracking-[0.22em] text-muted-foreground">Real stories. Real outcomes.</p>
        <h1 className="font-display text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground">Zayra Journeys</h1>
      </div>

      {/* ── Story Cards ── */}
      <div className="px-6 pt-4 space-y-4">
        {/* Story cards — static reference data with exact classes from reference HTML */}

        {/* Card 1 — dark gradient */}
        <div className="relative overflow-hidden rounded-3xl border p-6 shadow-elevated bg-gradient-to-br from-ink/90 to-aqua/40 border-white/10 text-primary-foreground">
          <Quote className="h-6 w-6 text-cyan-glow" aria-hidden="true" />
          <p className="mt-3 text-[10.5px] uppercase tracking-[0.22em] opacity-80">Earlier cardiac insight</p>
          <p className="mt-2 font-display text-[19px] leading-snug font-medium text-balance">
            "Alyna flagged a pattern I'd ignored for months. My cardiologist confirmed it the next day."
          </p>
          <div className="mt-5 flex items-center justify-between">
            <p className="text-[13px] font-medium">Rohan, 47</p>
            <p className="text-[11.5px] uppercase tracking-[0.18em] text-cyan-glow">Caught early. Treated calmly.</p>
          </div>
        </div>

        {/* Card 2 — cyan-glow/30 to mist */}
        <div className="relative overflow-hidden rounded-3xl border p-6 shadow-elevated border-border"
          style={{ background: 'linear-gradient(135deg, oklch(86% .1 195 / .30) 0%, oklch(94.5% .012 225) 100%)' }}>
          <Quote className="h-6 w-6 text-aqua" aria-hidden="true" />
          <p className="mt-3 text-[10.5px] uppercase tracking-[0.22em] opacity-80">Family reassurance</p>
          <p className="mt-2 font-display text-[19px] leading-snug font-medium text-balance text-foreground">
            "My father is in another city. Zayra's circle quietly tells me he's okay every morning."
          </p>
          <div className="mt-5 flex items-center justify-between">
            <p className="text-[13px] font-medium text-foreground">Meera, 34</p>
            <p className="text-[11.5px] uppercase tracking-[0.18em] text-aqua">Distance, without worry.</p>
          </div>
        </div>

        {/* Card 3 — aqua/30 to pearl */}
        <div className="relative overflow-hidden rounded-3xl border p-6 shadow-elevated border-border"
          style={{ background: 'linear-gradient(135deg, oklch(74% .12 200 / .30) 0%, oklch(98.5% .004 220) 100%)' }}>
          <Quote className="h-6 w-6 text-aqua" aria-hidden="true" />
          <p className="mt-3 text-[10.5px] uppercase tracking-[0.22em] opacity-80">Pregnancy planning</p>
          <p className="mt-2 font-display text-[19px] leading-snug font-medium text-balance text-foreground">
            "It learned my cycle in two months. I felt understood — not measured."
          </p>
          <div className="mt-5 flex items-center justify-between">
            <p className="text-[13px] font-medium text-foreground">Aisha, 31</p>
            <p className="text-[11.5px] uppercase tracking-[0.18em] text-aqua">Body intelligence, gently.</p>
          </div>
        </div>

        {/* Weekly Reflection card — matches reference */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
          <Calendar className="h-4 w-4 text-aqua" aria-hidden="true" />
          <p className="mt-2 font-display text-[16px] font-semibold text-foreground">Weekly Reflection</p>
          <p className="mt-1 text-[13px] text-muted-foreground">Your Sunday ritual — what your body learned this week.</p>
          <button className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-aqua">
            Open this week <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}