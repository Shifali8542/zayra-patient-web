import React, { useState } from 'react'
import { MessageCircle, Plus, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react'
import { useSupportTickets } from '../../hooks/useSupportTickets'
import { CreateTicketModal } from './CreateTicketModal'
import type { SupportTicket, TicketStatus } from '../../types'

interface SupportScreenProps {
  onOpenTicket: (ticketId: number) => void
}

const STATUS_BADGE: Record<TicketStatus, { label: string; cls: string }> = {
  open:        { label: 'Open',        cls: 'bg-blue-50 text-blue-600' },
  in_progress: { label: 'In Progress', cls: 'bg-zayra-mint text-zayra-teal' },
  escalated:   { label: 'Escalated',   cls: 'bg-orange-50 text-orange-500' },
  resolved:    { label: 'Resolved',    cls: 'bg-gray-100 text-gray-500' },
  closed:      { label: 'Closed',      cls: 'bg-gray-100 text-gray-400' },
}

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-red-500',
  urgent:   'bg-orange-400',
  normal:   'bg-zayra-teal',
  resolved: 'bg-gray-400',
}

type FilterOption = 'all' | 'open' | 'resolved'

const FILTERS: { id: FilterOption; label: string }[] = [
  { id: 'all',      label: 'All' },
  { id: 'open',     label: 'Open' },
  { id: 'resolved', label: 'Resolved' },
]

function TicketRow({ ticket, onPress }: { ticket: SupportTicket; onPress: () => void }) {
  const badge  = STATUS_BADGE[ticket.status] ?? STATUS_BADGE.open
  const dot    = SEVERITY_DOT[ticket.severity] ?? 'bg-gray-400'
  const hasNew = ticket.message_count > 0 && ticket.status !== 'resolved'

  return (
    <div
      onClick={onPress}
      className="card px-4 py-3 flex items-center gap-3 cursor-pointer hover:shadow-zayra transition-shadow active:scale-[0.99]"
    >
      {/* Severity dot */}
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-mono text-gray-400">{ticket.ticket_number}</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
            {badge.label}
          </span>
          {hasNew && (
            <span className="w-1.5 h-1.5 rounded-full bg-zayra-teal animate-pulse" />
          )}
        </div>
        <p className="text-sm font-semibold text-zayra-navy dark:text-white truncate">
          {ticket.title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {ticket.time_ago} · {ticket.message_count} message{ticket.message_count !== 1 ? 's' : ''}
        </p>
      </div>

      <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="card px-4 py-3 animate-pulse">
      <div className="h-3 w-24 bg-gray-100 rounded mb-2" />
      <div className="h-4 w-3/4 bg-gray-100 rounded mb-1" />
      <div className="h-3 w-1/3 bg-gray-100 rounded" />
    </div>
  )
}

export function SupportScreen({ onOpenTicket }: SupportScreenProps) {
  const { tickets, loading, error, filter, setFilter, refresh } = useSupportTickets()
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div className="px-4 pb-4 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Help & Support
          </p>
          <h2 className="font-display font-bold text-2xl text-zayra-navy dark:text-white mt-0.5">
            My Tickets
          </h2>
        </div>
        <button
          onClick={refresh}
          className="p-2 rounded-full hover:bg-zayra-mint/40 transition-colors text-gray-400"
          aria-label="Refresh tickets"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* New ticket button */}
      <button
        onClick={() => setShowCreate(true)}
        className="btn-teal w-full"
      >
        <Plus size={16} />
        New support request
      </button>

      {/* Filter pills */}
      <div className="flex gap-2">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`tag-chip text-xs py-1.5 px-3 ${filter === f.id ? 'selected' : ''}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-red-50 border border-red-100">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-500">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="space-y-2">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && tickets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-zayra-mint flex items-center justify-center">
            <MessageCircle size={22} className="text-zayra-teal" />
          </div>
          <p className="text-sm font-semibold text-zayra-navy dark:text-white">No tickets yet</p>
          <p className="text-xs text-gray-400 leading-relaxed max-w-[200px]">
            Tap the button above to contact support for any issue.
          </p>
        </div>
      )}

      {/* Ticket list */}
      {!loading && tickets.length > 0 && (
        <div className="space-y-2">
          {tickets.map(ticket => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              onPress={() => onOpenTicket(ticket.id)}
            />
          ))}
        </div>
      )}

      {/* Create ticket modal */}
      {showCreate && (
        <CreateTicketModal
          onClose={() => setShowCreate(false)}
          onCreated={(ticketId) => {
            setShowCreate(false)
            refresh()
            onOpenTicket(ticketId)
          }}
        />
      )}
    </div>
  )
}