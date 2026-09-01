import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react'
import './Footer.css'

const EMAIL = 'rishabsachidanand@gmail.com'
const COPIED_TIMEOUT_MS = 3000
const HOVER_GIF_HEIGHT = 150 // keep in sync with .cs-footer-hover-gif height in Footer.css
const HOVER_GIF_OFFSET_X = 16
const HOVER_GIF_OFFSET_Y = 16

interface FooterProps {
  textColor: string
  /** Optional footer background — consumed as `--footer-bg`. Omit to stay
   *  transparent (the footer then shows through to the page background). */
  bgColor?: string
}

export default function Footer({ textColor, bgColor }: FooterProps) {
  const [copied, setCopied] = useState(false)
  const [showGif, setShowGif] = useState(false)
  const timeoutRef = useRef<number | undefined>(undefined)
  const gifRef = useRef<HTMLImageElement>(null)
  const gifPosRef = useRef({ x: 0, y: 0 })
  const style = {
    '--footer-fg': textColor,
    ...(bgColor ? { '--footer-bg': bgColor } : {}),
  } as CSSProperties

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  // Apply the last known cursor position as soon as the gif mounts, so it
  // appears in the right place on the very first frame instead of jumping
  // there on the next mousemove.
  useLayoutEffect(() => {
    if (!showGif) return
    const el = gifRef.current
    if (!el) return
    el.style.left = `${gifPosRef.current.x + HOVER_GIF_OFFSET_X}px`
    el.style.top = `${gifPosRef.current.y - HOVER_GIF_HEIGHT - HOVER_GIF_OFFSET_Y}px`
  }, [showGif])

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(EMAIL).catch(() => {})
    setCopied(true)
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setCopied(false), COPIED_TIMEOUT_MS)
  }

  const positionGif = (e: ReactMouseEvent) => {
    gifPosRef.current = { x: e.clientX, y: e.clientY }
    const el = gifRef.current
    if (!el) return
    el.style.left = `${e.clientX + HOVER_GIF_OFFSET_X}px`
    el.style.top = `${e.clientY - HOVER_GIF_HEIGHT - HOVER_GIF_OFFSET_Y}px`
  }

  return (
    <footer className="cs-footer" style={style}>
      <div
        className="cs-footer-quote"
        onMouseEnter={(e) => {
          positionGif(e)
          setShowGif(true)
        }}
        onMouseMove={positionGif}
        onMouseLeave={() => setShowGif(false)}
      >
        <p className="type-heading1">{`"You miss 100% of the shots you don't take - Wayne Gretzky"`}</p>
        <p className="type-body cs-footer-quote-author">- Micheal G Scott</p>
        {showGif && (
          <img
            ref={gifRef}
            src="/footer/hover.gif"
            alt=""
            aria-hidden="true"
            className="cs-footer-hover-gif"
          />
        )}
      </div>
      <div className="cs-footer-contact">
        {copied ? (
          <p className="type-body cs-footer-copied">Email copied. One step closer.</p>
        ) : (
          <p className="type-body">{`So don't hesitate to say "HI"`}</p>
        )}
        <p className="type-body">
          <button type="button" className="cs-footer-email type-body" onClick={handleCopyEmail}>{EMAIL}</button>
          {' | +41 77 289 62 24'}
        </p>
      </div>
    </footer>
  )
}
