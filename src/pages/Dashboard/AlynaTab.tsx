import React, { useState, useRef, useEffect } from 'react'
import { Mic, Send, Sparkles } from 'lucide-react'
import { api } from '../../services/api'

interface ChatMessage {
  id: string
  sender: string
  message: string
  time: string
}

interface AlynaTabProps {
  initialChat: ChatMessage[]
}

export function AlynaTab({ initialChat }: AlynaTabProps) {
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
      message: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setSending(true)
    const reply = await api.alyna.sendMessage(input)
    setMessages(prev => [...prev, reply as ChatMessage])
    setSending(false)
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-2 pb-3">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Your Governed AI</p>
        <h2 className="font-display font-bold text-2xl text-zayra-navy dark:text-white">Alyna</h2>
      </div>

      {/* Today's interpretation */}
      <div className="mx-4 mb-3 rounded-2xl bg-teal-gradient p-4">
        <p className="text-xs font-semibold tracking-widest text-white/70 uppercase mb-2">Today's Interpretation</p>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Sparkles size={16} className="text-white" />
          </div>
          <p className="text-white font-semibold text-sm leading-snug">
            Calm body. Sharp mind window between 10:30 — 12:30. Use it well.
          </p>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-3" style={{ maxHeight: 340 }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-zayra-navy text-white rounded-tr-sm'
                  : 'bg-gray-50 dark:bg-zayra-navy-mid text-gray-800 dark:text-gray-200 rounded-tl-sm'
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-gray-50 dark:bg-zayra-navy-mid px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-zayra-teal animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
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
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask Alyna..."
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
