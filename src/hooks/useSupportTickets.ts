// =============================================================================
// src/hooks/useSupportTickets.ts
// All state and logic for the patient support ticket list.
// Follows the same pattern as useDashboard.ts — state in one object,
// actions as stable callbacks.
// =============================================================================

import { useState, useCallback, useEffect } from 'react'
import { api, ApiError } from '../services/api'
import type { SupportTicket } from '../types'

type StatusFilter = 'all' | 'open' | 'resolved'

interface SupportTicketsState {
  tickets: SupportTicket[]
  loading: boolean
  error: string | null
  filter: StatusFilter
}

export function useSupportTickets() {
  const [state, setState] = useState<SupportTicketsState>({
    tickets: [],
    loading: true,
    error: null,
    filter: 'all',
  })

  const fetchTickets = useCallback(async (filter: StatusFilter = 'all') => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const statusParam = filter === 'all' ? undefined : filter
      const data = await api.support.getMyTickets(statusParam)
      setState(prev => ({ ...prev, tickets: data.results, loading: false }))
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Failed to load tickets.'
      setState(prev => ({ ...prev, loading: false, error: msg }))
    }
  }, [])

  // Load tickets on mount
  useEffect(() => { fetchTickets('all') }, [fetchTickets])

  const setFilter = useCallback((filter: StatusFilter) => {
    setState(prev => ({ ...prev, filter }))
    fetchTickets(filter)
  }, [fetchTickets])

  const refresh = useCallback(() => fetchTickets(state.filter), [fetchTickets, state.filter])

  return { ...state, setFilter, refresh }
}