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

  // Append a new message
  const appendMessage = useCallback((msg: SupportMessage) => {
    setState(prev => {
      if (prev.messages.some(m => m.id === msg.id)) return prev
      return { ...prev, messages: [...prev.messages, msg] }
    })
  }, [])

  // Load full history
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

  // Build WebSocket URL
  const buildWsUrl = useCallback(() => {
    const wsBase = API_BASE_URL
      .replace('https://', 'wss://')
      .replace('http://', 'ws://')
    return `${wsBase}/ws/support/tickets/${ticketId}/?token=${accessToken ?? ''}`
  }, [ticketId, accessToken])

  // Open WebSocket 
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
        appendMessage(incoming)
      } catch {
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

  // Poll for new messages
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const pollMessages = useCallback(async () => {
    if (!isMounted.current) return
    try {
      const latest = await api.support.getMessages(ticketId)
      if (!isMounted.current) return
      setState(prev => {
        if (latest.length === prev.messages.length) return prev
        const existingIds = new Set(prev.messages.map(m => m.id))
        const newOnes = latest.filter(m => !existingIds.has(m.id))
        if (newOnes.length === 0) return prev
        return { ...prev, messages: [...prev.messages, ...newOnes] }
      })
    } catch {
    }
  }, [ticketId])

  // Single mount effect
  useEffect(() => {
    isMounted.current = true

    loadHistory()
    connectWs()

    // Poll every 5 seconds
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
        wsRef.current.onclose = null
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [ticketId, accessToken])
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    setState(prev => ({ ...prev, sending: true, error: null }))

    try {
      const ws = wsRef.current
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ message: trimmed }))
      } else {
        const msg = await api.support.sendMessage(ticketId, trimmed)
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