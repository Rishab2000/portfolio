import { useLayoutEffect, type RefObject } from 'react'

const RESIZE_DEBOUNCE_MS = 150

/**
 * Sets an explicit height on the element equal to its own natural (content)
 * height plus `extraRatio` more — e.g. extraRatio=0.2 means natural height ×
 * 1.2 — instead of a fixed viewport-relative `vh` value.
 *
 * Scroll-linked paragraph columns (see useActiveDiagramIndex) need extra
 * empty scroll distance below their last paragraph so it gets its own turn
 * as "active" before the section ends, but a flat `vh` number makes that
 * runway proportional to the screen, not to how much content is actually
 * there — three short paragraphs and six long ones end up with the same
 * scroll distance. This makes it scale with the content instead.
 *
 * Uses useLayoutEffect (not useEffect) so the height is committed before any
 * *passive* effect elsewhere measures layout — useStackingSections and
 * useActiveDiagramIndex both use plain useEffect, and React guarantees every
 * useLayoutEffect across the whole tree fires before any useEffect, so this
 * is safe regardless of hook-call order relative to those.
 */
export function useProportionalHeight(ref: RefObject<HTMLElement | null>, extraRatio: number): void {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    function apply() {
      // Clear first so a previous pass's explicit height can't be measured
      // as the "natural" height.
      el!.style.height = ''
      const natural = el!.offsetHeight
      el!.style.height = `${Math.round(natural * (1 + extraRatio))}px`
    }

    apply()

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null
    function onResize() {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(apply, RESIZE_DEBOUNCE_MS)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      if (resizeTimeout) clearTimeout(resizeTimeout)
    }
  }, [ref, extraRatio])
}
