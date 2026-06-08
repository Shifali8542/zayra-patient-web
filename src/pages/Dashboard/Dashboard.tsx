import React, { useState } from 'react'
import { HeartPulse, ShieldCheck, Sparkles, ArrowRight, Heart, Activity, Stethoscope } from 'lucide-react'
import { useDashboard } from '../../hooks/useDashboard'
import { useAuthContext } from '../../contexts/AuthContext'
import { useECGWebSocket } from '../../hooks/useECGWebSocket'
import { BottomNav } from '../../components/ui/BottomNav'
import { ZayraLogo } from '../../components/ui/ZayraLogo'
import { HomeTab } from './HomeTab'
import { AlynaTab } from './AlynaTab'
import { CircleTab } from './CircleTab'
import { RhythmTab } from './RhythmTab'
import { StoriesTab } from './StoriesTab'
import { ProfileTab } from './ProfileTab'
import { Navbar } from '../../components/layout/Navbar'
import { SupportScreen } from '../Support/SupportScreen'
import { TicketChatScreen } from '../Support/TicketChatScreen'
import type { User } from '../../types'

interface DashboardPageProps {
  user: User
  onLogout: () => Promise<void>
}

export function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState('home')
  const [openTicketId, setOpenTicketId] = useState<number | null>(null)
  const [phoneState, setPhoneState] = useState<'landing' | 'journey' | 'name' | 'dashboard'>('landing')
  const [onboardingName, setOnboardingName] = useState('')
  const dashboard = useDashboard()
  const { tokens } = useAuthContext()

  // WebSocket ECG — auto-connects once patientMe is loaded
  const ecgWS = useECGWebSocket(
    dashboard.patientNumericId,
    dashboard.firstRecordId,
    tokens?.access ?? null,
  )

  // Auto-start streaming as soon as metadata arrives from the server
  React.useEffect(() => {
    if (ecgWS.status === 'streaming' && ecgWS.metadata) {
      ecgWS.start(1)
    }
  }, [ecgWS.status])

  const renderTab = () => {
    if (dashboard.loading && !dashboard.patientMe) return null

    // No patient profile linked to this account
    if (dashboard.noPatientProfile) {
      return (
        <div className="flex flex-col items-center justify-center h-64 px-6 gap-4 text-center">
          <span className="text-4xl">🏥</span>
          <p className="text-sm font-semibold text-zayra-navy dark:text-white">
            Profile not yet linked
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Your account is not yet linked to an ECG profile. Please contact your healthcare provider.
          </p>
          <button
            onClick={onLogout}
            className="text-xs font-medium text-red-400 border border-red-100 rounded-full px-4 py-2 hover:border-red-200 transition-all"
          >
            Sign out
          </button>
        </div>
      )
    }

    // Error state
    if (dashboard.error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 px-6 gap-4 text-center">
          <span className="text-3xl">⚠️</span>
          <p className="text-sm text-zayra-navy dark:text-white font-medium">{dashboard.error}</p>
          <button
            onClick={dashboard.reload}
            className="text-xs font-semibold bg-zayra-teal text-white px-4 py-2 rounded-full hover:bg-zayra-accent transition-colors"
          >
            Retry
          </button>
        </div>
      )
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeTab
            user={user}
            metrics={dashboard.metrics}
            timeline={dashboard.timeline}
            interpretation={dashboard.interpretation}
            stResult={dashboard.stResult}
            ecgWS={ecgWS}
          />
        )
      case 'alyna':
        return (
          <AlynaTab
            initialChat={dashboard.alynaChat}
            onSendMessage={dashboard.sendAlynaMessage}
            interpretation={dashboard.interpretation}
            riskLevel={dashboard.riskLevel}
            findings={dashboard.findings}
            recommendation={dashboard.recommendation}
          />
        )
      case 'circle':
        return <CircleTab members={dashboard.members} journeys={dashboard.journeys} user={user} />
      case 'rhythm':
        return dashboard.streak
          ? <RhythmTab streak={dashboard.streak} consistencyAreas={dashboard.consistencyAreas} clinicalInfo={dashboard.clinicalInfo} />
          : null
      case 'stories':
        return <StoriesTab stories={dashboard.stories} />
      case 'support':
        if (openTicketId !== null) {
          return (
            <TicketChatScreen
              ticketId={openTicketId}
              accessToken={tokens?.access ?? null}
              onBack={() => setOpenTicketId(null)}
            />
          )
        }
        return (
          <SupportScreen onOpenTicket={(id) => setOpenTicketId(id)} />
        )
      case 'profile':
        return (
          <ProfileTab
            user={user}
            onLogout={onLogout}
            clinicalInfo={dashboard.clinicalInfo}
            onNavigateSupport={() => setActiveTab('support')}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-hero">
      <div
        className="pointer-events-none absolute -top-40 left-1/4 h-[640px] w-[640px] rounded-full blur-3xl"
        style={{ backgroundColor: 'color-mix(in oklch, var(--aqua) 20%, transparent)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-1/4 h-[560px] w-[560px] rounded-full blur-3xl"
        style={{ backgroundColor: 'color-mix(in oklch, var(--cyan-glow) 30%, transparent)' }}
      />

      <Navbar onRequestAccess={() => { }} />

      <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-10 lg:pt-16">

        {/* Left Column: Marketing */}
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-md shadow-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Adaptive health OS · Iteration 1
          </div>

          <h1 className="mt-6 font-display text-[4px] font-semibold leading-[1.05] tracking-tight text-balance md:text-[48px]">
            Know your body<br />
            <span className="bg-gradient-pulse bg-clip-text text-transparent">before it asks for help.</span>
          </h1>

          <p className="mt-5 max-w-[520px] text-[16px] leading-relaxed text-muted-foreground text-balance md:text-[17px]">
            Zayra is a governed-AI cardiac and physiological intelligence platform —
            <span className="text-foreground font-medium"> Zen</span> wristband,
            <span className="text-foreground font-medium"> Axiom</span> ECG patch,
            <span className="text-foreground font-medium"> Alyna</span> AI engine, clinician validation, and
            <span className="text-foreground font-medium"> Evac</span> assisted response — adapting to who you are and what you need.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { Icon: HeartPulse, title: 'Wellness', sub: 'Body intelligence, daily' },
              { Icon: Sparkles, title: 'Care', sub: 'Quiet cardiac vigilance' },
              { Icon: ShieldCheck, title: 'Evac', sub: 'Help, ready and routed' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-card/70 p-4 shadow-soft backdrop-blur-md cursor-pointer hover:bg-card transition-colors">
                <item.Icon className="h-4 w-4 text-aqua" strokeWidth={2} />
                <p className="mt-2 font-display text-[15px] font-semibold text-foreground">{item.title}</p>
                <p className="text-[12.5px] text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-[460px] text-[13px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <ZayraLogo size={16} showText={false} /> Try the live experience →
            </span>{' '}
            tap <em>Begin</em>, choose a journey, and explore Wellness, Care, Evac or Hospital — all adapt in tone, navigation and intelligence.
          </p>
        </div>

        {/* Right Column: Phone Frame */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative mx-auto">
            <div
              className="relative h-[860px] w-[400px] rounded-[3rem] p-[10px] shadow-elevated"
              style={{
                background: 'linear-gradient(to bottom, white, var(--mist))',
                boxShadow: '0 60px 120px -40px oklch(0.32 0.07 245 / 0.35), 0 0 0 1px oklch(0.32 0.07 245 / 0.08)'
              }}
            >
              <div className="relative flex flex-col h-full w-full overflow-hidden rounded-[2.4rem]" style={{ backgroundColor: 'var(--pearl)' }}>
                {/* Notch */}
                <div className="absolute left-1/2 top-3 z-50 h-7 w-28 -translate-x-1/2 rounded-full bg-black/90" />

                {/* 1. LANDING SCREEN */}
                {phoneState === 'landing' && (
                  <div className="relative h-full w-full overflow-y-auto no-scrollbar">
                    <div className="relative h-full w-full bg-gradient-hero overflow-hidden">
                      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[480px] w-[480px] rounded-full blur-3xl" style={{ backgroundColor: 'color-mix(in oklch, var(--aqua) 30%, transparent)' }}></div>
                      <div className="pointer-events-none absolute -bottom-24 -right-12 h-[360px] w-[360px] rounded-full blur-3xl" style={{ backgroundColor: 'color-mix(in oklch, var(--cyan-glow) 40%, transparent)' }}></div>
                      <div className="relative flex h-full flex-col items-center justify-between px-8 pt-24 pb-12">
                        
                        <div className="flex items-center gap-2">
                          <ZayraLogo size={32} showText={false} />
                          <span className="font-display text-lg font-semibold tracking-tight text-foreground">Zayra</span>
                        </div>
                        
                        <div className="flex flex-col items-center text-center">
                          <div className="relative mb-8">
                            <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ backgroundColor: 'color-mix(in oklch, var(--aqua) 30%, transparent)' }}></span>
                            <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ backgroundColor: 'color-mix(in oklch, var(--aqua) 20%, transparent)', animationDelay: '0.6s' }}></span>
                            <div className="relative animate-heartbeat rounded-3xl shadow-soft">
                              <ZayraLogo size={96} showText={false} />
                            </div>
                          </div>
                          <h1 className="font-display text-[34px] leading-[1.1] font-semibold tracking-tight text-balance text-foreground">
                            Know your body<br />before it asks for help.
                          </h1>
                          <p className="mt-4 text-[15px] text-muted-foreground text-balance max-w-[280px]">
                            Governed-AI cardiac and physiological intelligence — calm, continuous, clinician-validated.
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => setPhoneState('journey')} 
                          className="group flex w-full items-center justify-between rounded-2xl bg-gradient-ink px-6 py-4 text-primary-foreground shadow-elevated transition-smooth hover:shadow-glow"
                        >
                          <span className="font-display text-base font-medium">Begin</span>
                          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

               {/* 2. JOURNEY SCREEN */}
                {phoneState === 'journey' && (
                  <div className="relative h-full w-full bg-pearl overflow-y-auto no-scrollbar" style={{ backgroundColor: 'var(--pearl)' }}>
                    <div className="px-6 pt-14 pb-8">
                      <div className="flex items-center gap-2">
                        <ZayraLogo size={32} showText={false} />
                        <span className="font-display text-lg font-semibold tracking-tight">Zayra</span>
                      </div>
                      <h2 className="mt-8 font-display text-[28px] leading-tight font-semibold tracking-tight text-balance">Choose your journey.</h2>
                      <p className="mt-2 text-sm text-muted-foreground text-balance">The app adapts its tone, navigation and intelligence to who you are.</p>
                    </div>
                    <div className="px-6 pb-10 space-y-3">
                      <button onClick={() => setPhoneState('name')} className="group relative w-full overflow-hidden rounded-3xl border border-border/60 p-5 text-left transition-smooth bg-gradient-to-br shadow-soft hover:shadow-elevated hover:-translate-y-0.5 from-cyan-glow/40 to-aqua/20" style={{ '--tw-gradient-from': 'color-mix(in oklch, var(--cyan-glow) 40%, transparent)', '--tw-gradient-to': 'color-mix(in oklch, var(--aqua) 20%, transparent)', '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)' } as React.CSSProperties}>
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-soft">
                            <Heart className="h-6 w-6 text-ink" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-display text-[17px] font-semibold tracking-tight">Zayra Wellness</h3>
                              <ArrowRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1 group-hover:opacity-100" />
                            </div>
                            <p className="mt-0.5 text-[13px] font-medium text-ink/80">Body intelligence, daily.</p>
                            <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">For Zen wristband users — elegant baseline, recovery and women's health insight.</p>
                          </div>
                        </div>
                      </button>
                      <button onClick={() => setPhoneState('name')} className="group relative w-full overflow-hidden rounded-3xl border border-border/60 p-5 text-left transition-smooth bg-gradient-to-br shadow-soft hover:shadow-elevated hover:-translate-y-0.5 from-aqua/30 to-ink/10" style={{ '--tw-gradient-from': 'color-mix(in oklch, var(--aqua) 30%, transparent)', '--tw-gradient-to': 'color-mix(in oklch, var(--ink) 10%, transparent)', '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)' } as React.CSSProperties}>
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-soft">
                            <Activity className="h-6 w-6 text-ink" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-display text-[17px] font-semibold tracking-tight">Zayra Care</h3>
                              <ArrowRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1 group-hover:opacity-100" />
                            </div>
                            <p className="mt-0.5 text-[13px] font-medium text-ink/80">Quiet cardiac vigilance.</p>
                            <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">Axiom ECG patch + Alyna AI with clinician validation — continuous heart awareness.</p>
                          </div>
                        </div>
                      </button>
                      <button onClick={() => setPhoneState('name')} className="group relative w-full overflow-hidden rounded-3xl border border-border/60 p-5 text-left transition-smooth bg-gradient-to-br shadow-soft hover:shadow-elevated hover:-translate-y-0.5 from-ink/90 to-ink/70 text-primary-foreground" style={{ '--tw-gradient-from': 'color-mix(in oklch, var(--ink) 90%, transparent)', '--tw-gradient-to': 'color-mix(in oklch, var(--ink) 70%, transparent)', '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)' } as React.CSSProperties}>
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                            <ShieldCheck className="h-6 w-6 text-cyan-glow" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-display text-[17px] font-semibold tracking-tight text-primary-foreground">Zayra Evac</h3>
                              <ArrowRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1 group-hover:opacity-100 text-primary-foreground" />
                            </div>
                            <p className="mt-0.5 text-[13px] font-medium text-cyan-glow">Help, ready and routed.</p>
                            <p className="mt-2 text-[12.5px] leading-relaxed text-white/70">Assisted escalation, hospital routing, family awareness — calm operational layer.</p>
                          </div>
                        </div>
                      </button>
                      <button onClick={() => setPhoneState('name')} className="group relative w-full overflow-hidden rounded-3xl border border-border/60 p-5 text-left transition-smooth bg-gradient-to-br shadow-soft hover:shadow-elevated hover:-translate-y-0.5 from-mist to-cyan-glow/30" style={{ '--tw-gradient-from': 'var(--mist)', '--tw-gradient-to': 'color-mix(in oklch, var(--cyan-glow) 30%, transparent)', '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)' } as React.CSSProperties}>
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-soft">
                            <Stethoscope className="h-6 w-6 text-ink" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-display text-[17px] font-semibold tracking-tight">Zayra Hospital</h3>
                              <ArrowRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1 group-hover:opacity-100" />
                            </div>
                            <p className="mt-0.5 text-[13px] font-medium text-ink/80">Continuity beyond discharge.</p>
                            <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">Monitored recovery for post-discharge patients with care team continuity.</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2.5. NAME ONBOARDING SCREEN */}
                {phoneState === 'name' && (
                  <div className="relative h-full w-full bg-pearl overflow-y-auto no-scrollbar" style={{ backgroundColor: 'var(--pearl)' }}>
                    <div className="sticky top-0 z-10 flex items-center justify-between px-6 pt-14 pb-3 backdrop-blur-md" style={{ backgroundColor: 'color-mix(in oklch, var(--pearl) 80%, transparent)' }}>
                      <div className="flex items-center gap-2">
                        <ZayraLogo size={32} showText={false} />
                        <span className="font-display text-lg font-semibold tracking-tight text-foreground">Zayra</span>
                      </div>
                      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground tabular-nums">1 / 4</span>
                    </div>
                    <div className="px-1.5">
                      <div className="h-0.5 w-full rounded-full" style={{ backgroundColor: 'var(--mist)' }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: '25%', backgroundImage: 'linear-gradient(135deg, var(--aqua) 0%, var(--cyan-glow) 100%)' }}></div>
                      </div>
                    </div>
                    <div className="px-6 pt-6 pb-32 animate-fade-in">
                      <h2 className="font-display text-[26px] font-semibold leading-tight tracking-tight text-foreground">What should we call you?</h2>
                      <p className="mt-1.5 text-sm text-muted-foreground">A first name is enough. You stay in control.</p>
                      <input
                        placeholder="Your first name"
                        value={onboardingName}
                        onChange={(e) => setOnboardingName(e.target.value)}
                        className="mt-6 w-full rounded-2xl border border-border px-5 py-4 text-base text-foreground outline-none transition-smooth focus:border-aqua shadow-soft focus:shadow-glow placeholder:text-muted-foreground"
                        style={{ backgroundColor: 'var(--card)' }}
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 border-t border-border/60 backdrop-blur-md px-6 py-4" style={{ backgroundColor: 'color-mix(in oklch, var(--pearl) 90%, transparent)' }}>
                      <button
                        disabled={!onboardingName.trim()}
                        onClick={() => setPhoneState('dashboard')}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-ink px-6 py-4 font-display text-base font-medium text-primary-foreground shadow-elevated transition-smooth hover:shadow-glow disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
                {/* 3. DASHBOARD SCREEN */}
                {phoneState === 'dashboard' && (
                  <>
                    <div className="flex items-center justify-between px-5 pt-12 pb-3 border-b border-border z-10 bg-[var(--pearl)] flex-shrink-0">
                      <ZayraLogo size={32} />
                      <div className="w-7" />
                    </div>

                    <div className="relative flex-1 w-full overflow-y-auto no-scrollbar">
                      {dashboard.loading ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3">
                          <div className="w-8 h-8 border-2 border-aqua/30 border-t-aqua rounded-full animate-spin" />
                          <p className="text-xs text-muted-foreground">Loading your health data…</p>
                        </div>
                      ) : (
                        <div className="pt-3 pb-8">
                          {renderTab()}
                        </div>
                      )}
                    </div>

                    <div className="z-10 bg-[var(--pearl)] border-t border-border flex-shrink-0">
                      <BottomNav
                        active={activeTab}
                        onNavigate={(tab) => {
                          if (tab !== 'support') setOpenTicketId(null)
                          setActiveTab(tab)
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/60 bg-card/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground md:flex-row lg:px-10">
          <ZayraLogo size={24} className="opacity-80" />
          <p>Calm vigilance. Clinician-validated. © Zayra Health.</p>
        </div>
      </footer>
    </div>
  )
}