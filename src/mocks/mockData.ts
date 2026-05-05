import type { User, HealthMetric, TimelineEvent, CircleMember, Journey, Story, RhythmStreak } from '../types'

export const mockUser: User = {
  id: '1',
  name: 'Shifali',
  email: 'shifali@example.com',
  journey: 'care',
  baseline: {
    age: 32,
    hrv: 62,
    restingHr: 58,
    stressSignature: 'low',
    lifestyle: 'Balanced',
    sleepPattern: 'Balanced',
    stressLevel: 'Balanced',
    activity: 'Balanced',
  },
  preferences: {
    theme: 'light',
    notifications: true,
    shareWithCircle: true,
  },
}

export const mockHealthMetric: HealthMetric = {
  avgHr: 62,
  spo2: 98,
  anomalies: 0,
  signalStrength: 98,
  status: 'normal',
}

export const mockTimeline: TimelineEvent[] = [
  {
    id: '1',
    time: '08:14',
    type: 'observation',
    title: 'AI observed minor PVC pattern',
    source: 'alyna',
  },
  {
    id: '2',
    time: '08:14',
    type: 'confirmation',
    title: 'Cross-confirmed with Zen pulse',
    source: 'zen',
  },
  {
    id: '3',
    time: '09:32',
    type: 'insight',
    title: 'HRV stable — stress window closing',
    source: 'alyna',
  },
  {
    id: '4',
    time: '11:05',
    type: 'observation',
    title: 'Resting HR within baseline range',
    source: 'axiom',
  },
  {
    id: '5',
    time: '13:40',
    type: 'insight',
    title: 'Calm body. Sharp mind window 10:30–12:30',
    source: 'alyna',
  },
]

export const mockCircleMembers: CircleMember[] = [
  { id: '1', name: 'Priya', initials: 'P', color: '#00C2B2', relation: 'Sister', lastMessage: 'Stay steady' },
  { id: '2', name: 'Rahul', initials: 'R', color: '#1B3A55', relation: 'Partner' },
  { id: '3', name: 'Ananya', initials: 'A', color: '#6B7280', relation: 'Friend' },
]

export const mockJourneys: Journey[] = [
  { id: '1', title: 'Better Sleep in 21 Days', subtitle: '1,248 walking together', emoji: '🌙', participants: 1248 },
  { id: '2', title: 'Heart-Aware Living', subtitle: 'Curated by Dr. Mehta', curator: 'Dr. Mehta', emoji: '🖤' },
  { id: '3', title: 'Stress Reset', subtitle: '12-min daily practice', emoji: '🌿' },
]

export const mockStories: Story[] = [
  {
    id: '1',
    type: 'EARLIER CARDIAC INSIGHT',
    quote: 'Alyna flagged a pattern I\'d ignored for months. My cardiologist confirmed it the next day.',
    author: 'Rohan',
    authorAge: 47,
    tag: 'CAUGHT EARLY. TREATED CALMLY.',
    tagColor: 'teal',
  },
  {
    id: '2',
    type: 'FAMILY REASSURANCE',
    quote: 'My father is in another city. Zayra\'s circle quietly tells me he\'s okay every morning.',
    author: 'Meera',
    tag: 'DISTANCE WITHOUT WORRY.',
    tagColor: 'light',
  },
  {
    id: '3',
    type: 'RECOVERY SUPPORT',
    quote: 'After my procedure, Alyna tracked every step back to normal. My doctor loved the reports.',
    author: 'Aditya',
    authorAge: 55,
    tag: 'EVIDENCE-BASED RECOVERY.',
    tagColor: 'teal',
  },
]

export const mockRhythmStreak: RhythmStreak = {
  days: 21,
  weekDots: [true, true, true, true, true, true, false],
  milestones: [
    { label: 'SPARKED', days: 3, achieved: true, active: false },
    { label: 'HELD', days: 7, achieved: true, active: false },
    { label: 'EMBODIED', days: 21, achieved: true, active: true },
    { label: 'GROUNDED', days: 30, achieved: false, active: false },
    { label: 'ANCHORED', days: 90, achieved: false, active: false },
    { label: 'SOVEREIGN', days: 365, achieved: false, active: false },
  ],
}

export const mockAlynaChat = [
  {
    id: '1',
    sender: 'alyna',
    message: 'Good morning. Your overnight HRV held steady — your body is adapting well after this week\'s travel.',
    time: '08:01',
  },
  {
    id: '2',
    sender: 'user',
    message: 'Why did my heart rate spike at 3am?',
    time: '08:03',
  },
  {
    id: '3',
    sender: 'alyna',
    message: 'A brief 6-minute elevation around 3:12am — likely a vivid dream phase. No anomaly was detected. Your rhythm returned to baseline within 8 minutes.',
    time: '08:03',
  },
]
