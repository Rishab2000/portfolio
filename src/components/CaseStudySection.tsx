import './CaseStudySection.css'
import type { CSSProperties, ReactNode } from 'react'

interface CaseStudySectionProps {
  bgColor: string
  textColor: string
  rail?: ReactNode
  content?: ReactNode
  media?: ReactNode
}

export default function CaseStudySection({ bgColor, textColor, rail, content, media }: CaseStudySectionProps) {
  const style = {
    '--cs-grid-bg': bgColor,
    '--cs-grid-text': textColor,
  } as CSSProperties

  return (
    <div className="cs-grid" style={style}>
      <div className="cs-grid-rail">{rail}</div>
      <div className="cs-grid-content">{content}</div>
      <div className="cs-grid-media">{media}</div>
    </div>
  )
}
