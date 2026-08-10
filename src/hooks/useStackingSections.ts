import { useEffect, type RefObject } from 'react'

const RESIZE_DEBOUNCE_MS = 150
const RAIL_MEDIA_GAP_PX = 20

interface StackedHeader {
  el: HTMLElement
  /** Document-absolute top of the header's natural (in-flow) position. Stable; cached on layout. */
  naturalTop: number
}

interface UseStackingSectionsOptions {
  /** CSS selector (within containerRef) for the page's fixed/sticky header, used to compute the base offset. */
  fixedHeaderSelector: string
}

/**
 * Stacking sticky section headers (see CLAUDE.md → "Reference pattern:
 * Stacking Sticky Sections").
 *
 * Each header is `position: sticky` with a `top` offset recomputed every
 * scroll frame purely from geometry (cached natural position vs
 * window.scrollY), so no cross-frame state can drift: a header rests pinned
 * at `baseOffset`, but is pushed UP by the next header once that one rises
 * within a header-height — `top = min(baseOffset, nextHeaderViewportTop −
 * stackStep)`. So only one header sits at the top at a time, and the
 * outgoing one slides up and disappears behind the fixed page header (higher
 * z-index) as the incoming one takes its place — the "pushed in" illusion.
 * Headers not yet reached just sit in normal document flow below.
 *
 * (There used to also be a "preview the next header pinned at the bottom
 * edge before its turn" mechanism here. Pulled out for now — it kept
 * producing bugs — see CLAUDE.md if reviving it.)
 */
export function useStackingSections(
  containerRef: RefObject<HTMLElement | null>,
  { fixedHeaderSelector }: UseStackingSectionsOptions,
): void {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const fixedHeader = container.querySelector<HTMLElement>(fixedHeaderSelector)

    let headers: StackedHeader[] = []
    let stackStep = 0
    let baseOffset = 0

    // Recompute every header's top offset from the current scroll position.
    // Pure function of scrollY — safe to call every frame.
    function update() {
      const scrollY = window.scrollY

      // Pinned at baseOffset, but shoved up by the next header as it arrives.
      headers.forEach((h, i) => {
        const next = headers[i + 1]
        const pushedTop = next ? next.naturalTop - scrollY - stackStep : baseOffset
        h.el.style.top = `${Math.min(baseOffset, pushedTop)}px`
      })
    }

    function computeStickyness() {
      const els = Array.from(container!.querySelectorAll<HTMLElement>('.stack-head'))

      // Measure natural positions with the inline top cleared, so a previous
      // pass's offset can't shift a header and corrupt the reading. The
      // getBoundingClientRect calls below force the reflow that applies this.
      els.forEach((el) => {
        el.style.top = ''
      })

      // −1px so a pinned section header's top border tucks behind the fixed
      // page header and coincides with the page header's bottom border, instead
      // of the two 1px borders reading as one thick 2px line where they meet.
      baseOffset = fixedHeader ? fixedHeader.offsetHeight - 1 : 0
      // stackStep is the collision height, NOT the full header height: headers
      // stack/collide as if the bottom padding matched the (smaller) top
      // padding, so any surplus bottom padding (paddingBottom − paddingTop)
      // tucks behind the incoming header instead of widening the seam where
      // they meet. Lets the header keep a roomier resting bottom padding.
      if (els.length > 0) {
        const cs = getComputedStyle(els[0])
        const surplusBottomPadding = Math.max(0, parseFloat(cs.paddingBottom) - parseFloat(cs.paddingTop))
        stackStep = els[0].offsetHeight - surplusBottomPadding
      } else {
        stackStep = 0
      }
      // Rail/media sticky columns pin just below the single top header, which
      // always rests at baseOffset. This MUST run BEFORE measuring naturalTop
      // below: capping the media column shrinks any section whose media was its
      // tallest column, so measuring first would cache header positions from
      // the un-capped (taller) layout.
      els.forEach((el) => {
        const section = el.nextElementSibling
        if (section instanceof HTMLElement && section.classList.contains('stack')) {
          const railMediaTop = Math.round(baseOffset + el.offsetHeight + RAIL_MEDIA_GAP_PX)
          const rail = section.querySelector<HTMLElement>('.cs-grid-rail')
          const media = section.querySelector<HTMLElement>('.cs-grid-media')
          if (rail) rail.style.top = `${railMediaTop}px`
          if (media) {
            media.style.top = `${railMediaTop}px`
            // Cap the media column to the visible sticky band — from where it
            // pins (railMediaTop) down to the bottom of the viewport — so it's
            // shorter than the section and can actually stick (a column as
            // tall as the section has no slack to pin against).
            const mediaMaxHeight = Math.max(0, Math.round(window.innerHeight - railMediaTop))
            media.style.maxHeight = `${mediaMaxHeight}px`
          }
        }
      })

      // Measure natural positions against the FINAL (capped) layout.
      // getBoundingClientRect forces the reflow that applies the caps above.
      const scrollY = window.scrollY
      headers = els.map((el) => ({
        el,
        naturalTop: Math.round(el.getBoundingClientRect().top + scrollY),
      }))

      update()
    }

    computeStickyness()

    // TEMP DIAGNOSTIC — remove after confirming/rejecting the font-swap hypothesis.
    if (fixedHeader) {
      console.log('[stacking-debug] initial fixedHeader.offsetHeight =', fixedHeader.offsetHeight, 'fonts.status =', document.fonts.status)
      document.fonts.ready.then(() => {
        console.log('[stacking-debug] fonts.ready fixedHeader.offsetHeight =', fixedHeader.offsetHeight, 'fonts.status =', document.fonts.status)
      })
    }

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
      resizeTimeout = setTimeout(computeStickyness, RESIZE_DEBOUNCE_MS)
    }

    document.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)

    return () => {
      document.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (resizeTimeout) clearTimeout(resizeTimeout)
    }
  }, [containerRef, fixedHeaderSelector])
}
