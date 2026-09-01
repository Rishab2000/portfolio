import { useEffect, useState, type RefObject } from 'react'

const RESIZE_DEBOUNCE_MS = 150
const DEFAULT_OFFSET_PX = 50

interface UseScrollRevealProgressOptions {
  /** CSS selector (within containerRef) for each paragraph block. */
  paragraphSelector: string
  /** CSS selector (document-wide) for the page's fixed header. */
  fixedHeaderSelector: string
  /** Extra px past the pinned header stack before progress starts counting. */
  offsetPx?: number
}

/**
 * Companion to useActiveDiagramIndex: instead of "which paragraph is active",
 * returns a continuous 0 → 1 of how far the scrolling content column has moved
 * through its paragraphs — 0 when the FIRST paragraph's top reaches the pinned-
 * header activation line, 1 when the LAST one's top does (and clamped either
 * side). Same rAF-throttled getBoundingClientRect geometry as
 * useActiveDiagramIndex; kept standalone so a section can take the fractional
 * progress, the active index, or both (CaseStudyHumanAI's "Aligning on the
 * purpose" uses the progress to drive the North star's top-down wipe reveal).
 */
export function useScrollRevealProgress(
  containerRef: RefObject<HTMLElement | null>,
  { paragraphSelector, fixedHeaderSelector, offsetPx = DEFAULT_OFFSET_PX }: UseScrollRevealProgressOptions,
): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const fixedHeader = document.querySelector<HTMLElement>(fixedHeaderSelector)
    const stackHead = container.closest('.stack')?.previousElementSibling

    let paragraphs: HTMLElement[] = []
    let activationLine = 0

    function update() {
      if (paragraphs.length < 2) {
        const reached =
          paragraphs.length === 1 && paragraphs[0].getBoundingClientRect().top <= activationLine
        setProgress(reached ? 1 : 0)
        return
      }
      const firstTop = paragraphs[0].getBoundingClientRect().top
      const lastTop = paragraphs[paragraphs.length - 1].getBoundingClientRect().top
      const span = lastTop - firstTop
      const raw = span > 0 ? (activationLine - firstTop) / span : 0
      setProgress(Math.min(1, Math.max(0, raw)))
    }

    function computeActivationLine() {
      const fixedHeaderHeight = fixedHeader?.offsetHeight ?? 0
      const stackHeadHeight = stackHead instanceof HTMLElement ? stackHead.offsetHeight : 0
      activationLine = fixedHeaderHeight + stackHeadHeight + offsetPx
      paragraphs = Array.from(container!.querySelectorAll<HTMLElement>(paragraphSelector))
      update()
    }

    computeActivationLine()

    let isTicking = false
    function onScroll() {
      if (isTicking) return
      isTicking = true
      requestAnimationFrame(() => {
        update()
        isTicking = false
      })
    }

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null
    function onResize() {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(computeActivationLine, RESIZE_DEBOUNCE_MS)
    }

    document.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)

    return () => {
      document.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (resizeTimeout) clearTimeout(resizeTimeout)
    }
  }, [containerRef, paragraphSelector, fixedHeaderSelector, offsetPx])

  return progress
}
