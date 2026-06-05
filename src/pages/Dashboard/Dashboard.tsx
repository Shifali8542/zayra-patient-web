import React, { useState } from 'react'
import { Diamond, Link2, Sparkles } from 'lucide-react'
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
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#EEF8F7]">
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[640px] w-[640px] rounded-full bg-[#7FE8E0]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-[560px] w-[560px] rounded-full bg-[#36D2CF]/30 blur-3xl" />

      {/* ─── Navbar ─── */}
      <Navbar onRequestAccess={() => { }} />

      {/* ─── Hero + Phone ─── */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-start justify-between
                      gap-8 xl:gap-16 px-6 lg:px-10 pt-4 pb-24 max-w-7xl mx-auto w-full">

        {/* LEFT: Marketing copy */}
        <div className="flex-1 max-w-[526px] animate-slide-up pt-8 lg:pt-16">

          <div className="inline-flex items-center gap-2 bg-white/60 border border-white/80
                          rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-zayra-teal animate-pulse" />
            <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Adaptive Health OS · Iteration 1
            </span>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-[44px] font-semibold leading-[1.05] tracking-tight text-balance text-zayra-navy dark:text-white md:text-[58px]">
              Know your body
            </h1>
            <div
              className="mt-6 h-[74px] rounded-lg"
              style={{ width: '100%', background: 'linear-gradient(90deg, #0D1B2A 0%, #00C2B2 100%)' }}
            />
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-10 max-w-lg">
            Zayra is a governed-AI cardiac and physiological intelligence platform —{' '}
            <strong className="font-semibold text-zayra-navy dark:text-white">Zen</strong> wristband,{' '}
            <strong className="font-semibold text-zayra-navy dark:text-white">Axiom</strong> ECG patch,{' '}
            <strong className="font-semibold text-zayra-navy dark:text-white">Alyna</strong> AI engine,
            clinician validation, and{' '}
            <strong className="font-semibold text-zayra-navy dark:text-white">Evac</strong> assisted
            response — adapting to who you are and what you need.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-10 max-w-[526px] w-full">
            {[
              { Icon: Link2, title: 'Wellness', sub: 'Body intelligence, daily' },
              { Icon: Sparkles, title: 'Care', sub: 'Quiet cardiac vigilance' },
              { Icon: Diamond, title: 'Evac', sub: 'Help, ready and routed' },
            ].map(item => (
              <div
                key={item.title}
                // Removed fixed min-height, changed to vertical flex with smaller padding to create the horizontal aspect ratio
                className="flex flex-col justify-between rounded-2xl border border-white/80 bg-white/70 p-4 backdrop-blur-sm
                 hover:bg-white/90 transition-all cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
              >
                {/* Reduced bottom margin on the icon so it doesn't push the card into a tall square layout */}
                <item.Icon size={15} strokeWidth={2.4} className="mb-4 text-zayra-teal" />

                <div>
                  <p className="text-[14px] font-semibold text-zayra-navy dark:text-white leading-tight">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[12px] leading-tight text-gray-400">
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-1">
            <ZayraLogo size={50} showText={false} />
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              <strong className="text-zayra-navy dark:text-white">Try the live experience →</strong>{' '}
              tap Begin, choose a journey, and explore Wellness, Care, Evac or Hospital — all adapt in tone, navigation and intelligence.
            </p>
          </div>
        </div>

        {/* RIGHT: Phone frame */}
        <div className="w-full lg:w-auto flex-shrink-0 flex justify-center lg:justify-end lg:sticky lg:top-8 self-start">
          <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-b from-white to-[#F2FAFA] p-[10px]"
            style={{
              width: 400,
              height: 860,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 80px rgba(0,194,178,0.18), 0 8px 32px rgba(0,0,0,0.10)',
            }}
          >
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2.35rem] bg-white">
            {/* Notch */}
            <div className="flex justify-center pt-3 pb-0 bg-white">
              <div className="w-24 h-6 bg-gray-900 rounded-full" />
            </div>

            {/* App header */}
            <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-50">
              <ZayraLogo size={50} />
              <div className="w-7" />
            </div>

            {/* Tab content */}
            <div className="overflow-y-auto bg-white flex-1">
              {dashboard.loading ? (
                <div className="flex flex-col items-center justify-center h-40 gap-3">
                  <div className="w-8 h-8 border-2 border-zayra-teal/30 border-t-zayra-teal rounded-full animate-spin" />
                  <p className="text-xs text-gray-400">Loading your health data…</p>
                </div>
              ) : (
                <div className="pt-3">{renderTab()}</div>
              )}
            </div>

            {/* Bottom nav */}
            <BottomNav
              active={activeTab}
              onNavigate={(tab) => {
                if (tab !== 'support') setOpenTicketId(null)
                setActiveTab(tab)
              }}
            />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 border-t border-white/60 bg-white/40 px-6 py-5 mb-10 backdrop-blur-md lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <ZayraLogo size={28} />
          <p className="text-xs text-gray-400">Calm vigilance. Clinician-validated. © Zayra Health.</p>
        </div>
      </footer>
    </div>
  )
}