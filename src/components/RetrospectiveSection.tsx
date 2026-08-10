import './RetrospectiveSection.css'
import { useHoverReveal } from '../hooks/useHoverReveal'

export interface RetroSegment {
  label: string
  percent: string
  items: string[]
  /** True when this segment's column is too narrow for its item list to read comfortably —
   *  its panel breaks out to a wider, centered block below the grid instead of wrapping
   *  inside its own column (Figma node 264:209, "Stakeholder management" segment). */
  narrow?: boolean
}

interface RetrospectiveSectionProps {
  segments: RetroSegment[]
  /** 'stay' (default): panel stays revealed after hovering away. 'disappear': panel only shows while actively hovered. */
  revealMode?: 'stay' | 'disappear'
}

interface RetroRevealToggleProps {
  /** true = 'stay' mode ("Keep information on screen" checked/underlined) */
  checked: boolean
  onToggle: () => void
}

/**
 * "Keep information on screen" checkbox toggle (Figma node 353:2248 checked /
 * 353:2242 unchecked) — lives in the Retrospective section's header, next to
 * its title, so it's rendered via StackedSection's `headerRight` slot rather
 * than as a child of RetrospectiveSection itself. Controls the `revealMode`
 * passed into RetrospectiveSection from the parent page.
 */
export function RetroRevealToggle({ checked, onToggle }: RetroRevealToggleProps) {
  return (
    <button type="button" className="cs-retro-toggle" aria-pressed={checked} onClick={onToggle}>
      <span className="cs-retro-toggle-label type-body">Keep information on screen</span>
      <span className="cs-retro-toggle-box">
        <span className="cs-retro-toggle-fill" />
        <span className="cs-retro-toggle-dot" />
      </span>
    </button>
  )
}

/**
 * Segmented breakdown row (Figma node 287:1738 / 264:209). Hovering a
 * segment reveals a detail panel directly beneath its own column
 * (reveal-and-stay, matching CaseStudyIntro's responsibility rail) — both
 * rows share one grid so the panel column widths always line up with the
 * segment above them.
 */
/** Extracts the numeric weight from a percent string (e.g. "~30%" -> 30); falls back to an equal share when unparseable (e.g. "TBD"). */
function parsePercentWeight(percent: string): number {
  const match = percent.match(/\d+(\.\d+)?/)
  return match ? parseFloat(match[0]) : 1
}

export default function RetrospectiveSection({ segments, revealMode = 'stay' }: RetrospectiveSectionProps) {
  const { revealed, hovered, onEnter, onLeave } = useHoverReveal<string>()

  const gridTemplateColumns = segments
    .map((s) => `minmax(0, ${parsePercentWeight(s.percent)}fr)`)
    .join(' ')

  return (
    <div className="cs-section cs-retro-section">
      <div
        className="cs-retro-grid"
        style={{ gridTemplateColumns }}
      >
        {segments.map((s) => (
          <div
            key={s.label}
            className={`cs-retro-seg type-body${s.label === hovered ? ' active' : ''}`}
            onMouseEnter={() => onEnter(s.label)}
            onMouseLeave={onLeave}
            onClick={() => onEnter(s.label)}
          >
            {s.label}
          </div>
        ))}

        {segments.map((s) => (
          <div key={s.label} className={`cs-retro-panel${s.narrow ? ' cs-retro-panel--narrow' : ''}`}>
            {(revealMode === 'stay' ? revealed.has(s.label) : hovered === s.label) && (
              <>
                <div className="cs-retro-panel-rule type-body">{s.percent}</div>
                {!s.narrow && (
                  <ul className="cs-retro-panel-list">
                    {s.items.map((item) => (
                      <li className="type-body" key={item}>
                        <span>⋅</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        ))}

        {segments.map(
          (s, i) =>
            s.narrow &&
            (revealMode === 'stay' ? revealed.has(s.label) : hovered === s.label) && (
              <div key={`${s.label}-breakout`} className="cs-retro-breakout" style={{ gridColumn: i + 1 }}>
                <ul className="cs-retro-panel-list">
                  {s.items.map((item) => (
                    <li className="type-body" key={item}>
                      <span>⋅</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
        )}
      </div>
    </div>
  )
}
