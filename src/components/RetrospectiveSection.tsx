import './RetrospectiveSection.css'
import type { CSSProperties } from 'react'
import { useHoverReveal } from '../hooks/useHoverReveal'

export interface RetroSegment {
  label: string
  percent: string
  items: string[]
  /** True when this segment's column is too narrow for its item list to read comfortably —
   *  its panel breaks out to a wider, centered block below the grid instead of wrapping
   *  inside its own column (Figma node 264:209, "Stakeholder management" segment). */
  narrow?: boolean
  /** Per-segment override for how far the narrow breakout (and its horizontal top-border
   *  line) spills past its own column, as a percentage of that column's width — sets
   *  --cs-retro-breakout-width (default 146.5, see RetrospectiveSection.css) just for this
   *  segment's breakout instead of every narrow segment on every page. Only meaningful when
   *  narrow is true. A segment with no neighbouring column on one side (e.g. the last
   *  segment in the row) has less room to spill on that side before running past the
   *  section's own outer edge — check visually before pushing this too high. */
  breakoutWidthPct?: number
  /** Segments sharing the same groupKey act as one reveal unit (CaseStudyAutomatedCalendar's
   *  "Core logic" row, Figma node 597:3510 etc.): hovering/tapping any of them highlights all
   *  of them together, and their panels merge into a single panel spanning their combined
   *  columns instead of one per segment. Only the FIRST segment carrying a given groupKey
   *  supplies the merged panel's percent/items — later segments in the group can leave items
   *  empty, since they render no panel of their own. Segments must be adjacent in the array
   *  for the merged panel's column span to be contiguous. Omit for the default one-segment-
   *  one-panel behaviour (every existing caller). */
  groupKey?: string
}

interface RetrospectiveSectionProps {
  segments: RetroSegment[]
  /** 'stay' (default): panel stays revealed after hovering away. 'disappear': panel only shows while actively hovered. */
  revealMode?: 'stay' | 'disappear'
  /** Section height (any valid CSS length, e.g. '60vh') — no default, set explicitly per
   *  call site rather than baked into RetrospectiveSection.css. Omit for natural
   *  content height. */
  height?: string
  /** Discoverability cue shown under the first (leftmost) segment with a vertical arrow
   *  pointing up at it — the hover interaction isn't otherwise visible. Rendered only until
   *  the viewer hovers any segment for the first time (`revealed` is empty), then gone for
   *  the life of the page view. Omit to show no hint. */
  hint?: string
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

/** The reveal-state key for a segment — grouped segments share one key so hovering/tapping
 *  any of them reveals/highlights the whole group together. */
function revealKeyOf(s: RetroSegment): string {
  return s.groupKey ?? s.label
}

export default function RetrospectiveSection({ segments, revealMode = 'stay', height, hint }: RetrospectiveSectionProps) {
  const { revealed, hovered, onEnter, onLeave } = useHoverReveal<string>()

  const gridTemplateColumns = segments
    .map((s) => `minmax(0, ${parsePercentWeight(s.percent)}fr)`)
    .join(' ')

  return (
    <div className="cs-section cs-retro-section" style={height ? { height } : undefined}>
      <div
        className="cs-retro-grid"
        style={{ gridTemplateColumns }}
      >
        {segments.map((s) => (
          <div
            key={s.label}
            className={`cs-retro-seg type-body${revealKeyOf(s) === hovered ? ' active' : ''}`}
            onMouseEnter={() => onEnter(revealKeyOf(s))}
            onMouseLeave={onLeave}
            onClick={() => onEnter(revealKeyOf(s))}
          >
            {s.label}
          </div>
        ))}

        {segments.map((s, i) => {
          // Only the first segment of a group renders a panel — it spans every column
          // the group covers instead of each grouped segment getting its own.
          const isGroupStart = !s.groupKey || segments.findIndex((x) => x.groupKey === s.groupKey) === i
          if (!isGroupStart) return null
          const groupEndIndex = s.groupKey ? segments.map((x) => x.groupKey).lastIndexOf(s.groupKey) : i
          const span = groupEndIndex - i + 1
          const key = revealKeyOf(s)

          return (
            <div
              key={s.label}
              className={`cs-retro-panel${s.narrow ? ' cs-retro-panel--narrow' : ''}`}
              style={span > 1 ? { gridColumn: `${i + 1} / span ${span}` } : undefined}
            >
              {(revealMode === 'stay' ? revealed.has(key) : hovered === key) && (
                <>
                  <div className="cs-retro-panel-rule type-body">{s.percent}</div>
                  {!s.narrow && (
                    s.items.length === 1 ? (
                      <p className="cs-retro-panel-text type-body">{s.items[0]}</p>
                    ) : (
                      <ul className="cs-retro-panel-list">
                        {s.items.map((item) => (
                          <li className="type-body" key={item}>
                            <span>⋅</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  )}
                </>
              )}
            </div>
          )
        })}

        {segments.map(
          (s, i) =>
            s.narrow &&
            (revealMode === 'stay' ? revealed.has(revealKeyOf(s)) : hovered === revealKeyOf(s)) && (
              <div
                key={`${s.label}-breakout`}
                className="cs-retro-breakout"
                style={{
                  gridColumn: i + 1,
                  ...(s.breakoutWidthPct !== undefined && { '--cs-retro-breakout-width': `${s.breakoutWidthPct}%` }),
                } as CSSProperties}
              >
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

      {hint && revealed.size === 0 && (
        <p className="cs-retro-hint type-body">
          {hint}
          <span className="cs-retro-hint-arrow" aria-hidden="true">↑</span>
        </p>
      )}
    </div>
  )
}
