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
  // -1 = not yet reached (no paragraph has crossed the activation line yet) — i.e. this
  // section's own header hasn't reached the top yet. Consumers compare `i === activeIndex`
  // in a .map(), so -1 naturally means nothing matches and nothing is marked active yet,
  // with no consumer-side changes needed.
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const fixedHeader = document.querySelector<HTMLElement>(fixedHeaderSelector)
    const stackHead = container.closest('.stack')?.previousElementSibling

    let paragraphs: HTMLElement[] = []
    let activationLine = 0

    function update() {
      let index = -1
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
      // Each paragraph is click-to-scroll (see onParagraphClick) — flag it as such.
      paragraphs.forEach((p) => {
        p.style.cursor = 'pointer'
      })
      update()
    }

    // Clicking a paragraph smooth-scrolls it up to the activation line — the same
    // position scrolling there naturally would make it `active` — so the previous
    // paragraph ends just out of view above the pinned header stack, and the
    // synced media/notes columns swap to match. Delegated so it needs no
    // per-paragraph bookkeeping across recomputes. Clicks on an interactive
    // control inside a paragraph are left alone.
    function onParagraphClick(e: MouseEvent) {
      const target = e.target as Element | null
      if (!target) return
      if (target.closest('button, a, input, label, select, textarea')) return
      const para = target.closest<HTMLElement>(paragraphSelector)
      if (!para || !paragraphs.includes(para)) return
      const delta = para.getBoundingClientRect().top - activationLine
      window.scrollTo({ top: window.scrollY + delta + 2, behavior: 'smooth' })
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
    container.addEventListener('click', onParagraphClick)

    return () => {
      document.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      container.removeEventListener('click', onParagraphClick)
      if (resizeTimeout) clearTimeout(resizeTimeout)
    }
  }, [containerRef, paragraphSelector, fixedHeaderSelector, offsetPx])

  return activeIndex
}
