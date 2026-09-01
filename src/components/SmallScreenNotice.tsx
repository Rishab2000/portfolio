import { useEffect, useRef, useState } from 'react'
import './SmallScreenNotice.css'

// Kept in sync with Footer.tsx — same address, same copy interaction.
const EMAIL = 'rishabsachidanand@gmail.com'
const COPIED_TIMEOUT_MS = 3000

/**
 * Full-viewport fallback shown (via useViewportBelow in App) when the window is
 * narrower than the site's supported width. Figma node 712:9069.
 */
export default function SmallScreenNotice() {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(EMAIL).catch(() => {})
    setCopied(true)
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setCopied(false), COPIED_TIMEOUT_MS)
  }

  return (
    <div className="ssn">
      <div className="ssn-message">
        <p className="type-heading1">
          Glad you’re visiting my little space on the internet! Thought I’m
          inclusive of all devices, I’m smoothening of rough edges of my
          responsiveness.
        </p>
        <p className="type-heading1">
          Till then a laptop (or a wider window) offers the best experience!
        </p>
      </div>

      <div className="ssn-contact">
        <p className="type-body">Get in touch:</p>
        {copied ? (
          <p className="type-body ssn-copied">Email copied. One step closer.</p>
        ) : (
          <button type="button" className="ssn-email type-body" onClick={handleCopyEmail}>
            rishabsachidanand@gmail
          </button>
        )}
        <p className="type-body">+41 77 289 62 24</p>
      </div>
    </div>
  )
}
