import './StackedSection.css'
import type { ReactNode } from 'react'

interface StackedSectionProps {
  title: string
  /** Optional control (e.g. a toggle) right-aligned in the header, next to the title. */
  headerRight?: ReactNode
  children: ReactNode
}

/**
 * Pairs an `h3.stack-head` with a `section.stack` as DOM siblings — the
 * contract `useStackingSections` relies on (see CLAUDE.md → "Component
 * architecture: integrating the stacking pattern into case study pages").
 * Content is opaque to this component; only the stacking envelope is owned here.
 */
export default function StackedSection({ title, headerRight, children }: StackedSectionProps) {
  return (
    <>
      <div className="stack-head">
        <span>{title}</span>
        {headerRight}
      </div>
      <section className="stack">{children}</section>
    </>
  )
}
