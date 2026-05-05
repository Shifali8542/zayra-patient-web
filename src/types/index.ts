export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  journey: 'wellness' | 'care' | 'evac' | 'hospital'
  baseline: UserBaseline
  preferences: UserPreferences
}

export interface UserBaseline {
  age: number
  hrv: number
  restingHr: number
  stressSignature: string
  lifestyle: string
  sleepPattern: string
  stressLevel: string
  activity: string
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  notifications: boolean
  shareWithCircle: boolean
}

export interface HealthMetric {
  avgHr: number
  spo2: number
  anomalies: number
  signalStrength: number
  status: 'normal' | 'warning' | 'alert'
}

export interface TimelineEvent {
  id: string
  time: string
  type: 'observation' | 'confirmation' | 'alert' | 'insight'
  title: string
  description?: string
  source: 'axiom' | 'zen' | 'alyna' | 'clinician'
}

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
  description?: string
  participants?: number
  curator?: string
  emoji?: string
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

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
}

export interface OnboardingData {
  name: string
  intentions: string[]
  age: number
  lifestyle: string
  sleepPattern: string
  stressLevel: string
  activity: string
}
