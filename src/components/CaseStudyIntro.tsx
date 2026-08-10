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

interface CaseStudyIntroProps {
  bgColor: string
  textColor: string
  hoverColor: string
  description: string
  responsibilities: Responsibility[]
  results: ResultEntry[]
  media: MediaImage
}

export default function CaseStudyIntro({ bgColor, textColor, hoverColor, description, responsibilities, results, media }: CaseStudyIntroProps) {
  const { revealed, hovered: hoveredLink, reveal, onEnter, onLeave } = useHoverReveal<string>()

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
            <p className="cs-intro-desc type-body">{description}</p>
            <p className="cs-intro-label type-body">RESPONSIBILITIES</p>
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
            <p className="cs-intro-label type-body">RESULTS</p>
            <div className="cs-intro-results">
              {results.map((entry) => (
                <div className="cs-intro-result" key={entry.label}>
                  <p className="cs-intro-result-label type-body">{entry.label}</p>
                  <p className="cs-intro-result-stat type-heading1">{entry.stat}</p>
                </div>
              ))}
            </div>
          </div>
        }
        media={
          <div className="cs-intro-media-img" style={{ aspectRatio: media.aspect }}>
            <img src={media.src} alt={media.alt} />
          </div>
        }
      />
    </div>
  )
}
