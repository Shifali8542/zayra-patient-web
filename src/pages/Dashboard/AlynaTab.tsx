// =============================================================================
// src/pages/Dashboard/AlynaTab.tsx
// Real AI data from backend. Sending a message triggers refresh=true Orinn call.
// =============================================================================

import React, { useState, useRef, useEffect } from 'react'
import { Mic, Send, Sparkles } from 'lucide-react'
import type { ChatMessage } from '../../types'

interface AlynaTabProps {
  initialChat: ChatMessage[]
  onSendMessage: (message: string) => Promise<ChatMessage>
  interpretation: string | null
  riskLevel: string | null
  findings: string[]
  recommendation: string | null
}

function getRiskBadgeStyle(level: string | null): { bg: string; text: string } {
  switch (level) {
    case 'Critical': return { bg: 'rgba(239,68,68,0.15)', text: '#EF4444' }
    case 'High':     return { bg: 'rgba(239,68,68,0.10)', text: '#EF4444' }
    case 'Moderate': return { bg: 'rgba(245,158,11,0.15)', text: '#D97706' }
    case 'Low':      return { bg: 'rgba(16,185,129,0.12)', text: '#059669' }
    default:         return { bg: 'rgba(107,114,128,0.12)', text: '#6B7280' }
  }
}

export function AlynaTab({
  initialChat, onSendMessage,
  interpretation, riskLevel, findings, recommendation,
}: AlynaTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChat)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || sending) return
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setSending(true)
    const reply = await onSendMessage(userMsg.message)
    setMessages(prev => [...prev, reply])
    setSending(false)
  }

  const riskStyle = getRiskBadgeStyle(riskLevel)

  return (
    <div className="flex flex-col animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-2 pb-2">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Your Governed AI</p>
        <div className="flex items-center gap-2 mt-0.5">
          <h2 className="font-display font-bold text-2xl text-zayra-navy dark:text-white">Alyna</h2>
          {riskLevel && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: riskStyle.bg, color: riskStyle.text }}>
              {riskLevel} Risk
            </span>
          )}
        </div>
      </div>

      {/* Today's interpretation — real narrative from ai_analysis.narrative */}
      <div className="mx-4 mb-3 rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #00C2B2 0%, #0D1B2A 100%)' }}>
        <p className="text-xs font-semibold tracking-widest text-white/70 uppercase mb-2">Today's Interpretation</p>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Sparkles size={16} className="text-white" />
          </div>
          <p className="text-white font-semibold text-sm leading-snug">
            {interpretation ?? 'Analysing your ECG data…'}
          </p>
        </div>
      </div>

      {/* Key Findings — real from ai_analysis.findings */}
      {findings.length > 0 && (
        <div className="px-4 mb-3">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Key Findings</p>
          <div className="flex flex-wrap gap-1.5">
            {findings.map((f, i) => (
              <span key={i} className="text-xs text-zayra-teal bg-zayra-teal/10 border border-zayra-teal/20 px-2 py-0.5 rounded-full">
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommendation — real from ai_analysis.recommendation */}
      {recommendation && (
        <div className="mx-4 mb-3 card px-3 py-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Recommendation</p>
          <p className="text-sm text-zayra-navy dark:text-white">{recommendation}</p>
        </div>
      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-3" style={{ maxHeight: 240 }}>
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-zayra-navy text-white rounded-tr-sm'
                : 'bg-gray-50 dark:bg-zayra-navy-mid text-gray-800 dark:text-gray-200 rounded-tl-sm'
            }`}>
              {msg.message}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-gray-50 dark:bg-zayra-navy-mid px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-zayra-teal animate-bounce"
                       style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-zayra-navy-mid rounded-2xl px-3 py-2 border border-gray-100 dark:border-gray-700">
          <input
            type="text" value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask Alyna…"
            className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none"
          />
          <button className="text-gray-400 hover:text-zayra-teal transition-colors">
            <Mic size={18} />
          </button>
          <button
            onClick={send}
            disabled={!input.trim() || sending}
            className="w-8 h-8 rounded-full bg-zayra-teal flex items-center justify-center disabled:opacity-40 hover:bg-zayra-accent transition-colors"
          >
            <Send size={14} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}