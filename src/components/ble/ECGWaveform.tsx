import React, { useRef, useEffect } from 'react'
import { ECG_RING_BUFFER_SIZE } from '../../ble/BLEConstants'

interface ECGWaveformProps {
  ringBufferRef: React.MutableRefObject<Float32Array>
  writeIndexRef: React.MutableRefObject<number>
  isActive: boolean
  displaySamples?: number
}

export function ECGWaveform({
  ringBufferRef,
  writeIndexRef,
  isActive,
  displaySamples = 1000,
}: ECGWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    if (!isActive) {
      cancelAnimationFrame(rafRef.current)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      // Medical ECG grid
      ctx.strokeStyle = 'rgba(255, 180, 180, 0.25)'
      ctx.lineWidth = 0.5
      const cellW = width / 25
      const cellH = height / 10
      for (let x = 0; x <= width; x += cellW) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke()
      }
      for (let y = 0; y <= height; y += cellH) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke()
      }

      // Read ring buffer
      const buf   = ringBufferRef.current
      const total = Math.min(writeIndexRef.current, ECG_RING_BUFFER_SIZE)
      const count = Math.min(total, displaySamples)
      if (count < 2) { rafRef.current = requestAnimationFrame(draw); return }

      const startIdx = (writeIndexRef.current - count + ECG_RING_BUFFER_SIZE) % ECG_RING_BUFFER_SIZE

      let min = Infinity, max = -Infinity
      for (let i = 0; i < count; i++) {
        const v = buf[(startIdx + i) % ECG_RING_BUFFER_SIZE]
        if (v < min) min = v
        if (v > max) max = v
      }
      const range = max - min || 1

      ctx.beginPath()
      ctx.strokeStyle = '#00C2B2'
      ctx.lineWidth = 1.5
      ctx.lineJoin = 'round'
      ctx.lineCap  = 'round'

      for (let i = 0; i < count; i++) {
        const sample = buf[(startIdx + i) % ECG_RING_BUFFER_SIZE]
        const x = (i / (count - 1)) * width
        const y = height - ((sample - min) / range) * (height * 0.85) - height * 0.075
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isActive, displaySamples, ringBufferRef, writeIndexRef])

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={120}
      style={{ width: '100%', height: 120, display: 'block', borderRadius: 8 }}
    />
  )
}