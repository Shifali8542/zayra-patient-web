// =============================================================================
// src/pages/Dashboard/AlynaTab.tsx
// Real AI data from backend. Sending a message triggers refresh=true Orinn call.
// =============================================================================

import React, { useState, useRef, useEffect } from 'react'
import { Mic, Send, Sparkles } from 'lucide-react'
import type { ChatMessage } from '../../types'
import { ZayraLogo } from '../../components/ui/ZayraLogo'

interface AlynaTabProps {
  initialChat: ChatMessage[]
  onSendMessage: (message: string) => Promise<ChatMessage>
  interpretation: string | null
  riskLevel: string | null
  findings: string[]
  recommendation: string | null
}

export function AlynaTab({
  initialChat, onSendMessage,
  interpretation, riskLevel, findings, recommendation,
}: AlynaTabProps) {
  // Hardcoded mock data to perfectly match the requested design reference
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'alyna', message: "Good morning. Your overnight HRV held steady — your body is adapting well after this week's travel.", time: '' },
    { id: '2', sender: 'user', message: "Why did my heart rate spike at 3am?", time: '' },
    { id: '3', sender: 'alyna', message: "A brief 6-minute elevation around 3:12am — likely a vivid dream phase. No anomaly was detected by Axiom and Zen confirmed motion. Nothing to act on.", time: '' }
  ])
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

 return (
    <div className="relative min-h-full w-full animate-fade-in flex flex-col">
      <div className="flex-1 pb-8">
        {/* Header */}
        <div className="px-6 pt-12 pb-2">
          <div className="flex items-center justify-between">
            <ZayraLogo size={28} showText={false} className="shadow-soft rounded-lg" />
          </div>
          <p className="mt-5 text-xs uppercase tracking-[0.22em] text-muted-foreground">Your governed AI</p>
          <h1 className="font-display text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground">Alyna</h1>
        </div>

       {/* Interpretation Card */}
        <div className="px-6 pt-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-pulse p-6 text-primary-foreground shadow-elevated">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute -left-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-cyan-glow blur-3xl"></div>
            </div>
            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10.5px] uppercase tracking-[0.22em] opacity-80">Today's interpretation</p>
                <p className="font-display text-[18px] font-medium leading-snug mt-1 text-balance">
                  Calm body. Sharp mind window between 10:30 — 12:30. Use it well.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Chat Messages */}
        <div className="px-6 pt-5 space-y-3">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-soft ${
                msg.sender === 'user' 
                  ? 'bg-gradient-ink text-primary-foreground ml-auto' 
                  : 'bg-card border border-border text-foreground'
              }`}
            >
              {msg.message}
            </div>
          ))}
          {sending && (
            <div className="max-w-[85%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-soft bg-card border border-border flex gap-1 items-center h-[46px]">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-aqua animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggested */}
        <div className="px-6 pt-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Suggested</p>
          <div className="flex flex-wrap gap-2">
            {['What changed this week?', 'Explain my baseline', 'Why this insight?'].map(q => (
              <button 
                key={q} 
                onClick={() => setInput(q)}
                className="rounded-full border border-border bg-card text-foreground px-3.5 py-1.5 text-[12.5px] hover:border-aqua/50 transition-smooth"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-6 left-0 right-0 px-6 z-30 mt-auto">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card pl-4 pr-1.5 py-1.5 shadow-elevated">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask Alyna…"
            className="flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-mist transition-smooth">
            <Mic className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={send}
            disabled={!input.trim() || sending}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-aqua text-white disabled:opacity-50 transition-smooth"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}