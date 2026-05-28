import { useState, useEffect } from 'react'

type Greeting = 'GOOD MORNING' | 'GOOD AFTERNOON' | 'GOOD EVENING'

function deriveGreeting(): Greeting {
  const hour = new Date().getHours()
  if (hour < 12) return 'GOOD MORNING'
  if (hour < 17) return 'GOOD AFTERNOON'
  return 'GOOD EVENING'
}

export function useGreeting(): Greeting {
  const [greeting, setGreeting] = useState<Greeting>(deriveGreeting)

  useEffect(() => {
    // Re-check every 60 seconds — negligible cost, ensures accuracy at boundaries
    const id = setInterval(() => setGreeting(deriveGreeting()), 60_000)
    return () => clearInterval(id)
  }, [])

  return greeting
}