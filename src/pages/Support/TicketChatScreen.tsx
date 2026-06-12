import React, { useState, useRef, useEffect } from 'react'
import {
  ArrowLeft, Wifi, WifiOff, Send, Star, AlertCircle, CheckCircle,
} from 'lucide-react'
import { useSupportChat } from '../../hooks/useSupportChat'
import { api, ApiError } from '../../services/api'
import type { SupportTicketDetail, TicketStatus } from '../../types'

interface TicketChatScreenProps {
  ticketId: number
  accessToken: string | null
  onBack: () => void
}

const STATUS_LABEL: Record<TicketStatus, string> = {
  open:        'Open',
  in_progress: 'In Progress',
  escalated:   'Escalated',
  resolved:    'Resolved',
  closed:      'Closed',
}

// ── CSAT component — shown inline below the chat when resolved ────────────────

function CsatPrompt({ ticketId, onDone }: { ticketId: number; onDone: () => void }) {
  const [score,      setScore]      = useState(0)
  const [hovered,    setHovered]    = useState(0)
  const [comment,    setComment]    = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done,       setDone]       = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  const handleSubmit = async () => {
    if (score === 0) return
    setSubmitting(true)
    setError(null)
    try {
      await api.support.submitCsat(ticketId, { score, comment: comment.trim() || undefined })
      setDone(true)
      setTimeout(onDone, 1500)
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Could not submit rating.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-2 py-4 animate-fade-in">
        <CheckCircle size={22} className="text-zayra-teal" />
        <p className="text-sm font-semibold text-zayra-navy dark:text-white">Thanks for your feedback!</p>
      </div>
    )
  }

  return (
    <div className="card p-4 mx-1 mt-2 animate-fade-in">
      <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">
        Rate this support
      </p>
      <p className="text-sm font-semibold text-zayra-navy dark:text-white mb-3">
        How was your experience?
      </p>

      {/* Star rating */}
      <div className="flex gap-1 mb-3 justify-center">
        {[1, 2, 3, 4, 5].map(s => (
          <button
            key={s}
            type="button"
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setScore(s)}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={28}
              className={
                s <= (hovered || score)
                  ? 'text-zayra-teal fill-zayra-teal'
                  : 'text-gray-200'
              }
            />
          </button>
        ))}
      </div>

      {/* Optional comment */}
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Tell us more (optional)…"
        rows={2}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10
                   bg-gray-50 dark:bg-white/5 text-xs text-zayra-navy dark:text-white
                   placeholder-gray-400 focus:border-zayra-teal transition-colors resize-none mb-3"
      />

      {error && (
        <p className="text-xs text-red-400 mb-2">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={score === 0 || submitting}
        className="btn-teal w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting…' : 'Submit rating'}
      </button>
    </div>
  )
}

// ── Message bubble ─────────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: { sender: string; text: string; time: string; mine: boolean; sender_type: string } }) {
  const isSystem = msg.sender_type === 'system'

  if (isSystem) {
    return (
      <div className="flex justify-center my-1">
        <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full">
          {msg.text}
        </span>
      </div>
    )
  }

  return (
    <div className={`flex ${msg.mine ? 'justify-end' : 'justify-start'} mb-1`}>
      <div className={`max-w-[78%] ${msg.mine ? 'items-end' : 'items-start'} flex flex-col`}>
        {!msg.mine && (
          <span className="text-[10px] text-gray-400 ml-1 mb-0.5">{msg.sender}</span>
        )}
        <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
          msg.mine
            ? 'bg-zayra-teal text-white rounded-tr-sm'
            : 'bg-gray-100 dark:bg-white/10 text-zayra-navy dark:text-white rounded-tl-sm'
        }`}>
          {msg.text}
        </div>
        <span className="text-[10px] text-gray-400 mt-0.5 mx-1">{msg.time}</span>
      </div>
    </div>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────

export function TicketChatScreen({ ticketId, accessToken, onBack }: TicketChatScreenProps) {
  const { messages, connected, loading, error, sending, sendMessage } = useSupportChat(ticketId, accessToken)

  const [detail,        setDetail]        = useState<SupportTicketDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(true)
  const [inputText,     setInputText]     = useState('')
  const [csatDone,      setCsatDone]      = useState(false)

  const bottomRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)

  // Load ticket metadata (title, status, ticket_number)
  useEffect(() => {
    api.support.getTicketDetail(ticketId)
      .then(d => { setDetail(d); setDetailLoading(false) })
      .catch(() => setDetailLoading(false))
  }, [ticketId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const container = document.getElementById('phone-scroll-container')
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
    }
  }, [messages])

  const handleSend = async () => {
    const text = inputText.trim()
    if (!text || sending) return
    setInputText('')
    await sendMessage(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isResolved = detail?.status === 'resolved' || detail?.status === 'closed'

  return (
    <div className="flex flex-col h-full animate-fade-in">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-white/10 bg-white dark:bg-zayra-navy flex-shrink-0">
        <button
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-300"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex-1 min-w-0">
          {detailLoading ? (
            <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
          ) : (
            <>
              <p className="text-sm font-semibold text-zayra-navy dark:text-white truncate">
                {detail?.title ?? 'Support Ticket'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-mono text-gray-400">
                  {detail?.ticket_number}
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-[10px] text-gray-400">
                  {detail ? STATUS_LABEL[detail.status] : ''}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Connection indicator */}
        <div className="flex items-center gap-1">
          {connected
            ? <Wifi size={13} className="text-zayra-teal" />
            : <WifiOff size={13} className="text-gray-300" />
          }
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5">

        {loading && (
          <div className="flex justify-center py-8">
            <span className="w-6 h-6 border-2 border-zayra-teal/30 border-t-zayra-teal rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-red-50 border border-red-100 mb-2">
            <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
            <p className="text-xs text-red-500">{error}</p>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
            <p className="text-sm font-semibold text-zayra-navy dark:text-white">No messages yet</p>
            <p className="text-xs text-gray-400">Our team will respond shortly.</p>
          </div>
        )}

        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {/* CSAT prompt for resolved tickets */}
        {isResolved && !csatDone && (
          <CsatPrompt ticketId={ticketId} onDone={() => setCsatDone(true)} />
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar — hidden when resolved */}
      {!isResolved && (
        <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-zayra-navy flex-shrink-0">
          <input
            ref={inputRef}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            disabled={sending}
            className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 dark:border-white/10
                       bg-gray-50 dark:bg-white/5 text-sm text-zayra-navy dark:text-white
                       placeholder-gray-400 focus:border-zayra-teal transition-colors
                       disabled:opacity-60"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || sending}
            className="w-10 h-10 rounded-full bg-zayra-teal flex items-center justify-center
                       hover:bg-zayra-accent transition-colors flex-shrink-0
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending
              ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <Send size={15} className="text-white" />
            }
          </button>
        </div>
      )}
    </div>
  )
}