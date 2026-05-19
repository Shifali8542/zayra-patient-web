// =============================================================================
// src/hooks/useSupportChat.ts
// Real-time WebSocket chat for a support ticket.
//
// FIX SUMMARY (was: messages only appeared on page refresh):
//   - Removed duplicate WebSocket object (was creating ws + wsWithToken, leaking ws)
//   - Fixed stale closure: onmessage uses setState functional updater so it always
//     reads latest messages without needing messages in the dependency array
//   - Fixed useEffect deps: connectWs is defined outside useCallback and called
//     once inside the single mount effect — no reconnection loops
//   - REST fallback on send now appends correctly using functional updater
//   - Cleanup properly nulls wsRef and cancels retry timer on unmount
// =============================================================================

import { useState, useEffect, useRef, useCallback } from 'react'
import { api, API_BASE_URL, ApiError } from '../services/api'
import type { SupportMessage, WsChatMessage } from '../types'

const MAX_RETRIES   = 3
const RETRY_DELAY_MS = 2000

interface SupportChatState {
  messages:  SupportMessage[]
  connected: boolean
  loading:   boolean
  error:     string | null
  sending:   boolean
}

export function useSupportChat(ticketId: number, accessToken: string | null) {
  const [state, setState] = useState<SupportChatState>({
    messages:  [],
    connected: false,
    loading:   true,
    error:     null,
    sending:   false,
  })

  const wsRef       = useRef<WebSocket | null>(null)
  const retryCount  = useRef(0)
  const retryTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMounted   = useRef(true)

  // ── Append a new message — functional updater avoids stale closure ──────────
  const appendMessage = useCallback((msg: SupportMessage) => {
    setState(prev => {
      // Guard: skip if already in list (REST history loaded it first)
      if (prev.messages.some(m => m.id === msg.id)) return prev
      return { ...prev, messages: [...prev.messages, msg] }
    })
  }, [])

  // ── Load full history via REST on mount ────────────────────────────────────
  const loadHistory = useCallback(async () => {
    try {
      const messages = await api.support.getMessages(ticketId)
      if (isMounted.current) {
        setState(prev => ({ ...prev, messages, loading: false }))
      }
    } catch (e) {
      if (isMounted.current) {
        const msg = e instanceof ApiError ? e.message : 'Failed to load messages.'
        setState(prev => ({ ...prev, loading: false, error: msg }))
      }
    }
  }, [ticketId])

  // ── Build WebSocket URL — token passed as query param ──────────────────────
  // Browsers cannot set custom headers on WebSocket connections.
  // The backend JWTAuthMiddleware._extract_token() reads ?token= as fallback.
  const buildWsUrl = useCallback(() => {
    const wsBase = API_BASE_URL
      .replace('https://', 'wss://')
      .replace('http://', 'ws://')
    return `${wsBase}/ws/support/tickets/${ticketId}/?token=${accessToken ?? ''}`
  }, [ticketId, accessToken])

  // ── Open WebSocket ─────────────────────────────────────────────────────────
  const connectWs = useCallback(() => {
    if (!accessToken || !isMounted.current) return

    // Close any existing connection before opening a new one
    if (wsRef.current) {
      wsRef.current.onclose = null
      wsRef.current.close()
      wsRef.current = null
    }

    const ws = new WebSocket(buildWsUrl())
    wsRef.current = ws

    ws.onopen = () => {
      if (!isMounted.current) return
      retryCount.current = 0
      setState(prev => ({ ...prev, connected: true, error: null }))
    }

    ws.onmessage = (event: MessageEvent) => {
      if (!isMounted.current) return
      try {
        const data = JSON.parse(event.data as string) as WsChatMessage
        if (data.type !== 'chat_message') return

        const incoming: SupportMessage = {
          id:          data.id,
          sender:      data.sender,
          text:        data.text,
          time:        data.time,
          sent_at:     data.sent_at,
          mine:        data.mine,
          sender_type: data.sender_type,
        }
        // appendMessage uses functional updater — never stale
        appendMessage(incoming)
      } catch {
        // Ignore malformed frames silently
      }
    }

    ws.onerror = () => {
      if (!isMounted.current) return
      setState(prev => ({ ...prev, connected: false }))
    }

    ws.onclose = () => {
      if (!isMounted.current) return
      setState(prev => ({ ...prev, connected: false }))
      wsRef.current = null

      // Auto-reconnect with incremental backoff
      if (retryCount.current < MAX_RETRIES) {
        retryCount.current += 1
        const delay = RETRY_DELAY_MS * retryCount.current
        retryTimer.current = setTimeout(() => {
          if (isMounted.current) connectWs()
        }, delay)
      }
    }
  }, [accessToken, buildWsUrl, appendMessage])

  // ── Poll for new messages — catches REST-originated agent replies ──────────
  // WebSocket handles messages sent via WS instantly (patient → agent path).
  // Agent replies come via REST (support web has no WebSocket) → poll bridges the gap.
  // 5s cadence: fast enough to feel live, light enough to not hammer the server.
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const pollMessages = useCallback(async () => {
    if (!isMounted.current) return
    try {
      const latest = await api.support.getMessages(ticketId)
      if (!isMounted.current) return
      setState(prev => {
        // Only update if there are genuinely new messages
        if (latest.length === prev.messages.length) return prev
        // Merge: keep messages already in state, append any truly new ones
        const existingIds = new Set(prev.messages.map(m => m.id))
        const newOnes = latest.filter(m => !existingIds.has(m.id))
        if (newOnes.length === 0) return prev
        return { ...prev, messages: [...prev.messages, ...newOnes] }
      })
    } catch {
      // Swallow poll errors silently — WS is still the primary channel
    }
  }, [ticketId])

  // ── Single mount effect — load history then open WS ────────────────────────
  useEffect(() => {
    isMounted.current = true

    loadHistory()
    connectWs()

    // Poll every 5 seconds to catch REST-originated agent replies
    pollRef.current = setInterval(pollMessages, 5000)

    return () => {
      isMounted.current = false

      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
      if (retryTimer.current) {
        clearTimeout(retryTimer.current)
        retryTimer.current = null
      }
      if (wsRef.current) {
        wsRef.current.onclose = null  // prevent auto-reconnect on intentional close
        wsRef.current.close()
        wsRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId, accessToken])   // re-run only if ticket or token changes
  // ── Send a message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    setState(prev => ({ ...prev, sending: true, error: null }))

    try {
      const ws = wsRef.current
      if (ws && ws.readyState === WebSocket.OPEN) {
        // Send via WebSocket — backend broadcasts to both sides instantly
        ws.send(JSON.stringify({ message: trimmed }))
      } else {
        // Fallback: REST if WS is not ready
        const msg = await api.support.sendMessage(ticketId, trimmed)
        // Use functional updater so we never miss a concurrent append
        setState(prev => ({
          ...prev,
          messages: prev.messages.some(m => m.id === msg.id)
            ? prev.messages
            : [...prev.messages, msg],
        }))
      }
    } catch (e) {
      const errMsg = e instanceof ApiError ? e.message : 'Failed to send message.'
      setState(prev => ({ ...prev, error: errMsg }))
    } finally {
      setState(prev => ({ ...prev, sending: false }))
    }
  }, [ticketId])

  return { ...state, sendMessage }
}