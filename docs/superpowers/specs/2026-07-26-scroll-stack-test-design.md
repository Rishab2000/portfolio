# Scroll stacking-sections test page — design

Reference: `CLAUDE.md` → "Reference pattern: Stacking Sticky Sections" (reverse-engineered
from laboratoire-graphique.fr). This spec is for a standalone page to prototype/validate
that scroll behavior in this codebase before it's adopted on a real page.

## Problem

We documented the "stacking sticky headers + sticky rail/media columns" scroll pattern in
CLAUDE.md but have never built it. We need a page to test it works as described, reusing
the existing `CaseStudySection` (rail/content/media) component for the 3-column part,
since that component already models the same notes/text/images structure as the reference
site's `.integral_notes/.integral_text/.integral_images`.

## Scope

In scope:
- Multiple sections stacking their headers on top of each other while scrolling down,
  unstacking in reverse while scrolling up (the core ask).
- Within each section, the `CaseStudySection` rail and media columns pin via
  `position: sticky` while the content column scrolls normally between them.

Out of scope (confirmed with user):
- The `--progress` clip-path progress bar under each header.
- The footnote/figure scroll-linked visibility toggling system — that's specific to the
  reference site's archival-document content model, not relevant here.

Not a route change to any existing page. Existing `CaseStudySection` / `CaseStudyIntro`
components and their CSS are untouched.

## Route

`App.tsx` gains one more path check, following the existing pattern:

```tsx
if (path === '/scroll-test') return <ScrollStackTest />
```

URL-only — no link from `HomePage`. Reached by navigating directly to
`/scroll-test` (dev) or `/portfolio/scroll-test` (built, since `nav.ts` is base-aware).

## New files

- `src/pages/ScrollStackTest/ScrollStackTest.tsx`
- `src/pages/ScrollStackTest/ScrollStackTest.css`
- `src/hooks/useStackingSections.ts`

## Page structure

```tsx
export default function ScrollStackTest() {
  const containerRef = useRef<HTMLDivElement>(null)
  useStackingSections(containerRef)

  return (
    <div className="scroll-stack-test" ref={containerRef}>
      <header className="sst-header">Scroll stack test</header>
      <main>
        <h3 className="stack-head">Section one</h3>
        <section className="stack">
          <CaseStudySection
            bgColor="#1c1c1c" textColor="#f2f2f2"
            rail={<SampleRail n={1} />}
            content={<SampleContent n={1} />}
            media={<SampleMedia n={1} />}
          />
        </section>
        {/* repeat for sections two..five, alternating bgColor so section
            boundaries are visually obvious while testing */}
      </main>
    </div>
  )
}
```

Five sample sections, alternating background colors (e.g. two tones) so it's visually
unambiguous when one section's header has stacked under another and where one section
ends and the next begins. Placeholder copy (not real case-study content) — e.g. "Section
N" headers, 2-3 filler paragraphs per content column, 2-4 placeholder colored blocks per
media column (no real images needed to test scroll mechanics).

## `useStackingSections` hook

Signature: `useStackingSections(containerRef: RefObject<HTMLElement>): void`

Ported from the reference site's `computeStickyness()` + scroll listener (see CLAUDE.md
for the full breakdown of the source logic). Operates on:
- `.stack-head` elements found within `containerRef.current`.
- Each one's `nextElementSibling` (`.stack` section) — the same sibling-pairing
  assumption the reference site uses.
- Within each `.stack` section, `.cs-grid-rail` and `.cs-grid-media` (from the nested
  `CaseStudySection`) as the sticky side columns.

Behavior:
1. **`computeStickyness()` equivalent** — runs on mount and on debounced (150ms) resize.
   For each `.stack-head` at `index`:
   - `baseOffset` = height of `.sst-header` (the fixed page header playing the role of
     the reference site's `<header>`).
   - `stackStep` ≈ `stackHead.offsetHeight * 0.6` (increment per stacked header, same
     ratio as source).
   - `top = baseOffset + index * stackStep`, written to `style.top` and cached (data
     attribute or a parallel array — implementation detail, not user-visible) for the
     bottom-anchored case.
   - `bottom` mirrored from the tail end, same as source's `data-bottom` computation.
   - Header classified into a "stuck-top" or "stuck-bottom" ordered list based on
     whether it's currently in the viewport, exactly as source does with
     `stickytopstackheads`/`stickybottomstackheads`.
   - For the `.stack` section immediately following each header, set
     `.cs-grid-rail` and `.cs-grid-media`'s `style.top` to
     `header top + header height + gap` so they pin directly below the stacked header.
2. **Scroll handler**, `requestAnimationFrame`-throttled (mirror the `isTicking` guard):
   detect direction, and on crossing a section boundary, flip the relevant header
   between `top`-anchored (in the "stuck-top" list) and `bottom`-anchored (in the
   "stuck-bottom" list), moving it between the two lists — this is what produces the
   piling/un-piling illusion in both scroll directions.
3. Cleanup: remove the scroll/resize listeners on unmount.

State ownership: everything is imperative DOM writes via the container ref and
`querySelectorAll` within it — no React state updates per scroll tick. This intentionally
deviates from typical React data flow for performance reasons (a 60fps-firing state
update would cause a re-render cascade); it mirrors the reference site's own vanilla-JS
approach. This is the one hook in the codebase that works this way — documented here so
it doesn't look like an accident later.

## CSS

New rules, scoped under `.scroll-stack-test` in `ScrollStackTest.css` so nothing leaks
into the shared `CaseStudySection.css`:

```css
.scroll-stack-test .stack-head {
  position: sticky;
  /* top/bottom set inline by the hook */
  z-index: 2;
  background: #1c1c1c; /* fixed, page-level color — same as source, where every
                           .stack_head shares one constant background regardless of
                           which section it belongs to; must stay opaque so a stacked
                           header occludes the section scrolling up behind it */
}

.scroll-stack-test .stack {
  isolation: isolate; /* own stacking context per section, matches source */
}

.scroll-stack-test .cs-grid-rail,
.scroll-stack-test .cs-grid-media {
  position: sticky;
  /* top set inline by the hook */
}
```

`.sst-header` itself is `position: sticky; top: 0` — the fixed reference point every
offset is computed against, playing the role of the reference site's global `<header>`.

## Testing / verification

No automated tests (this is a visual/interaction prototype, matching how the rest of the
portfolio is verified). Verification is manual: run the dev server, navigate to
`/scroll-test`, and confirm:
- Scrolling down: each section header sticks under the previous one, piling up.
- Scrolling up: headers un-stack in reverse order.
- Within a section, rail/media stay pinned while content scrolls between them.
- Resize the window and confirm offsets recompute correctly (debounced).

## Rejected alternative

Building the sticky mechanics directly into `CaseStudySection`/`CaseStudySection.css`
instead of a separate hook + scoped page styles. Rejected because `CaseStudySection` is
already used by `CaseStudyIntro` on all three live case-study pages with different
(non-scroll-linked) behavior — coupling the shared component to this experimental
mechanic would risk regressing those pages before the pattern is validated.
