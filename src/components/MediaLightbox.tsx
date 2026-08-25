import './MediaLightbox.css'
import { useEffect } from 'react'

export type LightboxMedia =
  | { kind: 'image'; src: string; alt: string }
  | { kind: 'video'; src: string }

interface MediaLightboxProps {
  heading: string
  /** Optional body copy rendered directly under the heading, both sharing one flex
   *  container (gap: var(--space-1)) separate from the notes list below. */
  description?: string
  notes?: string[]
  media: LightboxMedia
  textColor: string
  onClose: () => void
}

/**
 * Full-viewport media overlay (Figma node 515:12335): heading + an optional
 * numbered notes list on the left, a large version of the triggering image/
 * video on the right, over a fixed dark scrim. Portfolio-wide reusable piece
 * — any page wires its own click handler to mount this with the clicked
 * item's content; this component owns only the overlay itself (Escape-to-
 * close, click-scrim-to-close, and locking the page scroll behind it while
 * mounted).
 *
 * First built for `CaseStudyHomepage`'s "Design outcomes" diagrams — see that
 * page for a reference call site.
 */
export default function MediaLightbox({ heading, description, notes, media, textColor, onClose }: MediaLightboxProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    // Lock the page scroll behind the overlay while it's mounted.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div
      className="media-lightbox"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClose()
      }}
      role="button"
      tabIndex={0}
      aria-label="Close"
    >
      <div className="media-lightbox-info" style={{ color: textColor }}>
        <div className="media-lightbox-heading-group">
          <p className="type-heading1 media-lightbox-heading">{heading}</p>
          {description && <p className="type-body media-lightbox-description">{description}</p>}
        </div>
        {notes && (
          <ol className="media-lightbox-notes">
            {notes.map((item, idx) => (
              <li className="media-lightbox-note-item" key={idx}>
                <span className="type-caption1 media-lightbox-note-num">{idx + 1}</span>
                <span className="type-caption1 media-lightbox-note-text">{item}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
      <div className="media-lightbox-media">
        {media.kind === 'video' ? (
          <video src={media.src} autoPlay loop muted playsInline />
        ) : (
          <img src={media.src} alt={media.alt} />
        )}
      </div>
    </div>
  )
}
