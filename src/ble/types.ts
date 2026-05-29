export type BLEStatus =
  | 'idle'
  | 'scanning'
  | 'connecting'
  | 'discovering'
  | 'streaming'
  | 'reconnecting'
  | 'disconnected'
  | 'error'

export interface BLEVitals {
  heartRate: number | null      // bpm
  spO2: number | null           // percent
  timestamp: number             // Date.now()
}

export interface ECGSample {
  channelMv: number             // millivolts, Lead I or II
  timestamp: number             // Date.now() at parse time
}

export interface BLEDeviceState {
  status: BLEStatus
  deviceName: string | null
  vitals: BLEVitals | null
  error: string | null
  reconnectAttempt: number
}

export interface ParsedECGPacket {
  samples: ECGSample[]
  sequenceNumber: number
  valid: boolean
}