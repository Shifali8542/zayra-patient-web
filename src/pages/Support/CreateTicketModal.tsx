// =============================================================================
// src/pages/Support/CreateTicketModal.tsx
// Modal form to create a new support ticket.
// Keeps SupportScreen clean by isolating form logic here.
// =============================================================================

import React, { useState } from 'react'
import { X, Send, AlertCircle } from 'lucide-react'
import { api, ApiError } from '../../services/api'
import type { TicketCategory } from '../../types'

interface CreateTicketModalProps {
  onClose: () => void
  onCreated: (ticketId: number) => void
}

const CATEGORIES: { value: TicketCategory; label: string; description: string }[] = [
  { value: 'device_sync',  label: 'Device issue',    description: 'Patch not syncing, LED errors' },
  { value: 'alyna_alert',  label: 'Alyna / AI',      description: 'Question about my AI analysis' },
  { value: 'billing',      label: 'Billing',          description: 'Charges, subscription, refund' },
  { value: 'onboarding',   label: 'Getting started',  description: 'Setup, account, profile help' },
  { value: 'evac_alert',   label: 'Evac / Emergency', description: 'Emergency response question' },
  { value: 'other',        label: 'Other',            description: 'Something else' },
]

export function CreateTicketModal({ onClose, onCreated }: CreateTicketModalProps) {
  const [title,    setTitle]    = useState('')
  const [desc,     setDesc]     = useState('')
  const [category, setCategory] = useState<TicketCategory>('other')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const isValid = title.trim().length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setLoading(true)
    setError(null)
    try {
      const ticket = await api.support.createTicket({
        title:       title.trim(),
        description: desc.trim(),
        category,
      })
      onCreated(ticket.id)
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Failed to create ticket. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(13, 27, 42, 0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Sheet */}
      <div className="w-full max-w-lg bg-white dark:bg-zayra-navy rounded-t-3xl px-5 pt-5 pb-8 animate-slide-up">

        {/* Handle + close */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex-1 flex justify-center">
            <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-white/20" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-400"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">
          New Request
        </p>
        <h3 className="font-display font-bold text-xl text-zayra-navy dark:text-white mb-5">
          Contact Support
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Category selector */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Category
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`text-left px-3 py-2.5 rounded-2xl border transition-all ${
                    category === cat.value
                      ? 'border-zayra-teal bg-zayra-mint/40 text-zayra-teal'
                      : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-zayra-teal/50'
                  }`}
                >
                  <p className="text-xs font-semibold">{cat.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{cat.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Subject
            </p>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Briefly describe your issue"
              maxLength={255}
              required
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10
                         bg-gray-50 dark:bg-white/5 text-sm text-zayra-navy dark:text-white
                         placeholder-gray-400 focus:border-zayra-teal transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Details <span className="text-gray-300 font-normal normal-case tracking-normal">(optional)</span>
            </p>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Tell us more so we can help you faster…"
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10
                         bg-gray-50 dark:bg-white/5 text-sm text-zayra-navy dark:text-white
                         placeholder-gray-400 focus:border-zayra-teal transition-colors resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-red-50 border border-red-100">
              <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-500">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className="btn-teal w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Sending…
              </span>
            ) : (
              <>
                <Send size={14} />
                Submit request
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}