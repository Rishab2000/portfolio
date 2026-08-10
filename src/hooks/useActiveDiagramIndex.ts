import { useEffect, useState, type RefObject } from 'react'

const RESIZE_DEBOUNCE_MS = 150
const DEFAULT_OFFSET_PX = 50

interface UseActiveDiagramIndexOptions {
  /** CSS selector (within containerRef) for each paragraph block. */
  paragraphSelector: string
  /** CSS selector (document-wide) for the page's fixed header. */
  fixedHeaderSelector: string
  /** Extra px past the pinned header stack before a paragraph is considered active. */
  offsetPx?: number
}

/**
 * Tracks which paragraph in a scrolling content column has scrolled up to
 * overlap the pinned header stack (fixed page header + this section's own
 * `.stack-head`), so a sibling media column can swap to match it. Same
 * rAF-throttled getBoundingClientRect approach as useStackingSections,
 * deliberately kept standalone rather than merged into that hook.
 */
export function useActiveDiagramIndex(
  containerRef: RefObject<HTMLElement | null>,
  { paragraphSelector, fixedHeaderSelector, offsetPx = DEFAULT_OFFSET_PX }: UseActiveDiagramIndexOptions,
): number {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const fixedHeader = document.querySelector<HTMLElement>(fixedHeaderSelector)
    const stackHead = container.closest('.stack')?.previousElementSibling

    let paragraphs: HTMLElement[] = []
    let activationLine = 0

    function update() {
      let index = 0
      for (let i = 0; i < paragraphs.length; i++) {
        if (paragraphs[i].getBoundingClientRect().top <= activationLine) index = i
      }
      setActiveIndex(index)
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

  return activeIndex
}
