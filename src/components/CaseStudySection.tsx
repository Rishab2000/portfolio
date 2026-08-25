import './CaseStudySection.css'
import type { CSSProperties, ReactNode } from 'react'

interface CaseStudySectionProps {
  bgColor: string
  textColor: string
  rail?: ReactNode
  content?: ReactNode
  media?: ReactNode
  /* When true, `media` widens to cover both its own grid track and rail's, for a
     section whose media can toggle into a "wide" state (e.g. a video that spans past
     the rail column). `rail` keeps rendering in its own track underneath/beside the
     widened media — see CaseStudySection.css's `--cs-grid-toggle-h` for how a page
     avoids visually colliding rail's own content with the widened media. */
  mediaSpansRail?: boolean
}

export default function CaseStudySection({ bgColor, textColor, rail, content, media, mediaSpansRail }: CaseStudySectionProps) {
  const style = {
    '--cs-grid-bg': bgColor,
    '--cs-grid-text': textColor,
  } as CSSProperties

  return (
    <div className="cs-grid" style={style}>
      <div className="cs-grid-rail">{rail}</div>
      <div className="cs-grid-content">{content}</div>
      <div className={`cs-grid-media${mediaSpansRail ? ' cs-grid-media--wide' : ''}`}>{media}</div>
    </div>
  )
}
