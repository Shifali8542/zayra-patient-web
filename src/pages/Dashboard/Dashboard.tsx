import React, { useState } from 'react'
import { useDashboard } from '../../hooks/useDashboard'
import { BottomNav } from '../../components/ui/BottomNav'
import { ZayraLogo } from '../../components/ui/ZayraLogo'
import { HomeTab } from './HomeTab'
import { ECGTab } from './ECGTab'
import { AlynaTab } from './AlynaTab'
import { CircleTab } from './CircleTab'
import { RhythmTab } from './RhythmTab'
import { StoriesTab } from './StoriesTab'
import { ProfileTab } from './ProfileTab'
import { Navbar } from '../../components/layout/Navbar'
import type { User } from '../../types'

interface DashboardPageProps {
  user: User
  onLogout: () => Promise<void>
}

export function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState('home')
  const dashboard = useDashboard()

  const renderTab = () => {
    // Loading state — only block rendering if core data hasn't arrived yet
    if (dashboard.loading) return null

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
          />
        )
      case 'ecg':
        return (
          <ECGTab
            patientMe={dashboard.patientMe}
            getWaveform={dashboard.getWaveform}
            getHeartReport={dashboard.getHeartReport}
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
      case 'profile':
        return <ProfileTab user={user} onLogout={onLogout} clinicalInfo={dashboard.clinicalInfo} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #D6F3F0 0%, #C8EEE9 30%, #D8F2EF 60%, #E4F7F5 100%)' }}>

      {/* ─── Navbar ─── */}
      <Navbar onRequestAccess={() => { }} />

      {/* ─── Hero + Phone ─── */}
      <div className="flex-1 flex flex-col lg:flex-row items-start justify-between
                      gap-8 xl:gap-16 px-8 md:px-12 pt-4 pb-12 max-w-[1400px] mx-auto w-full">

        {/* LEFT: Marketing copy */}
        <div className="flex-1 max-w-2xl animate-slide-up pt-8 lg:pt-16">

          <div className="inline-flex items-center gap-2 bg-white/60 border border-white/80
                          rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-zayra-teal animate-pulse" />
            <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Adaptive Health OS · Iteration 1
            </span>
          </div>

          <div className="mb-8">
            <h1 className="font-display font-black text-[4.5rem] md:text-[5.5rem] leading-none
                           text-zayra-navy dark:text-white tracking-tight">
              Know your body
            </h1>
            <div
              className="mt-2 h-14 rounded-lg"
              style={{ width: '75%', background: 'linear-gradient(90deg, #0D1B2A 0%, #00C2B2 100%)' }}
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

          <div className="grid grid-cols-3 gap-4 mb-10 max-w-lg">
            {[
              { icon: '💗', title: 'Wellness', sub: 'Body intelligence, daily' },
              { icon: '📡', title: 'Care', sub: 'Quiet cardiac vigilance' },
              { icon: '🛡️', title: 'Evac', sub: 'Help, ready and routed' },
            ].map(item => (
              <div
                key={item.title}
                className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 p-4
                           hover:bg-white/90 transition-all cursor-pointer"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
              >
                <div className="text-xl mb-2">{item.icon}</div>
                <p className="font-semibold text-sm text-zayra-navy dark:text-white">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3">
            <ZayraLogo size={50} showText={false} />
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              <strong className="text-zayra-navy dark:text-white">Try the live experience →</strong>{' '}
              tap a tab and explore Wellness, Care, Evac or Hospital — all adapt in tone, navigation and intelligence.
            </p>
          </div>
        </div>

        {/* RIGHT: Phone frame */}
        <div className="w-full lg:w-auto flex-shrink-0 flex justify-center lg:justify-end lg:sticky lg:top-8 self-start">
          <div className="relative rounded-[2.8rem] overflow-hidden bg-white"
            style={{
              width: 460,
              minHeight: 980,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 80px rgba(0,194,178,0.18), 0 8px 32px rgba(0,0,0,0.10)',
              border: '2.5px solid rgba(255,255,255,0.95)',
            }}
          >
            {/* Notch */}
            <div className="flex justify-center pt-3 pb-0 bg-white">
              <div className="w-28 h-7 bg-gray-900 rounded-full" />
            </div>

            {/* App header */}
            <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-50">
              <ZayraLogo size={50} />
              <div className="w-7" />
            </div>

            {/* Tab content */}
            <div className="overflow-y-auto bg-white flex-1" style={{ maxHeight: 640 }}>
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
            <BottomNav active={activeTab} onNavigate={setActiveTab} />
          </div>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <footer className="flex items-center justify-between px-8 md:px-12 py-5 border-t border-white/30">
        <p className="text-xs text-gray-400">Calm vigilance. Clinician-validated. © Zayra Health.</p>
      </footer>
    </div>
  )
}