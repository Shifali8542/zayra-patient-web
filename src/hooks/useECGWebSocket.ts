import { useEffect, useRef, useCallback, useState } from 'react'
import { API_BASE_URL } from '../services/api'
import { ECG_RING_BUFFER_SIZE } from '../ble/BLEConstants'

function toWsUrl(base: string): string {
  return base.replace(/^http/, 'ws')
}

export type WSECGStatus = 'idle' | 'connecting' | 'streaming' | 'complete' | 'error'

export interface WSECGMetadata {
  samplingRate: number
  numChannels: number
  channelNames: string[]
  durationSeconds: number
  recommendedDisplaySeconds: number
}

export interface WSECGHookResult {
  status: WSECGStatus
  metadata: WSECGMetadata | null
  liveBpm: number | null
  error: string | null
  // Ring buffer — same pattern as BLE, no React re-renders on ECG data
  ecgRingBufferRef: React.MutableRefObject<Float32Array>
  ecgWriteIndexRef: React.MutableRefObject<number>
  start: (speed?: number) => void
  pause: () => void
  resume: () => void
  stop: () => void
}

export function useECGWebSocket(
  patientId: number | null,
  recordId: number | null,
  accessToken: string | null,
): WSECGHookResult {
  const [status, setStatus]     = useState<WSECGStatus>('idle')
  const [metadata, setMetadata] = useState<WSECGMetadata | null>(null)
  const [liveBpm, setLiveBpm]   = useState<number | null>(null)
  const [error, setError]       = useState<string | null>(null)

  const wsRef            = useRef<WebSocket | null>(null)
  const statusRef        = useRef<WSECGStatus>('idle')
  const ecgRingBufferRef = useRef(new Float32Array(ECG_RING_BUFFER_SIZE))
  const ecgWriteIndexRef = useRef(0)

  // Keep statusRef in sync so onclose closure reads correct value
  statusRef.current = status

  // Open WebSocket when patientId + recordId are available
  useEffect(() => {
    if (!patientId || !recordId || !accessToken) return

    const url = `${toWsUrl(API_BASE_URL)}/ws/ecg/${patientId}/${recordId}/?token=${accessToken}`
    setStatus('connecting')
    setError(null)

    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      // Connection open — wait for metadata from server before marking streaming
    }

    ws.onmessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data as string)

        if (msg.type === 'metadata') {
          setMetadata({
            samplingRate:               msg.sampling_rate,
            numChannels:                msg.num_channels,
            channelNames:               msg.channel_names,
            durationSeconds:            msg.duration_seconds,
            recommendedDisplaySeconds:  msg.recommended_display_seconds,
          })
          setStatus('streaming')
        }

        else if (msg.type === 'chunk') {
          // Pick first available channel (Lead I or Lead II)
          const channelName = Object.keys(msg.samples)[0]
          if (!channelName) return
          const samples: number[] = msg.samples[channelName]

          // Write into ring buffer — never triggers React re-render
          for (const sample of samples) {
            ecgRingBufferRef.current[ecgWriteIndexRef.current % ECG_RING_BUFFER_SIZE] = sample
            ecgWriteIndexRef.current++
          }

          if (msg.live_bpm !== null && msg.live_bpm !== undefined) {
            setLiveBpm(msg.live_bpm)
          }
        }

        else if (msg.type === 'complete') {
          setStatus('complete')
        }

        else if (msg.type === 'error') {
          setError(msg.message)
          setStatus('error')
        }

      } catch {
        // Ignore malformed JSON frames
      }
    }

    ws.onerror = () => {
      setError('WebSocket connection failed. Check that the backend server is running.')
      setStatus('error')
    }

    ws.onclose = () => {
      if (statusRef.current !== 'complete') setStatus('idle')
    }

    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [patientId, recordId, accessToken])

  const sendAction = useCallback((action: string, extra?: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action, ...extra }))
    }
  }, [])

  const start  = useCallback((speed = 1) => sendAction('start', { speed }), [sendAction])
  const pause  = useCallback(() => sendAction('pause'),  [sendAction])
  const resume = useCallback(() => sendAction('resume'), [sendAction])
  const stop   = useCallback(() => sendAction('stop'),   [sendAction])

  return { status, metadata, liveBpm, error, ecgRingBufferRef, ecgWriteIndexRef, start, pause, resume, stop }
}