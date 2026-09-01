import './CaseStudySection.css'
import type { CSSProperties, ReactNode } from 'react'

interface CaseStudySectionProps {
  /* Optional — when omitted, `.cs-grid` inherits `--cs-bg` / `--cs-fg` from a
     themed ancestor (e.g. StackedSection's bgColor/textColor props, set on
     `.stack`). Pass explicitly only to theme the grid independently of the
     section it sits in. */
  bgColor?: string
  textColor?: string
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
    ...(bgColor ? { '--cs-grid-bg': bgColor } : {}),
    ...(textColor ? { '--cs-grid-text': textColor } : {}),
  } as CSSProperties

  return (
    <div className="cs-grid" style={style}>
      <div className="cs-grid-rail">{rail}</div>
      <div className="cs-grid-content">{content}</div>
      <div className={`cs-grid-media${mediaSpansRail ? ' cs-grid-media--wide' : ''}`}>{media}</div>
    </div>
  )
}
