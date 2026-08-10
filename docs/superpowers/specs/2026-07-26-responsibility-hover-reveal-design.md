# Responsibility hover-reveal — design

Figma: node 165:397 ("MacBook Pro 14 - 35"), file VQlMKH4DWH87cZ0JASPuyO.

## Problem

In `CaseStudyIntro`, the RESPONSIBILITIES list (e.g. "Defined *business value*") renders underlined terms that currently do nothing. Per Figma, hovering an underlined term should reveal its description in the left rail column, which is presently unused (empty).

## Data model

Extend `Responsibility` in `src/components/CaseStudyIntro.tsx`:

```ts
interface Responsibility {
  prefix: string
  link: string
  description: string
}
```

`CaseStudyHomepage.tsx` supplies `description` for each of its six entries, sourced from the Figma rail copy:

| link | description |
|---|---|
| business value | Simpler management flows makes it an attractive purchase for smaller businesses, expanding our market scope |
| user research | Initiated MaaS360's first ever user interviews to initiate a customer focused approach and process |
| C-suite consensus | Advocated the business and user value of modernisation to leadership to ensure development prioritisation. |
| design framework | Designed a scalable UI framework that ensured consistency to future developments to the homepage |
| dev ready mockups | Seamlessly transitioned from design to development, supported the dev team in shipping a design accurate output |
| user feedback sessions | Regularly reviewed designs with customers to ensure quality and alignment with expectations and requirements. |

## State & interaction

`CaseStudyIntro` owns `const [revealed, setRevealed] = useState<Set<string>>(new Set())`, keyed by `r.link` (already unique; already used as the `<li>` key).

The underlined `<span className="u">` gets:
- `onMouseEnter={() => reveal(r.link)}` — desktop hover
- `onClick={() => reveal(r.link)}` — touch tap (also fires on desktop click, harmless)

`reveal` does a `Set` add. Adds are idempotent and there is no remove path — once revealed, an item's description stays visible for the life of the page view (sticky/accumulating), per approved design.

## Rendering & order

The rail renders by mapping the **original** `responsibilities` array (list order) and filtering to `revealed.has(r.link)`:

```tsx
responsibilities
  .filter((r) => revealed.has(r.link))
  .map((r) => (
    <div className="cs-intro-rail-item" key={r.link}>
      <p className="cs-intro-rail-heading">{r.link}</p>
      <p className="cs-intro-rail-desc">{r.description}</p>
    </div>
  ))
```

This guarantees rail order always matches list order, regardless of the sequence in which items were hovered/tapped (e.g. hovering "user research" before "business value" still renders "user research" below the slot "business value" would occupy).

Empty state: render nothing (no placeholder copy) when `revealed` is empty.

This rail content is passed to `CaseStudySection` via its existing (currently unused) `rail` prop — no changes needed to `CaseStudySection` or the grid layout.

## Styling

New rules in `CaseStudyIntro.css`:
- `.cs-intro-rail-item` / `.cs-intro-rail-heading` / `.cs-intro-rail-desc` sized with `--fs-caption1` (12px), matching the Figma rail (vs. `--fs-body` used elsewhere in the component). Heading uses `text-transform: uppercase` and an indent, description does not, matching Figma's block structure.
- `.cs-intro-resp .u` gains `cursor: pointer` as an affordance that the underlined terms are interactive.

## Scope

Change is contained to `CaseStudyIntro.tsx` / `.css` and the `responsibilities` data in `CaseStudyHomepage.tsx`. `CaseStudySection` is unchanged. Other case study pages (`CaseStudyHumanAI`, `CaseStudyUXRoadmap`) don't currently use `CaseStudyIntro`, so they're unaffected but would get this behavior for free if they adopt it later.

## Rejected alternative

CSS-only (`:hover` + sibling selectors) was ruled out: it has no memory of past hover state, so it cannot satisfy the sticky/accumulating reveal requirement.
