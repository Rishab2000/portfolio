import './StackedSection.css'
import type { CSSProperties, ReactNode } from 'react'

interface StackedSectionProps {
  title: string
  /** Optional control (e.g. a toggle) right-aligned in the header, next to the title. */
  headerRight?: ReactNode
  /** Optional per-section colour override. When set, `--cs-bg` / `--cs-fg` /
   *  `--cs-hover` are applied inline to BOTH the header and the section wrapper,
   *  so a single section can break from the page's ambient theme — its header
   *  bar, its background, and any descendant that reads those vars (e.g. `.active`
   *  invert states, or a nested `CaseStudySection` if given the same colours).
   *  Omit to inherit the page theme. */
  bgColor?: string
  textColor?: string
  hoverColor?: string
  children: ReactNode
}

/**
 * Pairs an `h3.stack-head` with a `section.stack` as DOM siblings — the
 * contract `useStackingSections` relies on (see CLAUDE.md → "Component
 * architecture: integrating the stacking pattern into case study pages").
 * Content is opaque to this component; only the stacking envelope is owned here.
 */
export default function StackedSection({ title, headerRight, bgColor, textColor, hoverColor, children }: StackedSectionProps) {
  const themeStyle: CSSProperties | undefined =
    bgColor || textColor || hoverColor
      ? {
          ...(bgColor ? { '--cs-bg': bgColor } : {}),
          ...(textColor ? { '--cs-fg': textColor } : {}),
          ...(hoverColor ? { '--cs-hover': hoverColor } : {}),
        }
      : undefined

  return (
    <>
      <div className="stack-head" style={themeStyle}>
        <span>{title}</span>
        {headerRight}
      </div>
      <section className="stack" style={themeStyle}>{children}</section>
    </>
  )
}
