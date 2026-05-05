import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function useDashboard() {
  const metrics = useQuery({
    queryKey: ['health-metrics'],
    queryFn: api.health.getMetrics,
  })

  const timeline = useQuery({
    queryKey: ['timeline'],
    queryFn: api.health.getTimeline,
  })

  const circle = useQuery({
    queryKey: ['circle'],
    queryFn: api.circle.getMembers,
  })

  const journeys = useQuery({
    queryKey: ['journeys'],
    queryFn: api.community.getJourneys,
  })

  const stories = useQuery({
    queryKey: ['stories'],
    queryFn: api.stories.getAll,
  })

  const rhythm = useQuery({
    queryKey: ['rhythm'],
    queryFn: api.rhythm.getStreak,
  })

  const alynaChat = useQuery({
    queryKey: ['alyna-chat'],
    queryFn: api.alyna.getChat,
  })

  return {
    metrics,
    timeline,
    circle,
    journeys,
    stories,
    rhythm,
    alynaChat,
    isLoading: metrics.isLoading || timeline.isLoading,
  }
}
