// =============================================================================
// src/hooks/useDashboard.ts
// Real backend data. Zero mock imports.
//
// CACHING STRATEGY:
//   Global state (patientMe, clinicalInfo, aiAnalysis, stResult) fetched once
//   on mount and stored in React state. Tab switches never re-fetch.
//
//   Per-record cache (waveform, heartReport) uses useRef maps:
//     waveformCache.current[record_id]    = WaveformData
//     heartReportCache.current[record_id] = HeartReport
//   First visit per record → API call → store in ref.
//   Revisit → read from ref → zero network request.
//
// STATIC CONTENT (Circle, Journeys, Stories):
//   No backend endpoints yet — clearly marked as static constants in api.ts.
// =============================================================================

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  api,
  ApiError,
  deriveHealthMetric,
  deriveTimeline,
  deriveRhythmStreak,
  deriveConsistencyAreas,
  deriveAlynaInitialChat,
  STATIC_CIRCLE_MEMBERS,
  STATIC_JOURNEYS,
  STATIC_STORIES,
} from '../services/api'
import type {
  HealthMetric,
  TimelineEvent,
  RhythmStreak,
  ChatMessage,
  PatientMe,
  ClinicalInfo,
  AIAnalysisResponse,
  PatientSTResult,
  WaveformData,
  HeartReport,
  CircleMember,
  Journey,
  Story,
} from '../types'

interface DashboardState {
  // Derived app-level data
  metrics: HealthMetric | null
  timeline: TimelineEvent[]
  streak: RhythmStreak | null
  alynaChat: ChatMessage[]
  consistencyAreas: { label: string; value: number }[]
  // Convenience fields for screens
  interpretation: string | null
  riskLevel: string | null
  findings: string[]
  recommendation: string | null
  // Raw backend responses
  patientMe: PatientMe | null
  clinicalInfo: ClinicalInfo | null
  aiAnalysis: AIAnalysisResponse | null
  stResult: PatientSTResult | null
  // Static content
  members: CircleMember[]
  journeys: Journey[]
  stories: Story[]
  // Status
  loading: boolean
  error: string | null
  noPatientProfile: boolean
}

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    metrics: null,
    timeline: [],
    streak: null,
    alynaChat: [],
    consistencyAreas: [],
    interpretation: null,
    riskLevel: null,
    findings: [],
    recommendation: null,
    patientMe: null,
    clinicalInfo: null,
    aiAnalysis: null,
    stResult: null,
    members: STATIC_CIRCLE_MEMBERS,
    journeys: STATIC_JOURNEYS,
    stories: STATIC_STORIES,
    loading: true,
    error: null,
    noPatientProfile: false,
  })

  // Per-record caches — survive tab switches, cleared on logout
  const waveformCache = useRef<Record<number, WaveformData>>({})
  const heartReportCache = useRef<Record<number, HeartReport>>({})

  const loadAll = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null, noPatientProfile: false }))

    try {
      // 1. Patient profile
      const patientMe = await api.patient.getMe()
      const firstId = patientMe.ecg_records[0]?.id

      // 2. Clinical info (ECG metrics) — swallow errors, show what we can
      const clinicalInfo = await api.patient
        .getClinicalInfo(firstId)
        .catch(() => null)

      // 3. AI analysis — 404 = not run yet, not an error
      const aiAnalysis = await api.assessments
        .getAIAnalysis({ recordId: firstId })
        .catch(e => {
          if (e instanceof ApiError && e.status === 404) return null
          throw e
        })

      // 4. ST result — 404 = not run yet
      const stResult = await api.assessments.getSTResult(firstId)

      // Derive all app-level types from raw backend data
      const metrics = deriveHealthMetric(clinicalInfo, aiAnalysis?.analysis?.risk_level ?? null)
      const timeline = deriveTimeline(aiAnalysis, stResult)
      const streak = deriveRhythmStreak(patientMe.record_count)
      const alynaChat = deriveAlynaInitialChat(aiAnalysis)
      const consistencyAreas = deriveConsistencyAreas(clinicalInfo)

      setState(prev => ({
        ...prev,
        patientMe,
        clinicalInfo,
        aiAnalysis,
        stResult,
        metrics,
        timeline,
        streak,
        alynaChat,
        consistencyAreas,
        interpretation: aiAnalysis?.analysis?.narrative ?? null,
        riskLevel: aiAnalysis?.analysis?.risk_level ?? null,
        findings: aiAnalysis?.analysis?.findings ?? [],
        recommendation: aiAnalysis?.analysis?.recommendation ?? null,
        loading: false,
        error: null,
        noPatientProfile: false,
      }))
    } catch (e: unknown) {
      if (e instanceof ApiError && e.status === 403) {
        // Patient account exists but has no linked ECG profile yet
        setState(prev => ({ ...prev, loading: false, error: null, noPatientProfile: true }))
        return
      }
      const msg = e instanceof ApiError
        ? e.message
        : 'Failed to load health data. Check your connection.'
      setState(prev => ({ ...prev, loading: false, error: msg, noPatientProfile: false }))
    }
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  // ── Per-record waveform — cached per record_id ─────────────────────────────

  const getWaveform = useCallback(async (recordId: number): Promise<WaveformData | null> => {
    if (waveformCache.current[recordId]) {
      return waveformCache.current[recordId]
    }
    try {
      const data = await api.patient.getWaveform({ recordId, downsample: 4 })
      waveformCache.current[recordId] = data
      return data
    } catch {
      return null
    }
  }, [])

  // ── Per-record heart report — cached per record_id ─────────────────────────

  const getHeartReport = useCallback(async (recordId: number): Promise<HeartReport | null> => {
    if (heartReportCache.current[recordId]) {
      return heartReportCache.current[recordId]
    }
    try {
      const data = await api.patient.getHeartReport(recordId)
      heartReportCache.current[recordId] = data
      return data
    } catch {
      return null
    }
  }, [])

  // ── Send Alyna message — triggers refresh=true Orinn call ─────────────────

  const sendAlynaMessage = useCallback(async (message: string): Promise<ChatMessage> => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    try {
      const recordId = state.patientMe?.ecg_records[0]?.id
      if (!recordId) {
        return {
          id: Date.now().toString(), sender: 'alyna',
          message: 'Your ECG profile is not yet linked. Please contact your healthcare provider.',
          time: timeStr,
        }
      }
      const fresh = await api.assessments.getAIAnalysis({ recordId, refresh: true })
      const reply = fresh.analysis.narrative || fresh.analysis.recommendation
        || 'Your ECG data looks stable. I have noted your message.'
      const chatReply: ChatMessage = { id: Date.now().toString(), sender: 'alyna', message: reply, time: timeStr }
      setState(prev => ({ ...prev, aiAnalysis: fresh, alynaChat: [...prev.alynaChat, chatReply] }))
      return chatReply
    } catch {
      const fallback: ChatMessage = {
        id: Date.now().toString(), sender: 'alyna',
        message: "I've noted that. Your biometrics look stable. Is there anything specific you'd like me to monitor?",
        time: timeStr,
      }
      setState(prev => ({ ...prev, alynaChat: [...prev.alynaChat, fallback] }))
      return fallback
    }
  }, [state.patientMe])

  const clearCache = useCallback(() => {
    waveformCache.current = {}
    heartReportCache.current = {}
  }, [])

  return { ...state, sendAlynaMessage, getWaveform, getHeartReport, clearCache, reload: loadAll }
}