import React from 'react'
import { ChevronRight, Shield, Users, Calendar, LifeBuoy, HeartPulse, Cpu, FileText  } from 'lucide-react'
import iconPng from '../../assets/icon.png'
import { useTheme } from '../../contexts/ThemeContext'
import type { User, ClinicalInfo } from '../../types'

interface ProfileTabProps {
  user: User
  onLogout: () => Promise<void>
  clinicalInfo: ClinicalInfo | null
  onNavigateSupport?: () => void
  isDark?: boolean
}

export function ProfileTab({ user, onLogout, clinicalInfo, onNavigateSupport, isDark = false }: ProfileTabProps) {
  const { theme } = useTheme()
  const ecg = clinicalInfo?.ecg_analysis

  // Real baseline from backend ecg_analysis
  const baselineLabel = ecg?.heart_rate_bpm != null
    ? `${Math.round(ecg.heart_rate_bpm)} bpm HR · ${ecg.hrv_ms != null ? `${Math.round(ecg.hrv_ms)} ms HRV` : '—'} · ${ecg.rhythm ?? '—'}`
    : 'Baseline not yet available'

  const userInitial = (user.first_name?.[0] ?? user.name?.[0] ?? '?').toUpperCase()

  // Menu items — matching reference exactly, support preserved
  const menuItems: { Icon: React.ElementType; label: string; sub: string; onPress?: () => void }[] = [
    { Icon: HeartPulse, label: 'Your baseline', sub: baselineLabel },
    { Icon: Cpu,        label: 'Devices',        sub: 'Zen · Axiom · Alyna' },
    { Icon: Shield,     label: 'Privacy Center', sub: 'What Zayra sees · what others see' },
    { Icon: Users,      label: 'Family & Circle', sub: 'Sharing & emergency awareness' },
    { Icon: FileText,   label: 'Reports',         sub: 'Clinician-ready PDFs' },
    { Icon: LifeBuoy,   label: 'Help & Support',  sub: 'Contact our support team', onPress: onNavigateSupport },
  ]

  // Theme-aware classes
  const bg         = isDark ? 'bg-gradient-evac' : 'bg-gradient-hero'
  const cardBg     = isDark ? 'bg-white/5 border-white/10' : 'bg-card border-border'
  const titleCls   = isDark ? 'text-primary-foreground' : 'text-foreground'
  const labelCls   = isDark ? 'text-muted-foreground'   : 'text-muted-foreground'
  const textCls    = isDark ? 'text-primary-foreground' : 'text-foreground'
  const subCls     = isDark ? 'text-white/50'           : 'text-muted-foreground'
  const chevronCls = isDark ? 'text-white/30'           : 'text-muted-foreground/40'
  const iconBg     = isDark ? 'bg-white/10'             : 'bg-mist'

  return (
    <div className={`flex flex-col min-h-full animate-fade-in ${bg}`}>

      {/* ── Header — scrolls with content ── */}
      <div className="px-6 pt-12 pb-2">
        <div className="flex items-center justify-between">
          <img src={iconPng} alt="Zayra" className="rounded-lg object-cover shadow-soft h-7 w-7" />
        </div>
        <p className="mt-5 text-xs uppercase tracking-[0.22em] text-muted-foreground">Your Zayra, Your Control</p>
        <h1 className={`font-display text-[28px] font-semibold leading-[1.1] tracking-tight ${titleCls}`}>Profile</h1>
      </div>

     {/* ── Scrollable Content ── */}
      <div className="flex-1 px-6 pt-4 pb-6 space-y-3">

        {/* Your baseline card — gradient-pulse avatar, matches reference exactly */}
        <div className={`rounded-3xl border p-5 shadow-soft flex items-center gap-4 ${cardBg}`}>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-pulse text-white font-display text-lg font-semibold shrink-0">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-display text-[16px] font-semibold ${textCls}`}>Your baseline</p>
            <p className={`text-[12.5px] truncate ${subCls}`}>{baselineLabel}</p>
          </div>
        </div>

        {/* Menu items — h-9 w-9 rounded-xl icon box, font-medium not semibold */}
        {[
          { Icon: HeartPulse, label: 'Devices',         sub: 'Zen · Axiom · Alyna',                    onPress: undefined },
          { Icon: Shield,     label: 'Privacy Center',  sub: 'What Zayra sees · what others see',       onPress: undefined },
          { Icon: Users,      label: 'Family & Circle', sub: 'Sharing & emergency awareness',           onPress: undefined },
          { Icon: Calendar,   label: 'Reports',         sub: 'Clinician-ready PDFs',                    onPress: undefined },
          { Icon: LifeBuoy,   label: 'Help & Support',  sub: 'Contact our support team', onPress: onNavigateSupport },
        ].map(({ Icon, label, sub, onPress }) => (
          <div
            key={label}
            onClick={onPress}
            className={`flex items-center gap-3 rounded-2xl border p-4 shadow-soft cursor-pointer transition-smooth hover:shadow-elevated ${cardBg}`}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${iconBg}`}>
              <Icon className={`h-4 w-4 ${isDark ? 'text-cyan-glow' : 'text-ink'}`} aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[14px] font-medium ${textCls}`}>{label}</p>
              <p className={`text-[12px] truncate ${subCls}`}>{sub}</p>
            </div>
            <ChevronRight className={`h-4 w-4 shrink-0 ${chevronCls}`} aria-hidden="true" />
          </div>
        ))}

        {/* Switch journey — card button matching reference */}
        <button className={`w-full rounded-2xl border p-4 text-left shadow-soft hover:border-aqua/50 transition-smooth ${cardBg}`}>
          <p className={`text-[14px] font-medium ${textCls}`}>Switch journey</p>
          <p className={`text-[12px] ${subCls}`}>Wellness · Care · Evac · Hospital</p>
        </button>

        {/* Reset demo — dashed border matching reference */}
        <button
          onClick={onLogout}
          className={`w-full rounded-2xl border border-dashed p-3 text-[12.5px] transition-smooth ${
            isDark
              ? 'border-white/20 text-white/40 hover:text-red-400'
              : 'border-border text-muted-foreground hover:text-red-400'
          }`}
        >
          Reset demo
        </button>

        {/* Bottom logo — matching reference */}
        <div className="flex items-center justify-center pt-2 opacity-60">
          <img src={iconPng} alt="Zayra" className="rounded-lg object-cover shadow-soft h-5 w-5" />
        </div>
      </div>
    </div>
  )
}