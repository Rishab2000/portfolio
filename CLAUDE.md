# CLAUDE.md

Guidance for Claude Code when working in this repo.

## Rule: typography always comes from the global `.type-*` classes

`src/index.css` defines the full type scale as classes (`.type-heading1`
through `.type-heading7`, `.type-body`, `.type-body1`, `.type-label1`,
`.type-stat1`, `.type-caption1`, `.type-caption2`) — each bundling
`font-family`, `font-weight`, `font-size`, `line-height`, and
`letter-spacing` for one step of the scale.

Never declare `font-family`, `font-size`, `font-weight`, `line-height`, or
`letter-spacing` individually in a component/page CSS file or inline style.
Apply the matching `.type-*` class in the JSX instead. **Never add a new
`.type-*` class or a new `--fs-*` token to grow the scale** — the scale is
fixed at whatever `index.css` currently defines. If no existing class
matches the Figma spec closely enough, pick the closest one anyway (nearest
`font-size` wins the tie-break) rather than introducing a new step; component
CSS should only handle layout/spacing/color for text elements, never font
declarations.

## Rule: layout spacing always comes from the global `--space-*` tokens

`src/index.css` defines the spacing scale as custom properties (`--space-0-5`
through `--space-8`: 9px, 18px, 36px, 54px, 72px, 90px, 108px, 126px, 144px —
whole multiples of one 16px body-copy line at 1.14 line-height, i.e. 18px).

Never write a fixed pixel value for `padding`, `margin`, or `gap` in a
component/page CSS file. Use the nearest `--space-*` token instead. When a
Figma spec's value falls between two tokens, round **up** to the next token
rather than hand-rolling the exact pixel number — e.g. a Figma `padding:
24px 16px` becomes `padding: var(--space-2) var(--space-1)` (36px/18px), not
`padding: 24px 16px`.

This rule covers layout spacing specifically (`padding`/`margin`/`gap`
between elements) — it does not apply to sizes that must match a specific
asset or Figma measurement exactly (image `max-width`, an icon's fixed
`width`/`height`, a hand-measured hotspot position, etc.); those stay literal
pixel values. If a spacing value genuinely can't round to an existing token
without breaking the design, that's a signal to add a new `--space-*` step
to `index.css`, the same escape hatch the typography rule above uses for
`.type-*`, rather than hand-rolling the pixel number locally.

## Rule: hover states are instant, no easing, no border-radius

Every `:hover` style change in this codebase (color, background-color, or anything else)
must apply immediately — no `transition` property, no easing curve, no delay between the
default and hovered state. Hover states also never get a `border-radius`; whatever shape
the element already has (typically a plain rectangle) stays as-is when hovered.

This means: never add `transition: ...` to a rule that only changes on `:hover`, and never
add `border-radius` to a `:hover` rule or to a base rule whose only purpose is to support a
hover state. Plain color/background swaps only.

## Reference pattern: "Stacking Sticky Sections" scroll behaviour

Source analyzed: https://laboratoire-graphique.fr/plateforme/documents/presentation-du-fonds/
(studio: Élise Gay & Kévin Donnot, dev: Kévin Donnot & Alexandre Texier — credit preserved from page source comments)

This is the reference implementation for the "middle column scrolls, side columns stay
sticky, and each section's header pins on top of the next as you scroll" effect. Use this
doc instead of re-reverse-engineering the site if the task involves building something
similar. Full downloaded source (HTML/CSS/JS) is not kept in-repo; re-fetch from the URL
above if the extracted rules below aren't enough (view-source, or the compiled asset at
`/plateforme/site/assets/pwpc/pwpc-*.css` and `.js`).

### What it looks like to a user

- The page is a vertical list of "stacked sections," each with a short `<h3>` header
  (e.g. "Le fonds conservé à la BnF") followed by a `<section>` of content.
- Scrolling down: each section header sticks to the top of the viewport (below the fixed
  site header) when its section reaches the top. As you keep scrolling, the **next**
  section's header comes up and sticks *below* the previous one — headers physically
  stack/pile up against the top of the screen like index cards, each new one landing
  underneath the last.
- Scrolling back up: headers un-stack in reverse, peeling off the bottom of the stack.
- Within an individual "integral" section, the content area is a 3-column grid: a narrow
  **notes** column (left), a wide **text** column (middle), and an **images** column
  (right). The notes/images columns are `position: sticky` — they stay pinned near the
  top of the viewport while the middle text column scrolls past underneath/behind them.
  As footnote markers and figure markers scroll through the viewport in the middle
  column, the corresponding note/figure fades in/out in the sticky side column (visibility
  is tracked per-marker, not just per-section).
- Each stacked header also renders a thin progress bar (a `::after` pseudo-element clipped
  via `clip-path`) showing how far through that section's content you've scrolled.
- Clicking a stacked header smooth-scrolls its section back to the pinned position.

### HTML structure

```html
<header class="four">
  <div id="header_leftpanel"></div>
  <div id="header_centerpanel"><h2>Page title</h2></div>
  <div id="header_rightpanel"></div>
</header>

<main>
  <h3 class="stack_head cursorblock small">Section 1 title</h3>
  <section class="stack integral">
    <div class="stack_content">
      <div class="integral_notes"></div>   <!-- populated by JS from <span class="note"> -->
      <div class="integral_text">…</div>    <!-- the actual scrolling prose -->
      <div class="integral_images"></div>  <!-- populated by JS from <span class="image"> -->
    </div>
  </section>

  <h3 class="stack_head cursorblock small">Section 2 title</h3>
  <section class="stack integral">…</section>
</main>
```

Key point: headers (`h3.stack_head`) are **siblings** of their `section.stack`, not
children. The JS relies on `header.nextElementSibling === section` to pair them. (This
project's port — see "Case study page composition" below — keeps the same sibling
contract.)

### CSS mechanics

```css
main { width: 100%; position: relative; }

header {
  position: sticky; top: 0; z-index: 5;
  display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-areas: "left center center right";
}

section.stack {
  width: 100%;
  isolation: isolate;          /* own stacking context per section */
  padding-bottom: 20px;
  border-bottom: 1px solid var(--clr-light);
}

.stack_head {
  width: 100%;
  padding: 3px 6px 20px 6px;
  background-color: var(--clr-dark);  /* opaque so stacked headers occlude content behind them */
  box-shadow: 0 -1px 1px 0 var(--clr-light);
  cursor: pointer;
  z-index: 2;
  --progress: 100%;
  /* position + top are NOT set in CSS — computed and injected by JS per header */
}

/* progress bar under each header, driven by --progress custom property */
.stack_head::before, .stack_head::after {
  content: ""; width: 100%; position: absolute; left: 0; bottom: -0.5px;
  border-style: dotted; border-image: var(--brdr-dot) 33% 33% round;
}
.stack_head::after {
  width: calc(100% - 6px);
  clip-path: inset(0 var(--progress) 0 0);   /* reveals as you scroll through the section */
}

section.stack.integral .stack_content {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 20px;
}
section.stack.integral .integral_notes  { grid-column: 1 / 3; position: sticky; /* top: injected by JS */ }
section.stack.integral .integral_text   { grid-column: 3 / 6; }
section.stack.integral .integral_images { grid-column: 6 / -1; position: sticky; /* top: injected by JS */ }
```

Notice **`position: sticky` alone does nothing here** — the actual `top` offset for every
header and every side column is computed and set inline by JS, because it depends on the
fixed header's height, the index of the section in the page, and viewport width. This is
the part worth internalizing: sticky positioning is stacking-order-sensitive (later
siblings need a larger `top` than earlier ones, or they'll overlap awkwardly instead of
stacking cleanly), so it can't be hardcoded in CSS when the number/height of sections is
dynamic.

Mobile (`max-width: 768px` in CSS, JS checks `max-width: 600px`): `.integral_notes` and
`.integral_images` are `display: none` entirely — the 3-column layout collapses to a
single scrolling text column, and notes/figures are inlined instead (see JS below).

### JS mechanics (the reference site's engine — not what this repo ended up building)

Source file: `pwpc-*.js` (second bundle), function `computeStickyness()` + a scroll
listener. The reference site keeps two ordered stacks (`stickytopstackheads` /
`stickybottomstackheads`) and toggles each header between `top`- and `bottom`-positioned
as scroll direction changes, so a header not yet reached previews pinned to the bottom of
the stack before its turn. **This project's `useStackingSections` hook (below) takes a
different, simpler approach** — pure per-frame geometry, no cross-frame state, and no
bottom-preview — because the stateful two-stack version was tried here and proved harder
to keep bug-free than it was worth. See "Hook: useStackingSections" for what was actually
built and why it diverges.

If reviving a bottom-preview affordance in the future, the two-stack model above (a state
machine with explicit promote/demote transitions) is the reference to come back to — the
"recompute everything from raw geometry every frame" approach used in this repo's hook
struggled specifically with that half of the behavior (see "History worth knowing" under
`useStackingSections` below).

## Case study page composition

Every case study page (`CaseStudyHomepage`, `CaseStudyHumanAI`, `CaseStudyAutomatedCalendar`)
is built from the same small set of shared components, wired together by two scroll-driven
hooks. **`CaseStudyHomepage.tsx` is the reference implementation** (see "Rollout status"
below); read it before building similar pages.

```
<div className="cs" style={{ '--cs-bg', '--cs-fg', '--cs-hover' }}>   ← page theming, see below
  <div className="cs-page" ref={pageRef}>        ← useStackingSections(pageRef, {...})

    <ProjectHeader />                             ← fixed page header, `fixedHeaderSelector`

    <StackedSection title="Overview">
      <CaseStudyIntro />                          ← single-viewport rail/content/media intro
    </StackedSection>

    <StackedSection title="..." headerRight={<Toggle />}>
      <RetrospectiveSection />                    ← or any bespoke section content
    </StackedSection>

    <StackedSection title="Approach">
      <CaseStudySection content={...} media={...} />   ← generic 3-col grid
    </StackedSection>

    <Footer textColor={PAGE_FG} />
  </div>
</div>
```

**Decision: every section stacks.** Every `<section>` on a case study page is wrapped in
`StackedSection` so it participates in the header-stacking/pinning system — regardless of
whether its internal layout is the content/rail/media grid (`CaseStudySection`) or
something fully bespoke (challenge grid, retrospective breakdown, art collage, etc.). The
stacking envelope (`StackedSection`) and a section's internal layout are independent
concerns; `StackedSection` never inspects or constrains its `children`.

### Rollout status

1. ✅ `StackedSection` built, `useStackingSections` generalized (`fixedHeaderSelector`
   option), `CaseStudySection.css` sticky/overflow fix landed. `ScrollStackTest`
   (`src/pages/ScrollStackTest/`) is the regression check for this layer and still passes
   `'.sst-header'` explicitly.
2. ✅ `CaseStudyHomepage` fully converted — every section (`Overview`, `Retrospective`,
   `Challenges`, `Approach`, `Design outcomes`) is a `StackedSection`.
3. ✅ `CaseStudyHumanAI` fully converted — every section (`Overview`, `Retrospective`,
   `Context`, `Aligning on the purpose`, `AI Design Principles`, `Transparency and trust`,
   `Policy recommendations`) is a `StackedSection`.
4. 🚧 `CaseStudyAutomatedCalendar` — replaces the old `CaseStudyUXRoadmap` (SD+) case
   study, built fresh on this system from the start. Only `Overview` exists so far; more
   sections land the same stepwise way as the other pages.

Work stepwise: convert one page, pause for a visual check (done by the user, not by
running the dev server) before moving to the next.

### Page theming convention

Each case study page picks its whole colour scheme as three constants at the top of the
page file and threads them down as CSS custom properties on the page root, e.g.
(`CaseStudyHomepage.tsx`):

```ts
const PAGE_BG = '#802626'
const PAGE_FG = '#f5ecc2'
const PAGE_HOVER = '#E0DEF2'
...
const pageStyle = { '--cs-bg': PAGE_BG, '--cs-fg': PAGE_FG, '--cs-hover': PAGE_HOVER } as CSSProperties
```

`--cs-bg`/`--cs-fg`/`--cs-hover` are then read directly by page-level CSS (e.g.
`.stack-head`, `.approach-para.active`, `.cs-retro-seg.active`) for the "active/hovered
item inverts to hover colour" convention used throughout (see `useHoverReveal` and the
scroll-linked active-state pattern below). Components that need their own themed instance
(`ProjectHeader`, `CaseStudyIntro`, `Footer`, `CaseStudySection`) additionally take
`bgColor`/`textColor`/`hoverColor` props directly rather than relying on inherited custom
properties, so they render correctly if reused on a page with a different scheme. Changing
a page's whole look is meant to be a two-constant edit at the top of the page file.

## Hook: `useStackingSections`

`src/hooks/useStackingSections.ts`. Give it the page's scroll container ref and the
selector for the page's fixed header:

```ts
useStackingSections(pageRef, { fixedHeaderSelector: '.project-header' })
```

It finds every `.stack-head` inside the container and pins each one at `baseOffset` (the
fixed header's height, −1px so the two 1px borders coincide into one line instead of
doubling). Mechanics, purely a function of `window.scrollY` recomputed every frame — **no
cross-frame state, so nothing can drift**:

- A header rests pinned at `baseOffset`, but is pushed *up* by the next header once that
  one rises within `stackStep` of it: `top = min(baseOffset, nextHeaderTop − scrollY −
  stackStep)`. Only one header sits at the very top at a time; the outgoing one slides up
  and disappears behind the fixed page header (higher z-index) as the incoming one takes
  its place.
- `stackStep` is the *collision* height, not the full header height: it subtracts any
  surplus bottom padding over top padding, so a header can keep a roomier resting bottom
  padding without widening the seam where two headers meet.
- Headers not yet reached just sit in normal document flow below — no preview, no bottom
  pin (see "Bottom-preview mechanism removed," below).
- On the same pass, it also computes and injects the `top` (and, for the media column, a
  `maxHeight` capped to the viewport) for any `.cs-grid-rail` / `.cs-grid-media` inside the
  section immediately following each header — this is what makes `CaseStudySection`'s rail
  and media columns stick correctly under the currently-pinned header. This no-ops
  gracefully for sections with no such elements (bespoke section content).
- Any element tagged `.cs-sticky` (in addition to, or instead of, `.cs-grid-rail`/
  `.cs-grid-media`) gets the same live-tracked `top`, plus a fixed `STICKY_OFFSET` (24px) of
  extra breathing room below the header — rail/media pin flush against it, but a sticky text
  column reads better with a small gap instead of touching the header's bottom border. This
  is the generic opt-in for a bespoke (non-`CaseStudySection`) layout that still wants the
  stick-under-header behaviour, e.g. a short text column beside a taller image with no
  rail/content/media grid involved (`CaseStudyAutomatedCalendar`'s "Interaction goal" block).
  Unlike `.cs-grid-media`, it gets no `maxHeight` cap — it un-sticks naturally once its own
  (taller) sibling scrolls the shared container out of view, rather than being clipped like a
  capped media band. The element must also declare `position: sticky` itself in its own page
  CSS (the hook only ever injects `top`, never `position`, matching rail/media).
- Recomputes on a debounced `resize` (150ms) and a `requestAnimationFrame`-throttled
  `scroll` listener.

### History worth knowing before touching `update()` again

**Bottom-preview mechanism removed (2026-07-28).** The hook used to also preview the
*next* header pinned to the bottom of the viewport before its section was reached (mirrors
the reference site's `stickybottomstackheads`). Two different selection strategies for
"which header gets the bottom slot" were tried — a global fold-line filter (which double-
pinned headers when a section was shorter than the viewport, since it could skip an index)
and, after that fix, strict sequential selection (`headers[activeIndex + 1]`, gated on
genuinely being below the fold) — but the sequential version still didn't read right in
practice: on a section much taller than one viewport, the "preview" stayed invisible for
most of the scroll and only appeared once the current section had nearly finished, not the
intended "peek the whole time" effect. **The whole mechanism is currently removed.**
Headers not yet reached just sit in normal flow with no preview.

If revisiting: the hard part is handing off cleanly between a `bottom`-pinned header and a
normal-flow header with no gap and no overlap, across sections of wildly different heights
(a 530px banner vs. a multi-thousand-px image section). Recomputing everything from raw
geometry every frame (this hook's approach) kept producing edge cases here; a discrete
state machine that only transitions on explicit promote/demote events — like the reference
site's two-stack model described above — is the more promising direction, not another
threshold tweak on the geometry approach.

Because the bottom-preview logic is gone, **sections no longer need a viewport-height
floor** — nothing in this codebase should re-add `min-height: 100vh` to make a section
"tall enough" for the stacking engine; height should always just follow content.

## Component: `StackedSection`

`src/components/StackedSection.tsx` + `.css`. Wraps any section content in the
`h3`-then-`section` sibling pair `useStackingSections` depends on:

```tsx
<StackedSection title="The art" headerRight={<Toggle />}>
  <div className="cs-art-row">...</div>   {/* whatever bespoke content the section needs */}
</StackedSection>
```

Props: `title: string` (rendered in the header), `headerRight?: ReactNode` (optional
control right-aligned next to the title — e.g. `RetrospectiveSection`'s "keep information
on screen" toggle), `children: ReactNode` (rendered inside `section.stack`, completely
opaque to this component).

Hard constraint: must keep rendering `header.nextElementSibling === section` with
`stack-head` / `stack` classes on those exact two elements — `useStackingSections` reads
the DOM by this contract, not by React refs/state. All stacked headers share one uniform
height (no separate open/active header state) so the stacking math in the hook stays
simple.

## Component: `CaseStudySection`

`src/components/CaseStudySection.tsx` + `.css`. Generic reusable 3-column grid for any
section that wants the "middle scrolls, sides stay pinned" intra-section layout:

```tsx
<CaseStudySection
  bgColor={PAGE_BG}
  textColor={PAGE_FG}
  rail={<div>...</div>}      // optional, e.g. CaseStudyIntro's responsibility descriptions,
                              // or a scroll-synced captions list — see "Scroll-linked
                              // content/media sync" below
  content={<div>...</div>}   // the scrolling column
  media={<div>...</div>}     // optional, e.g. diagrams/screenshots
/>
```

**Visual column order is always content / rail / media** (`1fr / 0.60fr / 1fr`, Figma node
264:159) regardless of the order these props are passed in JSX — `.cs-grid-content` /
`.cs-grid-rail` / `.cs-grid-media` each carry a fixed, explicit CSS `grid-column` (1 / 2 / 3)
in `CaseStudySection.css` so the component enforces this uniformly. This is a hard-won
decision: an earlier version made the order configurable per-instance (rail-first to match
some individual Figma nodes literally, rail-in-the-middle for others), but that turned into
a `railPosition` prop being set differently per call site — a "singular", per-page fix
instead of a component-level guarantee. Every 3-column instance across the whole app
(`CaseStudyIntro`'s Overview on both `CaseStudyHomepage` and `CaseStudyHumanAI`, Approach,
Design outcomes, AI Design Principles, Transparency and trust, Policy recommendations) now
gets the same order for free from the component — don't reintroduce a per-instance order
prop; if a future section's Figma disagrees, that's a conversation about changing the
convention itself, not a one-off override.

**Hard rule: every explicit `grid-column` on `.cs-grid`'s items must be paired with an
explicit `grid-row: 1`.** `.cs-grid-content` / `.cs-grid-rail` / `.cs-grid-media` all set
`grid-row: 1` for this reason — don't drop it, and give any new grid item the same
treatment. This isn't stylistic: without it, this exact grid silently splits into two rows
purely from CSS Grid's placement algorithm, with no visual collision to explain it.

The bug (found 2026-08-18, debugging the Policy recommendations Screenshot/Video toggle):
DOM order here is rail, then content, then media (required — see above). Auto-placement
processes items in that order. Rail (needing column 2) gets placed first, which advances
the placement cursor to column 3. Content (needing column 1) is processed next — but
*sparse* packing (CSS Grid's default, and this grid never opts into `dense`) never
backtracks to a column the cursor has already passed, even though column 1 is visually
empty. So content gets shoved onto an invisible new row 2, despite content/rail/media
occupying three columns that never actually overlap. Row 1 (rail alone) then sizes to
rail's own height, and row 2 (content + media) sizes to content's — meaning content's
position silently depends on rail's height. This went unnoticed until the Screenshot/Video
toggle changed whether rail showed captions, which changed rail's height, which shifted
where row 2 (and everything in it, including content) started — with `window.scrollY`
never moving, so it looked exactly like an unexplained scroll jump.

The general lesson, beyond this one grid: **once any grid item in a shared-row layout gets
an explicit position on one axis (e.g. `grid-column`) while other items in that row rely on
auto-placement for the other axis (`grid-row: auto`), and the items aren't placed in
left-to-right column order in the DOM, sparse auto-placement can silently fragment the row.**
Diagnosing it is unusually hard because nothing visually collides and no console error is
raised — `getComputedStyle(el).gridRowStart`/`gridRowEnd` also don't help, since they report
back the literal authored keyword `"auto"` for auto-placed items rather than the resolved
line, in every browser. The only reliable way to see the real placement is
`getComputedStyle(gridContainer).gridTemplateRows` (or `.gridTemplateColumns`) — the
resolved, rendered track list, which reveals extra implicit rows/columns immediately. Reach
for that first if a grid layout ever looks like it has a phantom row/column with no
CSS rule that could explain it.

`bgColor`/`textColor` become `--cs-grid-bg`/`--cs-grid-text`, so the same component renders
correctly on differently-themed pages. `.cs-grid-rail` and `.cs-grid-media` are
`position: sticky` with `top` (and, for media, `max-height`) computed and injected inline
by `useStackingSections` — they do nothing on their own without a page wired into that
hook. `.cs-grid-media` uses `align-items: flex-start` (not the `stretch` default) plus
`overflow: hidden` so images keep their natural size and only clip at the bottom of the
capped sticky panel instead of being squeezed to fit it.

**`mediaSpansRail?: boolean`** — the sanctioned way a section makes `media` widen to cover
both its own track and rail's (e.g. a video that should span past the screenshot's normal
width, `CaseStudyHumanAI`'s Policy recommendations section, Figma node 539:12499 /
539:12591). When true, `media` gets `grid-column: 2 / 4` instead of its normal single
track, via a `.cs-grid-media--wide` modifier class — `rail` keeps rendering in its own
track underneath/beside it unchanged. Since the two can now visually overlap in the same
row, a page that renders something at the top of `rail` (e.g. a toggle control) above its
normal content needs `media`'s content to start below it instead of colliding — set
`--cs-grid-toggle-h` (default `0px`, a no-op) to that content's rendered height, scoped to
just that page's grid instance (e.g. `.cs-grid:has(.ai-policyrec-notes) { --cs-grid-toggle-h:
var(--space-3); }`), rather than globally, so other `CaseStudySection` call sites are
unaffected. This is a per-item concern, not per-section — compute the boolean from
whichever paragraph/diagram is currently active (same `activeIndex` used everywhere else in
this pattern), since only one item is ever visible in `media` at a time.

`CaseStudyIntro` is a themed wrapper around one `CaseStudySection` instance (the page's
single-viewport intro). Its props are generalized past the original single-image/single-list
shape so it stays the one place this pattern lives rather than forking into bespoke JSX per
page: `description` takes a string or a string array (multiple intro paragraphs, rendered as
one tight-spaced block); an optional `characteristics: { label, items }` renders a plain
(non-hover) list above the hover-reveal list, e.g. `CaseStudyAutomatedCalendar`'s "PROJECT
CHARACTERISTICS"; `listLabel` overrides the hover-list's heading (defaults to
`'RESPONSIBILITIES'` — `CaseStudyAutomatedCalendar` passes `'LEARNINGS'`); `results` is
optional, omit it entirely to skip rendering the "RESULTS" block (`CaseStudyAutomatedCalendar`
has none); `media` takes one image or an array, stacked vertically (`CaseStudyAutomatedCalendar`
renders two). Extend this component's props again the same way for a future page's intro
rather than duplicating its hover-reveal-rail logic in bespoke page JSX — that duplication is
exactly what generalizing it here was meant to avoid.
`CaseStudyHomepage`'s "Approach" and "Design outcomes" sections use `CaseStudySection`
directly with `content`/`media` built from paragraph-array data (see "Scroll-linked
content/media sync" below) — that pattern is for a *scroll-synced* list where one paragraph is
active at a time, a different shape from `CaseStudyIntro`'s hover-reveal list where every
revealed item stays visible at once; don't conflate the two when deciding which to reach for.

## Component: `ProjectHeader`

`src/components/ProjectHeader.tsx` + `.css`. The page's fixed titlebar — `position:
sticky; top: 0`, a "Home" backlink, and the page title. Takes `bgColor`/`textColor` props
(same convention as everywhere else). This is the element every page's
`fixedHeaderSelector` (passed to `useStackingSections` and `useActiveDiagramIndex`) points
at: `.project-header`.

## Component: `Footer`

`src/components/Footer.tsx` + `.css`. Shared footer (quote + email/phone contact, with a
"click to copy email" interaction) reused verbatim across `HomePage` and all case study
pages. Takes a single `textColor: string` prop, consumed as `--footer-fg` and driving both
the text colour and both border colours — no separate border prop needed. Pick the value
per page to match its background (dark case-study pages currently all pass the same cream
`#f5ecc2`; `HomePage`, which is white, passes `#292929` to match its other dark text).

`HomePage`'s wrapper (`.layout-inner`) needed `flex-direction: column` added before
`<Footer />` could be dropped in as a second child — it defaults to `row` without it, which
put the footer beside `<main>` instead of below it. The case-study page wrappers
(`.cs-page` / `.ai-page` / `.sd-page`) already set `flex-direction: column`, so only
`HomePage` needed this fix.

## Component: `MediaLightbox`

`src/components/MediaLightbox.tsx` + `.css`. Portfolio-wide, page-agnostic full-viewport
media overlay (Figma node 515:12335): a heading and an optional numbered notes list on the
left, a large version of the triggering image/video on the right, over a fixed
`rgba(0,0,0,0.84)` scrim — regardless of the host page's own colour scheme, since the scrim
is dark on every page this has been used on so far.

```tsx
const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

// on the clickable trigger (image/video):
<button onClick={() => setLightboxIndex(i)}>...</button>

// mounted only while open — the component owns Escape-to-close, click-scrim-to-close,
// and locking document.body scroll for as long as it's mounted:
{lightboxIndex !== null && (
  <MediaLightbox
    heading={item.heading}
    notes={item.captionItems}              // optional — omit for no numbered list
    textColor={PAGE_FG}
    media={{ kind: 'video', src: ... }}     // or { kind: 'image', src: ..., alt: ... }
    onClose={() => setLightboxIndex(null)}
  />
)}
```

This is the reusable half of the pattern; the clickable trigger and the "which item is
open" state stay page-owned (`lightboxIndex` above) so each page can wire it to whatever
markup its media already has (e.g. `CaseStudyHomepage`'s outcome diagrams, which keep their
existing hover-hotspot machinery on the trigger `<button>` — the lightbox itself doesn't
know or care what the trigger looked like). Call sites so far:

- `CaseStudyHomepage`'s "Design outcomes" diagrams — the original, single-gallery
  integration; read this one first as the reference.
- `CaseStudyHumanAI`'s "Transparency and trust" and "Policy recommendations" diagrams —
  a page with **two** independent galleries, so it tracks two separate `lightboxIndex`
  states (`transparencyLightboxIndex` / `policyRecLightboxIndex`), one `MediaLightbox`
  mount per gallery. Transparency's "Always beta" item is also tabbed (two swappable
  images via `feedbackTabIndex`) — its lightbox media follows whichever tab is currently
  selected rather than a fixed image, computed once as `transparencyLightboxSrc` rather
  than re-derived inline at each usage.

## Hook: `useHoverReveal`

`src/hooks/useHoverReveal.ts`. Shared "reveal-and-stay" hover state: hovering (or tapping/
clicking, for touch) a key adds it to a `revealed` set permanently for the life of the page
view — nothing un-reveals — while a separate `hovered` value tracks only the *currently*
hovered key, for highlight styling that should track the live pointer position.

```ts
const { revealed, hovered, reveal, onEnter, onLeave } = useHoverReveal<string>()
```

Two current call sites, same hook, independently:
- **`CaseStudyIntro`'s responsibility rail** — hovering/tapping an underlined term (e.g.
  "business value") in the RESPONSIBILITIES list reveals its description as a panel in the
  left rail column, and keeps it revealed even after the pointer moves away. The rail
  renders by filtering the *original* data array to `revealed.has(key)`, not by hover
  order, so rail order always matches list order regardless of the sequence items were
  hovered in. Empty state renders nothing (no placeholder copy). A pure-CSS `:hover`
  approach was considered and rejected here — it has no memory of past hover state, so it
  can't satisfy "stays revealed."
- **`RetrospectiveSection`'s segmented breakdown row** — hovering a segment (e.g.
  "Designing ~30%") reveals a detail panel in the row directly beneath it; both rows share
  one CSS grid (`grid-template-columns` weighted by each segment's percent) so panel widths
  always line up with the segment above. Takes a `revealMode: 'stay' | 'disappear'` prop
  (driven by a checkbox toggle in the section header, `RetroRevealToggle`, rendered via
  `StackedSection`'s `headerRight` slot) so the user can switch between "stays revealed"
  (default, uses `revealed`) and "only while actively hovered" (uses `hovered` instead) —
  the one place so far where a consumer reads both values from the hook rather than just
  `revealed`. A segment whose column is too narrow for its item list (`narrow: true`, e.g.
  "Stakeholder management") breaks its panel out to a wider block below the grid instead of
  wrapping inside its own column.

## Pattern: hover-linked image annotations (circle hotspot → caption highlight)

Built for the "Design outcomes" section of `CaseStudyHomepage.tsx` (Figma node 264:159 and
its follow-on paragraph nodes 273:1238 / 273:1338). Use this pattern whenever a diagram has
numbered callout circles baked into it and hovering a circle should highlight the matching
numbered caption below the image — don't re-derive the approach from scratch.

### What it looks like to a user

Some "Design outcomes" diagrams (e.g. "Flexible architecture", "Personalisation") show a
screenshot with one or more numbered circles drawn on it (outlined by default). Hovering a
circle fills it solid (lavender) and simultaneously highlights the matching numbered item in
the caption list underneath the image. Moving the mouse away reverts both instantly — no
transition, no easing (per the hover rule above). This is one-directional only (image →
caption; hovering a caption does *not* highlight its circle) and is a no-op on touch devices,
since it's driven by real `:hover`.

### Why image-swap instead of CSS-drawn circles

Three approaches were considered: (A) draw the circles as real CSS/DOM elements on top of a
"clean" screenshot, (B) export a full image variant per hover state (what's built), (C) keep
one baked image and overlay an invisible hit-zone that also draws a CSS-matched highlight
ring on hover. **B won** because the target user (site owner) doesn't mind re-exporting from
Figma whenever a diagram changes, which removes B's only real downside. In exchange, B gives
pixel-perfect fidelity to the Figma artwork for free (no hand-tuning a CSS circle's radius/
stroke-width/position to match the baked one, which is fragile and silently drifts if the
base image is ever recropped) and needs less code than A (no clean-image re-export, no SVG
arrow replication). See git history around 2026-08-01 for the fuller tradeoff writeup if this
decision needs revisiting.

### Asset convention

Each diagram that wants hover circles gets its own subfolder under
`public/homepage-modernization/outcomes/`, containing one full-image export per state:

```
outcomes/
  flexibility/
    no_hover.png     ← default, all circles outlined
    one_hover.png    ← circle "1" filled, rest outlined
    two_hover.png    ← circle "2" filled, rest outlined
  customisation/
    no_hover.png
    one_hover.png
    two_hover.png
  widgets.png         ← diagram with no hover circles: just a flat file, no subfolder
```

A diagram with N numbered circles needs N+1 exports (`no_hover` + one `*_hover` per circle).
A diagram with no circles at all is just a single flat image path — the hover machinery
described below is entirely optional per-diagram (see the `OutcomeDiagram` type).

### Data model (`CaseStudyHomepage.tsx`)

```ts
interface OutcomeHotspot {
  xPct: number   // hit-zone center, % of image width
  yPct: number   // hit-zone center, % of image height
}

interface OutcomeDiagram {
  src: string             // default image, path relative to /homepage-modernization/outcomes/
  hovers?: string[]       // optional hover-state image per hotspot, same order as hotspots
  hotspots?: OutcomeHotspot[]  // optional hit-zone position per hotspot, same order as hovers
}
```

`hovers`/`hotspots` are omitted entirely for diagrams with no interactive circles (e.g.
"Data widgets" — just `{ src: 'widgets.png' }`).

### Measuring hotspot coordinates

There's no automated extraction — read the exported `no_hover`/`one_hover` PNGs directly
(the `Read` tool renders images inline) to find each circle's pixel center by eye, note the
image's pixel dimensions, then convert to a percentage: `xPct = pixelX / imageWidth * 100`
(same for y). Cross-check against the matching `*_hover` image — the filled circle should
sit exactly where you measured. Do **not** reach for extra tooling/dependencies (e.g.
installing an image-diffing library) for this — eyeballing the two images side by side is
sufficient and was explicitly preferred over that in practice.

### CSS mechanics (`CaseStudyHomepage.css`)

```css
.cs-outcomes-image-stack { position: relative; width: 100%; }

.cs-outcomes-image { width: 100%; height: auto; display: block; }

.cs-outcomes-image-variant {
  position: absolute;
  inset: 0;
  height: 100%;
  object-fit: cover;
  opacity: 0;                 /* hidden until its hotspot is hovered */
}

.cs-outcomes-hotspot {        /* invisible hit-zone, no visual styling at all */
  position: absolute;
  width: 5.5%;                /* tuned to roughly cover the baked circle */
  aspect-ratio: 1 / 1;
  transform: translate(-50%, -50%);
  cursor: pointer;
}

.cs-outcomes-diagram-item:has(.cs-outcomes-hotspot[data-hotspot="1"]:hover)
  .cs-outcomes-image-variant[data-variant="1"] { opacity: 1; }
.cs-outcomes-diagram-item:has(.cs-outcomes-hotspot[data-hotspot="1"]:hover)
  .cs-outcomes-caption-item[data-caption="1"] {
    background-color: var(--cs-hover);
    color: var(--cs-bg);
  }
/* repeat the pair per numbered hotspot (currently written out for 1 and 2 —
   add a 3rd pair only once a diagram actually needs a 3rd circle) */
```

The whole interaction is **pure CSS, no JS state** — the `:has()` selector reaches from the
hovered hotspot to both the sibling variant `<img>` and the sibling caption `<li>` (both live
inside the same `.cs-outcomes-diagram-item`, which is what makes this possible). This is
deliberate: it means "instant, no easing" and "no-op on touch" both come for free from native
`:hover` semantics instead of needing `useState`/event handlers to reimplement them. The
hotspot element itself never gets `border-radius` or a visible shape — it has no visual
styling at all (the circle you see is baked into the swapped image), so this doesn't
conflict with the "hover states never get border-radius" rule above; that rule is about
CSS-drawn hover shapes, not invisible hit-targets.

### Extending this pattern

To add hover circles to a new diagram: export `no_hover.png` + one `N_hover.png` per circle
into a new subfolder, measure each circle's `{xPct, yPct}` per the method above, add a
`diagram: { src, hovers, hotspots }` entry to `outcomeParagraphs`, and — only if the diagram
needs more numbered circles than any existing one — add the corresponding `data-hotspot="N"`
CSS rule pair. The JSX (`.cs-outcomes-image-stack` rendering) and existing CSS rules for
hotspots 1–2 need no changes for a diagram that reuses 1 or 2 circles.

## Pattern: scroll-linked content/media sync (`useActiveDiagramIndex`)

Used by `CaseStudyHomepage`'s "Approach" and "Design outcomes" sections: a tall scrolling
column of paragraphs on the left/content side, paired one-to-one with a diagram/media item
on the right that should swap to match whichever paragraph is currently "active" (scrolled
up under the pinned header stack), while that active paragraph also highlights itself.

### `useActiveDiagramIndex`

`src/hooks/useActiveDiagramIndex.ts`. Same `requestAnimationFrame`-throttled,
`getBoundingClientRect`-driven approach as `useStackingSections`, deliberately kept
standalone rather than merged into that hook (different job: tracking one active index
into a data array, not managing sticky offsets).

```ts
const activeIndex = useActiveDiagramIndex(contentRef, {
  paragraphSelector: '.approach-para',
  fixedHeaderSelector: '.project-header',
  offsetPx: 130,
})
```

It computes one `activationLine` (fixed header height + this section's own `.stack-head`
height + `offsetPx` slack) and, every scroll frame, picks the *last* paragraph whose top has
crossed that line as `activeIndex`. `offsetPx` is extra breathing room past the pinned
header stack before a paragraph counts as active — tune per-section if the swap feels early
or late; `130` matched Approach/Design outcomes acceptably but isn't a universal constant.

### `useProportionalHeight`

`src/hooks/useProportionalHeight.ts`. The scrolling paragraph column driving `activeIndex`
above needs extra empty scroll distance below its last paragraph, or that paragraph never
gets its own turn as active before the section ends. A flat `vh` height (the original
approach) makes that runway proportional to the *screen*, not the *content* — three short
paragraphs and six long ones got the same scroll distance. This hook sets an explicit height
equal to the element's own natural content height × `(1 + extraRatio)` instead:

```ts
const contentRef = useRef<HTMLDivElement>(null)
useProportionalHeight(contentRef, 0.5)   // → natural height × 1.5
const activeIndex = useActiveDiagramIndex(contentRef, { ... })
```

Call it right after declaring the ref, before (or after — order doesn't matter, see below)
the matching `useActiveDiagramIndex` call. `extraRatio` is `0.5` everywhere it's used so far
(`CaseStudyHomepage`'s Approach/Design outcomes, `CaseStudyHumanAI`'s AI Design
Principles/Transparency and trust/Policy recommendations) except `CaseStudyAutomatedCalendar`
(`0.2` — a deliberate one-off, not yet reconciled with the rest). The paragraph column's CSS
must NOT set its own `height` (leave it out entirely so the hook's measurement of "natural"
height isn't reading back a value it already forced).

Uses `useLayoutEffect`, not `useEffect` — this is what makes call order vs.
`useStackingSections`/`useActiveDiagramIndex` (both plain `useEffect`) not matter: React
guarantees every `useLayoutEffect` across the whole component tree fires before any
`useEffect`, so the height is always committed before either of those hooks measures layout,
regardless of which hook was called first in the component body.

### Consumer convention (`CaseStudyHomepage.tsx` + its `.css`)

Both `content` and `media` are built by mapping the same paragraph-array data and tagging
the `i === activeIndex` element with an `active` class — the hook only tracks the index,
all the visual behavior is plain CSS reacting to that one class:

```tsx
{approachParagraphs.map((p, i) => (
  <div className={`approach-para${i === activeDiagramIndex ? ' active' : ''}`} key={p.heading}>
    ...
  </div>
))}
```

```css
.approach-para.active { background-color: var(--cs-hover); color: var(--cs-bg); }  /* content side: invert */

.cs-approach-diagram-item { display: none; }     /* media side: swap, not fade */
.cs-approach-diagram-item.active { display: flex; }
```

The content-side paragraph inverts colour (same "active item inverts to `--cs-hover`"
convention as `useHoverReveal` consumers), while the media-side item hard-swaps via
`display: none/flex` rather than crossfading — matches the instant/no-easing hover rule in
spirit even though this is scroll-driven, not hover-driven. `.cs-approach-paras` /
`.cs-outcomes-paras` need enough scroll distance below the last paragraph for every
paragraph to get its own turn as active before the section ends — given via
`useProportionalHeight(ref, 0.5)` (see below), not a flat `vh` value.

Reuse this pattern (hook + `.active` class + hard-swap media) for any future section shaped
like "scrolling list of paragraphs paired with a swapping visual," rather than reaching for
an `IntersectionObserver`-per-item or a carousel library.

### Rail as a third synced column: numbered captions

When a section's diagram needs numbered callouts (e.g. "1. Widgets can be moved without
disrupting spacing…"), those captions go in `CaseStudySection`'s `rail` slot — the real
middle column (see "Component: `CaseStudySection`" above) — not stacked underneath the image
inside `media`. Rail sits between content and media for exactly this reason: content (text)
| captions | image, matching the source Figma layout for every section that has captions
(`CaseStudyHomepage`'s Design outcomes; `CaseStudyHumanAI`'s AI Design Principles,
Transparency and trust, Policy recommendations).

The rail content is a **third** consumer of the same `activeIndex` from
`useActiveDiagramIndex` — mapped from the identical paragraph array, hard-swapped exactly
like the media column (not inverted like the content column):

```tsx
rail={
  <div className="cs-outcomes-notes">
    {outcomeParagraphs.map((p, i) => (
      <div key={p.label} className={`cs-outcomes-note-item${i === activeOutcomeIndex ? ' active' : ''}`}>
        {p.captionItems && (
          <ol className="cs-outcomes-caption-list">
            {p.captionItems.map((item, idx) => (
              <li className="cs-outcomes-caption-item" key={idx}>
                <span className="type-caption1 cs-outcomes-caption-num">{idx + 1}</span>
                <span className="type-caption1 cs-outcomes-caption-text">{item}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    ))}
  </div>
}
```

```css
.cs-outcomes-notes { width: 100%; }
.cs-outcomes-note-item { display: none; width: 100%; }
.cs-outcomes-note-item.active { display: block; }
```

`captionItems` on the paragraph type is optional — a paragraph with no captions for that
particular diagram just renders an empty (but still correctly `active`-toggled) note item.
Every current instance names these four classes per its own page-prefix (e.g.
`ai-principles-notes` / `ai-principles-note-item` on `CaseStudyHumanAI`) rather than sharing
`CaseStudyHomepage`'s literal `cs-outcomes-*` names, continuing that page's one-namespace-
per-section convention — but the shape (wrapper + per-item `display: none`/`.active { display:
block }` + the `type-caption1` num/text spans) should stay identical for any new section that
needs captions.
