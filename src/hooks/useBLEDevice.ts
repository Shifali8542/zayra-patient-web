import { useState, useEffect, useCallback, useRef } from 'react'
import { bleDeviceManager } from '../ble/BLEDeviceManager'
import { ECG_RING_BUFFER_SIZE } from '../ble/BLEConstants'
import type { BLEStatus, BLEVitals, ECGSample } from '../ble/types'

export interface BLEDeviceHookResult {
  status: BLEStatus
  vitals: BLEVitals | null
  error: string | null
  reconnectAttempt: number
  deviceName: string | null
  // The ring buffer is accessed via ref — never triggers re-renders
  ecgRingBufferRef: React.MutableRefObject<Float32Array>
  ecgWriteIndexRef: React.MutableRefObject<number>
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

export function useBLEDevice(): BLEDeviceHookResult {
  const [status, setStatus]           = useState<BLEStatus>('idle')
  const [vitals, setVitals]           = useState<BLEVitals | null>(null)
  const [error, setError]             = useState<string | null>(null)
  const [reconnectAttempt, setReconnectAttempt] = useState(0)
  const [deviceName, setDeviceName]   = useState<string | null>(null)

  // Ring buffer lives in refs — never causes React re-renders on ECG data
  const ecgRingBufferRef  = useRef(new Float32Array(ECG_RING_BUFFER_SIZE))
  const ecgWriteIndexRef  = useRef(0)

  useEffect(() => {
    const unsubStatus  = bleDeviceManager.onStatus((s, attempt) => {
      setStatus(s)
      if (attempt !== undefined) setReconnectAttempt(attempt)
    })
    const unsubVitals  = bleDeviceManager.onVitals(setVitals)
    const unsubError   = bleDeviceManager.onError(setError)
    const unsubECG     = bleDeviceManager.onECG((samples: ECGSample[]) => {
      // Write into ring buffer — no setState call
      for (const sample of samples) {
        ecgRingBufferRef.current[ecgWriteIndexRef.current % ECG_RING_BUFFER_SIZE] = sample.channelMv
        ecgWriteIndexRef.current++
      }
    })

    return () => {
      unsubStatus()
      unsubVitals()
      unsubError()
      unsubECG()
    }
  }, [])

  const connect    = useCallback(() => bleDeviceManager.connect(), [])
  const disconnect = useCallback(() => bleDeviceManager.disconnect(), [])

  return { status, vitals, error, reconnectAttempt, deviceName, ecgRingBufferRef, ecgWriteIndexRef, connect, disconnect }
}