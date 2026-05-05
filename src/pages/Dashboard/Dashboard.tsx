import React, { useState } from 'react'
import { useDashboard } from '../../hooks/useDashboard'
import { PhoneFrame } from '../../components/ui/PhoneFrame'
import { BottomNav } from '../../components/ui/BottomNav'
import { ZayraLogo } from '../../components/ui/ZayraLogo'
import { HomeTab } from './HomeTab'
import { AlynaTab } from './AlynaTab'
import { CircleTab } from './CircleTab'
import { RhythmTab } from './RhythmTab'
import { StoriesTab } from './StoriesTab'
import { ProfileTab } from './ProfileTab'
import { Navbar } from '../../components/layout/Navbar'
import type { User } from '../../types'

interface DashboardPageProps {
  user: User
  onLogout: () => void
}

export function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState('home')
  const { metrics, timeline, circle, journeys, stories, rhythm, alynaChat } = useDashboard()

  const renderTab = () => {
    if (!metrics.data) return null
    switch (activeTab) {
      case 'home':   return <HomeTab user={user} metrics={metrics.data} timeline={timeline.data ?? []} />
      case 'alyna':  return <AlynaTab initialChat={alynaChat.data ?? []} />
      case 'circle': return <CircleTab members={circle.data ?? []} journeys={journeys.data ?? []} />
      case 'rhythm': return rhythm.data ? <RhythmTab streak={rhythm.data} /> : null
      case 'stories':  return <StoriesTab stories={stories.data ?? []} />
      case 'profile':  return <ProfileTab user={user} onLogout={onLogout} />
      default:       return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col"
         style={{ background: 'linear-gradient(160deg, #D6F3F0 0%, #C8EEE9 30%, #D8F2EF 60%, #E4F7F5 100%)' }}>

      {/* ─── Navbar ─── */}
      <Navbar onRequestAccess={() => {}} />

      {/* ─── Hero + Phone ─── */}
      <div className="flex-1 flex flex-col lg:flex-row items-start justify-between
                      gap-8 xl:gap-16 px-8 md:px-12 pt-4 pb-12 max-w-[1400px] mx-auto w-full">

        {/* LEFT: Marketing copy */}
        <div className="flex-1 max-w-2xl animate-slide-up pt-8 lg:pt-16">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/60 border border-white/80
                          rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-zayra-teal animate-pulse" />
            <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Adaptive Health OS · Iteration 1
            </span>
          </div>

          {/* ✅ FIXED: Very large headline + correct gradient bar like Image 1 */}
          <div className="mb-8">
            <h1 className="font-display font-black text-[4.5rem] md:text-[5.5rem] leading-none
                           text-zayra-navy dark:text-white tracking-tight">
              Know your body
            </h1>
            {/* ✅ FIXED: Bar is dark-navy → teal gradient, wide, correct height */}
            <div
              className="mt-2 h-14 rounded-lg"
              style={{
                width: '75%',
                background: 'linear-gradient(90deg, #0D1B2A 0%, #00C2B2 100%)',
              }}
            />
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-10 max-w-lg">
            Zayra is a governed-AI cardiac and physiological intelligence platform —{' '}
            <strong className="font-semibold text-zayra-navy dark:text-white">Zen</strong> wristband,{' '}
            <strong className="font-semibold text-zayra-navy dark:text-white">Axiom</strong> ECG patch,{' '}
            <strong className="font-semibold text-zayra-navy dark:text-white">Alyna</strong> AI engine,
            clinician validation, and{' '}
            <strong className="font-semibold text-zayra-navy dark:text-white">Evac</strong> assisted
            response — adapting to who you are and what you need.
          </p>

          {/* ✅ FIXED: Feature cards — white, rounded, subtle border */}
          <div className="grid grid-cols-3 gap-4 mb-10 max-w-lg">
            {[
              { icon: '💗', title: 'Wellness', sub: 'Body intelligence, daily' },
              { icon: '📡', title: 'Care',     sub: 'Quiet cardiac vigilance' },
              { icon: '🛡️', title: 'Evac',    sub: 'Help, ready and routed' },
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

          {/* Try the experience hint */}
          <div className="flex items-start gap-3">
            <ZayraLogo size={26} showText={false} />
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              <strong className="text-zayra-navy dark:text-white">Try the live experience →</strong>{' '}
              tap <em>Begin</em>, choose a journey, and explore Wellness, Care, Evac or Hospital —
              all adapt in tone, navigation and intelligence.
            </p>
          </div>
        </div>

        {/* RIGHT: Phone frame */}
        <div className="w-full lg:w-auto flex-shrink-0 flex justify-center lg:justify-end
                        lg:pt-4 xl:pt-0">
          {/* ✅ FIXED: Phone frame — pure white, light mint interior, correct size */}
          <div
            className="relative rounded-[2.8rem] overflow-hidden bg-white"
            style={{
              width: 340,
              boxShadow: '0 24px 80px rgba(0,194,178,0.18), 0 8px 32px rgba(0,0,0,0.10)',
              border: '2.5px solid rgba(255,255,255,0.95)',
            }}
          >
            {/* Notch */}
            <div className="flex justify-center pt-3 pb-0 bg-white">
              <div className="w-28 h-7 bg-gray-900 rounded-full" />
            </div>

            {/* App header row */}
            <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-50">
              <ZayraLogo size={30} />
              <div className="w-7" />
            </div>

            {/* Scrollable tab content with white background */}
            <div className="overflow-y-auto bg-white" style={{ maxHeight: 540 }}>
              {metrics.isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="w-8 h-8 border-2 border-zayra-teal/30 border-t-zayra-teal rounded-full animate-spin" />
                </div>
              ) : (
                <div className="pt-3">{renderTab()}</div>
              )}
            </div>

            {/* Bottom nav */}
            <BottomNav active={activeTab} onNavigate={setActiveTab} homeCount={2} />
          </div>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <footer className="flex items-center justify-between px-8 md:px-12 py-5 border-t border-white/30">
        <ZayraLogo size={28} />
        <p className="text-xs text-gray-400">
          Calm vigilance. Clinician-validated. © Zayra Health.
        </p>
      </footer>
    </div>
  )
}
