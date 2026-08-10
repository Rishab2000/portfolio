# Homepage footer — design spec

Date: 2026-08-05

## Problem

`HomePage` doesn't render the shared `Footer` component that all three case study
pages already use. A first attempt added `<Footer />` as a sibling of `<main>` inside
`.layout-inner`, which broke the page layout.

## Root causes found

1. **Layout:** `.layout-inner` (`HomePage.css`) is `display: flex` with no
   `flex-direction` set, so it defaults to `row`. Adding `<Footer />` as a second child
   put it side-by-side with `<main>` instead of below it. The case-study pages'
   equivalent wrapper (`.cs-page` / `.ai-page` / `.sd-page`) explicitly sets
   `flex-direction: column`, so they never hit this.
2. **Color:** `Footer.css` hardcodes cream (`#f5ecc2`) for text and both borders
   (`.cs-footer` `border-top`, `.cs-footer-copied` border). That only reads correctly
   against a dark page background (e.g. `CaseStudyHomepage`'s `#802626`).
   `HomePage`'s background is white, so reused as-is the footer would be near-illegible.

## Design

### 1. `.layout-inner` layout fix (`HomePage.css`)

Add `flex-direction: column` and a `gap` matching `.main-content`'s existing
responsive rhythm (160px desktop, 56px mobile — same breakpoints already defined in
that file) so `<Footer />` stacks below `<main>` with consistent spacing.

### 2. `Footer` becomes themeable (`Footer.tsx` / `Footer.css`)

Add a new required prop:

```ts
interface FooterProps {
  textColor: string
}
```

Consumed the same way `ProjectHeader` consumes `bgColor`/`textColor` — set as a CSS
custom property inline on the root element:

```tsx
const style = { '--footer-fg': textColor } as CSSProperties
```

`Footer.css` replaces every hardcoded `#f5ecc2` with `var(--footer-fg)`:
- `.cs-footer` → `color`
- `.cs-footer` → `border-top` color
- `.cs-footer-copied` → `border` color

One prop drives both text and border color together — no separate border prop.

### 3. Call site updates

- `CaseStudyHomepage.tsx`: `<Footer textColor={PAGE_FG} />` (`PAGE_FG` is already
  `#f5ecc2`) — pixel-identical to today.
- `CaseStudyHumanAI.tsx`: `<Footer textColor="#f5ecc2" />` — pixel-identical to today.
  Not addressing that page's own text/background contrast; out of scope here.
- `CaseStudyUXRoadmap.tsx`: `<Footer textColor="#f5ecc2" />` — pixel-identical to today,
  same reasoning.
- `HomePage.tsx`: `<Footer textColor="#292929" />`, rendered as the second child of
  `.layout-inner`, immediately after `</main>`. `#292929` matches the dark color already
  used elsewhere on the page (`.hero-heading-name`, `.project-row-text`).

## Out of scope

- Fixing any pre-existing contrast issues on `CaseStudyHumanAI` / `CaseStudyUXRoadmap`
  (not confirmed broken, and not what was asked).
- Any change to `Footer`'s copy (quote/email/phone text) — homepage reuses it verbatim.
