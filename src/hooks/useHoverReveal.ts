import { useState } from 'react'

/**
 * Reveal-and-stay hover state: once a key is hovered it stays in `revealed`
 * (its content keeps rendering after the pointer moves away); `hovered`
 * tracks only the currently-active key for highlight styling. Shared by
 * CaseStudyIntro's responsibility rail and RetrospectiveSection's segments.
 */
export function useHoverReveal<T extends string>() {
  const [revealed, setRevealed] = useState<Set<T>>(new Set())
  const [hovered, setHovered] = useState<T | null>(null)

  const reveal = (key: T) => setRevealed((prev) => (prev.has(key) ? prev : new Set(prev).add(key)))
  const onEnter = (key: T) => { reveal(key); setHovered(key) }
  const onLeave = () => setHovered(null)

  return { revealed, hovered, reveal, onEnter, onLeave }
}
