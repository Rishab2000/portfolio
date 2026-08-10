import type { CSSProperties } from 'react'
import { navigate } from '../lib/nav'

interface ProjectRowProps {
  title: string
  path: string
  hoverColor?: string
  hoverTextColor?: string
}

export default function ProjectRow({ title, path, hoverColor, hoverTextColor }: ProjectRowProps) {
  const style = {
    '--row-hover-bg': hoverColor,
    '--row-hover-text': hoverTextColor,
  } as CSSProperties

  return (
    <div
      className="project-row project-row-link"
      style={style}
      onClick={() => navigate(path)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(path) }}
    >
      <p className="project-row-title project-row-text">{title}</p>
    </div>
  )
}
