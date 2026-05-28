// =============================================================================
// src/types/index.ts
// All TypeScript interfaces. Schema keys match backend response keys exactly.
// App-only derived types are clearly marked.
// =============================================================================

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthTokens {
  access: string
  refresh: string
}

/** Raw shape returned by /api/v1/auth/login/ and /register/user/ */
export interface BackendUser {
  id: number
  email: string
  first_name: string
  last_name: string
  phone: string | null
  role: 'admin' | 'doctor' | 'nurse' | 'patient'
  created_at: string
  specialization: string | null
  license_number: string | null
  hospital_name: string | null
  years_of_experience: number | null
  qualification: string | null
  is_doctor: boolean
  is_patient: boolean
}

export interface LoginResponse {
  message: string
  user: BackendUser
  access: string
  refresh: string
}

export interface RegisterResponse {
  message: string
  user: BackendUser
  access: string
  refresh: string
}

// ─── Patient ──────────────────────────────────────────────────────────────────

export interface ECGRecord {
  id: number
  record_name: string
  record_index: number
  sampling_rate: number | null
  num_channels: number | null
  channel_names: string[]
  num_samples: number | null
  duration_seconds: number | null
  split: 'train' | 'validation' | 'test' | null
}

/** GET /api/v1/patients/me/ */
export interface PatientMe {
  id: number
  patient_code: string
  age: number | null
  sex: string | null
  diagnosis: string | null
  extra_info: Record<string, unknown>
  ecg_records: ECGRecord[]
  record_count: number
  diagnoses: string[]
  dataset_source: string | null
  dataset_source_display: string | null
}

/** ECG analysis shape inside clinical-info and cached_metrics */
export interface ECGAnalysis {
  heart_rate_bpm: number | null
  heart_rate_min: number | null
  heart_rate_max: number | null
  hrv_ms: number | null
  num_beats: number
  rhythm: string
  quality_score: number | null
  qrs_width_ms: number | null
  qt_ms: number | null
  qtc_ms: number | null
  source?: 'cache' | 'live' | 'error'
  error?: string
}

/** GET /api/v1/patients/me/clinical-info/ */
export interface ClinicalInfo {
  patient_code: string
  record_name: string
  demographics: {
    age: number | null
    sex: string | null
    diagnosis: string | null
  }
  clinical_summary: Record<string, unknown>
  ecg_analysis: ECGAnalysis
  record_info: {
    sampling_rate: number | null
    num_channels: number | null
    duration_seconds: number | null
    channel_names: string[]
  }
  diagnoses: string[]
}

// AI / Assessments 
export interface AIAnalysisResult {
  id: number
  risk_level: 'Low' | 'Moderate' | 'High' | 'Critical' | null
  risk_score: number | null
  findings: string[]
  differential: string[]
  narrative: string | null
  recommendation: string | null
  created_at: string
}

/** GET /api/v1/assessments/me/ai-analysis/ */
export interface AIAnalysisResponse {
  source: 'cache' | 'orinn'
  analysis: AIAnalysisResult
}

/** GET /api/v1/assessments/st-elevation/me/ */
export interface PatientSTResult {
  your_result: string
  what_this_means: string
  heart_region: string
  emergency_alert: boolean
  last_checked: string
}

/** Derived from ECGAnalysis + AIAnalysisResult — used by HomeTab */
export interface HealthMetric {
  avgHr: number | null
  hrv_ms: number | null
  qrs_width_ms: number | null
  signalStrength: number | null
  status: 'normal' | 'warning' | 'alert'
  rhythm: string | null
}

export type TimelineEventType = 'observation' | 'confirmation' | 'alert' | 'insight'
export type TimelineSource = 'axiom' | 'zen' | 'alyna' | 'clinician'

export interface TimelineEvent {
  id: string
  time: string
  type: TimelineEventType
  title: string
  description?: string
  source: TimelineSource
}

export interface RhythmStreak {
  days: number
  milestones: Milestone[]
  weekDots: boolean[]
}

export interface Milestone {
  label: string
  days: number
  achieved: boolean
  active: boolean
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'alyna'
  message: string
  time: string
}

/** App-level user: BackendUser + computed fields */
export interface User extends BackendUser {
  name: string
  journey: 'wellness' | 'care' | 'evac' | 'hospital'
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  notifications: boolean
  shareWithCircle: boolean
}

// ─── Static content types (no backend endpoints yet) ─────────────────────────

export interface CircleMember {
  id: string
  name: string
  initials: string
  color: string
  relation: string
  lastMessage?: string
}

export interface Journey {
  id: string
  title: string
  subtitle: string
  emoji?: string
  participants?: number
  curator?: string
}

export interface Story {
  id: string
  type: string
  quote: string
  author: string
  authorAge?: number
  tag: string
  tagColor: string
}

// Customer Support 
export type TicketStatus = 'open' | 'in_progress' | 'escalated' | 'resolved' | 'closed'
export type TicketSeverity = 'critical' | 'urgent' | 'normal' | 'resolved'
export type TicketCategory =
  | 'device_sync'
  | 'alyna_alert'
  | 'billing'
  | 'onboarding'
  | 'evac_alert'
  | 'other'

/** One message in a ticket thread  */
export interface SupportMessage {
  id: number
  sender: string
  text: string
  time: string
  sent_at: string
  mine: boolean
  sender_type: 'customer' | 'agent' | 'system'
}

/** Compact ticket shape  */
export interface SupportTicket {
  id: number
  ticket_number: string
  title: string
  severity: TicketSeverity
  status: TicketStatus
  category: TicketCategory
  user_name: string
  user_plan: string
  tags: string[]
  time_ago: string
  message_count: number
  assigned_to: { id: number; name: string } | null
  created_at: string
}

/** Full ticket detail  */
export interface SupportTicketDetail extends SupportTicket {
  description: string
  user_email: string | null
  member_since: string | null
  clinician: string | null
  note: string | null
  messages: SupportMessage[]
  updated_at: string
  resolved_at: string | null
}

/** Paginated list wrapper */
export interface PaginatedTickets {
  count: number
  next: string | null
  previous: string | null
  results: SupportTicket[]
}

export interface CreateTicketPayload extends Record<string, unknown> {
  title: string
  description: string
  category: TicketCategory
}

export interface CsatPayload extends Record<string, unknown> {
  score: number
  comment?: string
}

/** Real-time WebSocket message received from the server */
export interface WsChatMessage {
  type: 'chat_message'
  id: number
  sender: string
  sender_type: 'customer' | 'agent' | 'system'
  text: string
  time: string
  sent_at: string
  mine: boolean
}