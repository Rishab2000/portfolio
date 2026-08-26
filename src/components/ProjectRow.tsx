import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react'
import { navigate } from '../lib/nav'

// EXPERIMENT: each row's showcase image renders at HOVER_IMAGE_SCALE of its own
// natural pixel size (see .project-row-hover-image in HomePage.css) rather than a
// shared fixed box — so unlike Footer's hover-gif, every row's preview is a
// different size/shape depending on its source image. Flagged as a deliberate
// try-it-and-see call, not the usual "uniform thumbnail" convention.
const HOVER_IMAGE_OFFSET_X = 16
const HOVER_IMAGE_OFFSET_Y = 16
// Minimum gap kept between the image and every viewport edge once clamped.
const HOVER_IMAGE_EDGE_MARGIN = 8

interface ProjectRowProps {
  title: string
  path: string
  hoverColor?: string
  hoverTextColor?: string
  /** Cursor-following preview image shown while hovering this row — same mechanism as
   *  Footer's quote hover-gif (desktop mouse only, positioned off the cursor). Omit to
   *  disable; the row still works exactly as before. */
  showcaseImage?: string
}

export default function ProjectRow({ title, path, hoverColor, hoverTextColor, showcaseImage }: ProjectRowProps) {
  const [showImage, setShowImage] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const imgPosRef = useRef({ x: 0, y: 0 })

  const style = {
    '--row-hover-bg': hoverColor,
    '--row-hover-text': hoverTextColor,
  } as CSSProperties

  // Since every image can render at a different size (see note above), the vertical
  // offset has to be computed from this image's own rendered height — read straight off
  // the DOM (getBoundingClientRect already reflects the CSS scale() transform) rather
  // than a shared constant.
  function applyPosition() {
    const el = imgRef.current
    if (!el) return

    // First pass: the normal "anchor above-right of the cursor" position.
    let left = imgPosRef.current.x + HOVER_IMAGE_OFFSET_X
    let top = imgPosRef.current.y - el.getBoundingClientRect().height - HOVER_IMAGE_OFFSET_Y
    el.style.left = `${left}px`
    el.style.top = `${top}px`

    // Second pass: now that the actual rendered box is known at this position, nudge
    // it back onto the screen if any edge overflows — e.g. a row near the top of the
    // page, or a wide/tall image, would otherwise push it off the viewport (see the
    // "Automated calendar" row's screenshot).
    const rect = el.getBoundingClientRect()
    const margin = HOVER_IMAGE_EDGE_MARGIN
    if (rect.left < margin) left += margin - rect.left
    if (rect.right > window.innerWidth - margin) left -= rect.right - (window.innerWidth - margin)
    if (rect.top < margin) top += margin - rect.top
    if (rect.bottom > window.innerHeight - margin) top -= rect.bottom - (window.innerHeight - margin)
    el.style.left = `${left}px`
    el.style.top = `${top}px`
  }

  // Re-apply once the image has actually loaded and has real dimensions to measure —
  // before that, getBoundingClientRect().height is 0 and the position would be off.
  useLayoutEffect(() => {
    if (!showImage) return
    applyPosition()
  }, [showImage])

  const positionImage = (e: ReactMouseEvent) => {
    imgPosRef.current = { x: e.clientX, y: e.clientY }
    applyPosition()
  }

  return (
    <div
      className="project-row project-row-link"
      style={style}
      onClick={() => navigate(path)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(path) }}
      onMouseEnter={showcaseImage ? (e) => { positionImage(e); setShowImage(true) } : undefined}
      onMouseMove={showcaseImage ? positionImage : undefined}
      onMouseLeave={showcaseImage ? () => setShowImage(false) : undefined}
    >
      <p className="project-row-title project-row-text">{title}</p>
      {showcaseImage && showImage && (
        <img
          ref={imgRef}
          src={showcaseImage}
          alt=""
          aria-hidden="true"
          className="project-row-hover-image"
          onLoad={applyPosition}
        />
      )}
    </div>
  )
}
