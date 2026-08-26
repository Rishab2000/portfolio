import './ProjectHeader.css'
import type { CSSProperties } from 'react'
import { navigate } from '../lib/nav'

interface ProjectHeaderProps {
  title: string
  bgColor: string
  textColor: string
}

export default function ProjectHeader({ title, bgColor, textColor }: ProjectHeaderProps) {
  const style = {
    '--ph-bg': bgColor,
    '--ph-text': textColor,
  } as CSSProperties

  return (
    <header className="project-header" style={style}>
      <p className="project-header-title type-heading1">{title}</p>
      <button className="project-header-back type-body" onClick={() => navigate('/')}>Home</button>
    </header>
  )
}
