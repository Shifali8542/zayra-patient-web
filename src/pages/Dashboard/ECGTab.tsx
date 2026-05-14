// =============================================================================
// src/pages/Dashboard/ECGTab.tsx
// NEW: Full ECG tab with 3 sub-screens: Records | Waveform | Heart Report.
// Mirrors the mobile ECGScreen exactly. Real data from backend via S3.
// =============================================================================

import React, { useState, useEffect } from 'react'
import type { PatientMe, WaveformData, HeartReport } from '../../types'

type SubScreen = 'records' | 'waveform' | 'report'

interface ECGTabProps {
  patientMe: PatientMe | null
  getWaveform: (recordId: number) => Promise<WaveformData | null>
  getHeartReport: (recordId: number) => Promise<HeartReport | null>
}

function fmt(val: number | null | undefined): string {
  if (val == null) return '—'
  return String(Math.round(val))
}

function getSTColors(status: string | null): { bg: string; text: string } {
  if (!status) return { bg: 'rgba(107,114,128,0.12)', text: '#6B7280' }
  if (status.includes('STEMI')) return { bg: 'rgba(239,68,68,0.12)', text: '#EF4444' }
  if (status === 'Abnormal') return { bg: 'rgba(245,158,11,0.12)', text: '#D97706' }
  if (status === 'At Risk') return { bg: 'rgba(245,158,11,0.10)', text: '#D97706' }
  return { bg: 'rgba(16,185,129,0.12)', text: '#059669' }
}

// ─── Waveform SVG renderer ────────────────────────────────────────────────────

function WaveformSVG({ samples, height = 90 }: { samples: number[] | null; height?: number }) {
  const width = 300

  if (!samples || samples.length < 2) {
    // Fallback ECG-like path
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
        <path
          d="M0,45 L20,45 L25,45 L30,15 L35,75 L40,5 L45,85 L50,45 L70,45 L90,45 L95,15 L100,75 L105,5 L110,85 L115,45 L140,45 L145,15 L150,75 L155,5 L160,85 L165,45 L190,45 L195,15 L200,75 L205,5 L210,85 L215,45 L240,45 L245,15 L250,75 L255,5 L260,85 L265,45 L300,45"
          fill="none" stroke="#00C2B2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    )
  }

  const step = Math.max(1, Math.floor(samples.length / 600))
  const pts = samples.filter((_, i) => i % step === 0)
  const min = Math.min(...pts)
  const max = Math.max(...pts)
  const range = max - min || 1
  const mid = height / 2
  const points = pts
    .map((v, i) => {
      const x = (i / (pts.length - 1)) * width
      const y = mid - ((v - min) / range) * (height - 12) + 6
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <polyline points={points} fill="none" stroke="#00C2B2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── ECG Paper Grid ───────────────────────────────────────────────────────────

function ECGPaperGrid({ height }: { height: number }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height }}
    >
      <defs>
        <pattern id="small-grid" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#FFCCCC" strokeWidth="0.5" />
        </pattern>
        <pattern id="large-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="url(#small-grid)" />
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FF9999" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#large-grid)" />
    </svg>
  )
}

// ─── Sub-screen: Records ─────────────────────────────────────────────────────

function RecordsSubScreen({
  patientMe,
  onSelectRecord,
}: {
  patientMe: PatientMe | null
  onSelectRecord: (id: number, to: SubScreen) => void
}) {
  if (!patientMe || patientMe.ecg_records.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center px-4">
        <span className="text-3xl">📋</span>
        <p className="text-xs text-gray-400">No ECG records found for your profile.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 px-4 pb-4">
      {patientMe.ecg_records.map((record, i) => (
        <div key={record.id} className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display font-bold text-lg text-zayra-navy dark:text-white">ECG {i + 1}</span>
            <span className="text-xs font-semibold bg-zayra-teal/10 text-zayra-teal px-2 py-0.5 rounded-full">
              {patientMe.dataset_source?.replace(/_/g, ' ').toUpperCase() ?? 'ECG'}
            </span>
          </div>

          <div className="flex gap-4 mb-3">
            <div>
              <p className="text-sm font-semibold text-zayra-navy dark:text-white">
                {record.duration_seconds != null ? `${Math.round(record.duration_seconds)}s` : '—'}
              </p>
              <p className="text-xs text-gray-400">Duration</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-zayra-navy dark:text-white">{record.num_channels ?? '—'}</p>
              <p className="text-xs text-gray-400">Leads</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-zayra-navy dark:text-white">
                {record.sampling_rate != null ? `${record.sampling_rate} Hz` : '—'}
              </p>
              <p className="text-xs text-gray-400">Sample Rate</p>
            </div>
          </div>

          {patientMe.diagnoses[0] && (
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{patientMe.diagnoses[0]}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => onSelectRecord(record.id, 'waveform')}
              className="text-xs font-semibold text-zayra-teal hover:text-zayra-accent transition-colors"
            >
              Waveform →
            </button>
            <button
              onClick={() => onSelectRecord(record.id, 'report')}
              className="text-xs font-semibold text-gray-400 hover:text-zayra-navy transition-colors"
            >
              Heart Report →
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Sub-screen: Waveform ─────────────────────────────────────────────────────

function WaveformSubScreen({
  patientMe,
  selectedRecordId,
  onSelectRecord,
  getWaveform,
}: {
  patientMe: PatientMe | null
  selectedRecordId: number | null
  onSelectRecord: (id: number) => void
  getWaveform: (id: number) => Promise<WaveformData | null>
}) {
  const [waveform, setWaveform] = useState<WaveformData | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeLead, setActiveLead] = useState<string>('II')
  const [activeSegment, setActiveSegment] = useState<'before' | 'anomaly' | 'after'>('anomaly')

  useEffect(() => {
    if (!selectedRecordId) return
    setLoading(true)
    getWaveform(selectedRecordId).then(data => {
      setWaveform(data)
      if (data?.all_channel_names?.length) {
        const preferred = data.all_channel_names.find(n => n.toUpperCase() === 'II')
        setActiveLead(preferred ?? data.all_channel_names[0])
      }
      setActiveSegment('anomaly')
      setLoading(false)
    })
  }, [selectedRecordId])

  const chartSamples: number[] | null = (() => {
    if (!waveform) return null
    const seg = waveform.segments?.[activeSegment]
    if (seg?.samples?.length) return seg.samples
    return waveform.waveforms?.[activeLead] ?? null
  })()

  const records = patientMe?.ecg_records ?? []

  return (
    <div className="pb-4">
      {/* Record selector tabs */}
      {records.length > 1 && (
        <div className="flex gap-2 px-4 mb-3 overflow-x-auto pb-1">
          {records.map((r, i) => {
            const isActive = r.id === selectedRecordId
            return (
              <button
                key={r.id}
                onClick={() => onSelectRecord(r.id)}
                className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                  isActive
                    ? 'bg-zayra-teal text-white border-zayra-teal'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-zayra-teal hover:text-zayra-teal'
                }`}
              >
                ECG {i + 1}
              </button>
            )
          })}
        </div>
      )}

      {/* Waveform card */}
      <div className="card mx-4 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-zayra-navy dark:text-white">
            {waveform ? `Lead ${activeLead} — ${waveform.record_name}` : 'ECG Waveform'}
          </p>
          {waveform && (
            <span className="text-xs font-semibold bg-zayra-teal/10 text-zayra-teal px-2 py-0.5 rounded-full">
              {waveform.sampling_rate} Hz
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-24 gap-2">
            <div className="w-6 h-6 border-2 border-zayra-teal/30 border-t-zayra-teal rounded-full animate-spin" />
            <p className="text-xs text-gray-400">Loading ECG from S3…</p>
          </div>
        ) : (
          <>
            {/* Before / During / After tabs */}
            <div className="flex gap-1.5 mb-3">
              {(['before', 'anomaly', 'after'] as const).map(seg => {
                const LABELS = { before: 'Before', anomaly: 'During', after: 'After' }
                const isActive = activeSegment === seg
                const hasData = (waveform?.segments?.[seg]?.samples?.length ?? 0) > 0
                return (
                  <button
                    key={seg}
                    onClick={() => { if (hasData) setActiveSegment(seg) }}
                    disabled={!hasData}
                    className={`flex-1 text-xs font-medium py-1 rounded-full border transition-all ${
                      isActive
                        ? 'bg-zayra-teal text-white border-zayra-teal'
                        : hasData
                        ? 'bg-gray-50 text-gray-500 border-gray-200 hover:border-zayra-teal'
                        : 'bg-gray-50 text-gray-300 border-gray-100 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {LABELS[seg]}
                  </button>
                )
              })}
            </div>

            {/* ECG chart with paper grid */}
            <div className="relative rounded-xl overflow-hidden mb-2" style={{ backgroundColor: '#FFF5F5', height: 100 }}>
              <ECGPaperGrid height={100} />
              <div className="relative z-10">
                <WaveformSVG samples={chartSamples} height={100} />
              </div>
            </div>

            {/* Segment time range */}
            {waveform?.segments?.[activeSegment] && (
              <p className="text-xs text-gray-400 mb-2">
                {waveform.segments[activeSegment].start_sec}s – {waveform.segments[activeSegment].end_sec}s
              </p>
            )}
          </>
        )}

        {waveform && (
          <>
            <p className="text-xs text-gray-400 mb-2">
              {waveform.duration_seconds != null ? `${Math.round(waveform.duration_seconds)}s` : '—'}
              {' · '}{waveform.all_channel_names?.length ?? waveform.channel_names.length} leads
              {' · '}{waveform.effective_sampling_rate} Hz
              {waveform.filtered ? '  ✓ Filtered' : ''}
            </p>

            {/* Lead switcher */}
            {(waveform.all_channel_names?.length ?? 0) > 1 && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1.5">Leads</p>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {waveform.all_channel_names.map(lead => {
                    const isActive = lead === activeLead
                    return (
                      <button
                        key={lead}
                        onClick={() => setActiveLead(lead)}
                        className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border transition-all ${
                          isActive
                            ? 'bg-zayra-teal text-white border-zayra-teal'
                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-zayra-teal'
                        }`}
                      >
                        {lead}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Patient info */}
      {waveform && (
        <div className="card mx-4 mt-3 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Patient</p>
          <p className="text-sm font-medium text-zayra-navy dark:text-white">
            {waveform.patient_code}
            {waveform.age != null ? ` · ${waveform.age}y` : ''}
            {waveform.sex ? ` · ${waveform.sex}` : ''}
          </p>
          {waveform.diagnosis && (
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{waveform.diagnosis}</p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Sub-screen: Heart Report ─────────────────────────────────────────────────

function HeartReportSubScreen({
  patientMe,
  selectedRecordId,
  onSelectRecord,
  getHeartReport,
}: {
  patientMe: PatientMe | null
  selectedRecordId: number | null
  onSelectRecord: (id: number) => void
  getHeartReport: (id: number) => Promise<HeartReport | null>
}) {
  const [report, setReport] = useState<HeartReport | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedRecordId) return
    setLoading(true)
    getHeartReport(selectedRecordId).then(data => {
      setReport(data)
      setLoading(false)
    })
  }, [selectedRecordId])

  const records = patientMe?.ecg_records ?? []
  const ecg = report?.ecg_metrics
  const ai = report?.ai_analysis
  const st = report?.st_result
  const stColors = getSTColors(st?.overall_status ?? null)

  return (
    <div className="pb-4">
      {/* Record selector */}
      {records.length > 1 && (
        <div className="flex gap-2 px-4 mb-3 overflow-x-auto pb-1">
          {records.map((r, i) => {
            const isActive = r.id === selectedRecordId
            return (
              <button
                key={r.id}
                onClick={() => onSelectRecord(r.id)}
                className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                  isActive
                    ? 'bg-zayra-teal text-white border-zayra-teal'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-zayra-teal'
                }`}
              >
                ECG {i + 1}
              </button>
            )
          })}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center h-40 gap-3">
          <div className="w-7 h-7 border-2 border-zayra-teal/30 border-t-zayra-teal rounded-full animate-spin" />
          <p className="text-xs text-gray-400">Loading heart report…</p>
        </div>
      ) : !report ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center px-4">
          <span className="text-3xl">🫀</span>
          <p className="text-xs text-gray-400">Heart report not yet available for this record.</p>
        </div>
      ) : (
        <div className="space-y-3 px-4">
          {/* Header */}
          <div>
            <p className="text-xs text-gray-400">{report.dataset_source_display} · {report.record_label}</p>
            <h3 className="font-display font-bold text-xl text-zayra-navy dark:text-white">Heart Report</h3>
          </div>

          {/* ECG Metrics */}
          {report.metrics_available && ecg && (
            <div className="card p-4">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">ECG Metrics</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Heart Rate', value: fmt(ecg.heart_rate_bpm), hint: '60–100 bpm' },
                  { label: 'HRV', value: fmt(ecg.hrv_ms), hint: 'higher = better' },
                  { label: 'QRS Width', value: fmt(ecg.qrs_width_ms), hint: '70–110 ms' },
                  { label: 'QT Interval', value: fmt(ecg.qt_ms), hint: '350–440 ms' },
                ].map(m => (
                  <div key={m.label} className="bg-gray-50 dark:bg-zayra-navy/40 rounded-xl p-3">
                    <p className="font-display font-bold text-xl text-zayra-navy dark:text-white">{m.value}</p>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">{m.label}</p>
                    <p className="text-xs text-gray-400">{m.hint}</p>
                  </div>
                ))}
              </div>
              {/* Rhythm — full width */}
              <div className="flex items-center justify-between bg-gray-50 dark:bg-zayra-navy/40 rounded-xl p-3 mt-2">
                <p className="text-xs font-semibold text-gray-500">Rhythm</p>
                <p className="text-sm font-medium text-zayra-navy dark:text-white">{ecg.rhythm ?? '—'}</p>
              </div>
            </div>
          )}

          {/* Diagnoses */}
          {report.diagnoses.length > 0 && (
            <div className="card p-4">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Diagnosis</p>
              <div className="space-y-1.5">
                {report.diagnoses.map((d, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zayra-teal mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-zayra-navy dark:text-white leading-snug">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ST Elevation */}
          {report.st_available && st && (
            <div className="card p-4">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">ST Analysis</p>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Status</p>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: stColors.bg, color: stColors.text }}>
                  {st.overall_status}
                </span>
              </div>
              {st.overall_status_note && (
                <p className="text-xs text-gray-500 leading-relaxed mb-1">{st.overall_status_note}</p>
              )}
              <p className="text-xs text-gray-400">Last checked: {st.last_checked}</p>
            </div>
          )}

          {/* AI Analysis */}
          {report.ai_available && ai && (
            <div className="card p-4">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">AI Analysis</p>
              {ai.narrative && (
                <p className="text-sm text-zayra-navy dark:text-white leading-relaxed mb-3">{ai.narrative}</p>
              )}
              {ai.findings.length > 0 && (
                <div className="space-y-1.5 mb-3">
                  {ai.findings.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-zayra-teal mt-1.5 flex-shrink-0" />
                      <p className="text-xs text-gray-500 leading-snug">{f}</p>
                    </div>
                  ))}
                </div>
              )}
              {ai.recommendation && (
                <div className="bg-zayra-teal/10 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Recommendation</p>
                  <p className="text-sm text-zayra-navy dark:text-white leading-relaxed">{ai.recommendation}</p>
                </div>
              )}
            </div>
          )}

          {!report.ai_available && (
            <div className="flex flex-col items-center gap-2 py-6 text-center card">
              <span className="text-2xl">🤖</span>
              <p className="text-xs text-gray-400">AI analysis not yet run for this record. Contact your care team.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main ECGTab ──────────────────────────────────────────────────────────────

export function ECGTab({ patientMe, getWaveform, getHeartReport }: ECGTabProps) {
  const [subScreen, setSubScreen] = useState<SubScreen>('records')
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(
    patientMe?.ecg_records[0]?.id ?? null,
  )

  const handleSelectRecord = (id: number, to: SubScreen = 'waveform') => {
    setSelectedRecordId(id)
    setSubScreen(to)
  }

  const SUB_TABS: { key: SubScreen; label: string }[] = [
    { key: 'records', label: 'Records' },
    { key: 'waveform', label: 'Waveform' },
    { key: 'report', label: 'Heart Report' },
  ]

  return (
    <div>
      {/* Sub-nav */}
      <div className="flex mx-4 mb-3 bg-gray-50 rounded-2xl p-1 gap-0.5">
        {SUB_TABS.map(tab => {
          const isActive = subScreen === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setSubScreen(tab.key)}
              className={`flex-1 text-xs font-medium py-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-white text-zayra-navy shadow-sm'
                  : 'text-gray-400 hover:text-zayra-navy'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Sub-screens */}
      {subScreen === 'records' && (
        <RecordsSubScreen patientMe={patientMe} onSelectRecord={handleSelectRecord} />
      )}
      {subScreen === 'waveform' && (
        <WaveformSubScreen
          patientMe={patientMe}
          selectedRecordId={selectedRecordId}
          onSelectRecord={id => handleSelectRecord(id, 'waveform')}
          getWaveform={getWaveform}
        />
      )}
      {subScreen === 'report' && (
        <HeartReportSubScreen
          patientMe={patientMe}
          selectedRecordId={selectedRecordId}
          onSelectRecord={id => handleSelectRecord(id, 'report')}
          getHeartReport={getHeartReport}
        />
      )}
    </div>
  )
}