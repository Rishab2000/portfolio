import { useEffect, useState } from 'react'

/**
 * Tracks whether the viewport is narrower than `maxWidth` (px). Used to gate the
 * whole app behind SmallScreenNotice below the site's supported width — the
 * layouts are tuned for a ~1512px (MacBook 14") canvas and hold down through a
 * 13" MacBook, but not far below that.
 */
export function useViewportBelow(maxWidth: number): boolean {
  const [below, setBelow] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < maxWidth,
  )

  useEffect(() => {
    const update = () => setBelow(window.innerWidth < maxWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [maxWidth])

  return below
}
