import './CaseStudyIntro.css'
import type { CSSProperties } from 'react'
import CaseStudySection from './CaseStudySection'
import { useHoverReveal } from '../hooks/useHoverReveal'

interface Responsibility {
  prefix: string
  link: string
  description: string
}

interface ResultEntry {
  label: string
  stat: string
}

interface MediaImage {
  src: string
  alt: string
  aspect: string
}

/** Optional plain (non-hover) list rendered above the hover-reveal list — e.g.
 * Automated calendar's "PROJECT CHARACTERISTICS". */
interface CharacteristicsList {
  label: string
  items: string[]
}

interface CaseStudyIntroProps {
  bgColor: string
  textColor: string
  hoverColor: string
  /** One or more intro paragraphs, rendered as a single tight-spaced block. */
  description: string | string[]
  characteristics?: CharacteristicsList
  /** Label above the hover-reveal list — defaults to 'RESPONSIBILITIES'. */
  listLabel?: string
  responsibilities: Responsibility[]
  /** Omit entirely to skip the "RESULTS" block (e.g. Automated calendar has none). */
  results?: ResultEntry[]
  /** One image (existing pages) or several, stacked vertically (e.g. Automated calendar). */
  media: MediaImage | MediaImage[]
}

export default function CaseStudyIntro({
  bgColor,
  textColor,
  hoverColor,
  description,
  characteristics,
  listLabel = 'RESPONSIBILITIES',
  responsibilities,
  results,
  media,
}: CaseStudyIntroProps) {
  const { revealed, hovered: hoveredLink, reveal, onEnter, onLeave } = useHoverReveal<string>()

  const descParagraphs = Array.isArray(description) ? description : [description]
  const mediaItems = Array.isArray(media) ? media : [media]

  const style = {
    '--cs-intro-bg': bgColor,
    '--cs-intro-text': textColor,
    '--cs-intro-hover': hoverColor,
  } as CSSProperties

  return (
    <div className="cs-intro" style={style}>
      <CaseStudySection
        bgColor={bgColor}
        textColor={textColor}
        rail={
          <div className="cs-intro-rail">
            {responsibilities
              .filter((r) => revealed.has(r.link))
              .map((r) => (
                <div
                  className={`cs-intro-rail-item type-caption1${r.link === hoveredLink ? ' active' : ''}`}
                  key={r.link}
                >
                  <p className="cs-intro-rail-heading">{r.link}</p>
                  <p className="cs-intro-rail-desc">{r.description}</p>
                </div>
              ))}
          </div>
        }
        content={
          <div className="cs-intro-content">
            <div className="cs-intro-desc">
              {descParagraphs.map((p, i) => (
                <p className="type-body" key={i}>{p}</p>
              ))}
            </div>

            {characteristics && (
              <>
                <p className="cs-intro-label type-body">{characteristics.label}</p>
                <ul className="cs-intro-plain-list">
                  {characteristics.items.map((item) => (
                    <li className="type-body" key={item}>
                      <span className="dot">⋅</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <p className="cs-intro-label type-body">{listLabel}</p>
            <ul className="cs-intro-resp">
              {responsibilities.map((r) => (
                <li className="type-body" key={r.link}>
                  <span className="dot">⋅</span>
                  <span>{r.prefix} <span
                    className="u"
                    onMouseEnter={() => onEnter(r.link)}
                    onMouseLeave={onLeave}
                    onClick={() => reveal(r.link)}
                  >{r.link}</span></span>
                </li>
              ))}
            </ul>

            {results && (
              <>
                <p className="cs-intro-label type-body">RESULTS</p>
                <div className="cs-intro-results">
                  {results.map((entry) => (
                    <div className="cs-intro-result" key={entry.label}>
                      <p className="cs-intro-result-label type-body">{entry.label}</p>
                      <p className="cs-intro-result-stat type-heading1">{entry.stat}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        }
        media={
          <div className="cs-intro-media">
            {mediaItems.map((m, i) => (
              <div className="cs-intro-media-img" style={{ aspectRatio: m.aspect }} key={i}>
                <img src={m.src} alt={m.alt} />
              </div>
            ))}
          </div>
        }
      />
    </div>
  )
}
