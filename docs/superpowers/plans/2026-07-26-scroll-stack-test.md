# Scroll Stack Test Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone `/scroll-test` page that prototypes the "stacking sticky headers + sticky rail/media columns" scroll pattern documented in `CLAUDE.md`, reusing the existing `CaseStudySection` component for the 3-column layout.

**Architecture:** A new route (`ScrollStackTest` page) renders five sample sections, each an `<h3 className="stack-head">` sibling followed by a `<section className="stack">` wrapping a `CaseStudySection`. A new hook, `useStackingSections`, imperatively measures and positions the headers and the section's `.cs-grid-rail`/`.cs-grid-media` columns via direct DOM writes (not React state), ported from the reference site's `computeStickyness()` + scroll-listener logic already broken down in `CLAUDE.md`.

**Tech Stack:** React 19 + TypeScript, Vite, plain CSS (existing project conventions — CSS custom properties for spacing/type scale, no CSS framework).

## Global Constraints

- No automated test framework exists in this repo (`package.json` has no test runner) and the approved spec (`docs/superpowers/specs/2026-07-26-scroll-stack-test-design.md`) explicitly calls for manual verification, not automated tests. Every task below substitutes "run `npm run build` (type-checks + bundles) and manually verify in the browser" for the usual write-test/run-test steps.
- Route is URL-only: `/scroll-test` in dev, no link added anywhere in the existing UI (per approved spec).
- `CaseStudySection.tsx` / `CaseStudySection.css` and `CaseStudyIntro.*` must not be modified — all new sticky CSS is scoped under `.scroll-stack-test` in the new page's own CSS file.
- Progress bar (`--progress` clip-path) and footnote/figure visibility toggling are explicitly out of scope — do not implement them.
- Follow existing project conventions: page components live in `src/pages/<Name>/<Name>.tsx` + co-located `.css`; routing is the manual `if (path === ...)` chain in `App.tsx`; spacing/type use the `--space-*` / `--fs-*` custom properties defined in `src/index.css`.

---

### Task 1: Route wiring + page skeleton

**Files:**
- Create: `src/pages/ScrollStackTest/ScrollStackTest.tsx`
- Create: `src/pages/ScrollStackTest/ScrollStackTest.css`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: default-exported `ScrollStackTest` component (no props) for Task 2/3 to build on, and route path `'/scroll-test'` for later manual verification.

- [ ] **Step 1: Create the page skeleton**

```tsx
// src/pages/ScrollStackTest/ScrollStackTest.tsx
import './ScrollStackTest.css'

export default function ScrollStackTest() {
  return (
    <div className="scroll-stack-test">
      <header className="sst-header">
        <p>Scroll stack test</p>
      </header>
      <main>
        <p className="sst-placeholder">Sections go here (Task 2).</p>
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Create the base stylesheet**

```css
/* src/pages/ScrollStackTest/ScrollStackTest.css */

.scroll-stack-test {
  width: 100%;
  min-height: 100vh;
  background: #0a0a0a;
  color: #f2f2f2;
  font-family: inherit;
}

.sst-header {
  position: sticky;
  top: 0;
  z-index: 5;
  padding: var(--space-1);
  background: #0a0a0a;
  border-bottom: 1px solid #f2f2f2;
}

.sst-placeholder {
  padding: var(--space-1);
}
```

- [ ] **Step 3: Wire the route into `App.tsx`**

Add the import alongside the other page imports (`src/App.tsx:1-6`):

```tsx
import ScrollStackTest from './pages/ScrollStackTest/ScrollStackTest'
```

Add the route check alongside the other `if (path === ...)` lines (`src/App.tsx:21-23`), before the final `return <HomePage />`:

```tsx
if (path === '/scroll-test') return <ScrollStackTest />
```

- [ ] **Step 4: Verify it builds and renders**

Run: `npm run build`
Expected: exits 0, no TypeScript errors.

Run: `npm run dev`, then open `http://localhost:5173/scroll-test` in a browser.
Expected: a dark page with a sticky "Scroll stack test" header at the top and the placeholder line below it.

- [ ] **Step 5: Commit**

```bash
git add src/pages/ScrollStackTest/ScrollStackTest.tsx src/pages/ScrollStackTest/ScrollStackTest.css src/App.tsx
git commit -m "Add /scroll-test route with page skeleton"
```

---

### Task 2: Sample stacked sections (static, no sticky behavior yet)

**Files:**
- Modify: `src/pages/ScrollStackTest/ScrollStackTest.tsx`
- Modify: `src/pages/ScrollStackTest/ScrollStackTest.css`

**Interfaces:**
- Consumes: `CaseStudySection` from `src/components/CaseStudySection.tsx` — props `{ bgColor: string; textColor: string; rail?: ReactNode; content?: ReactNode; media?: ReactNode }`.
- Produces: five `.stack-head` / `.stack` sibling pairs in the DOM, each `.stack` containing a `CaseStudySection` whose rendered output includes `.cs-grid-rail` and `.cs-grid-media` elements — these class names are what Task 3's hook queries for. No positioning logic yet; sections render in normal document flow.

- [ ] **Step 1: Replace the placeholder with five sample sections**

```tsx
// src/pages/ScrollStackTest/ScrollStackTest.tsx
import './ScrollStackTest.css'
import CaseStudySection from '../../components/CaseStudySection'

interface SampleSection {
  id: number
  title: string
  bgColor: string
  textColor: string
}

const SECTIONS: SampleSection[] = [
  { id: 1, title: 'Section one — orange', bgColor: '#bb7125', textColor: '#fcf3cf' },
  { id: 2, title: 'Section two — navy', bgColor: '#12354e', textColor: '#f99d1b' },
  { id: 3, title: 'Section three — purple', bgColor: '#9a72aa', textColor: '#f5ecc2' },
  { id: 4, title: 'Section four — forest', bgColor: '#112f2c', textColor: '#fdd4bd' },
  { id: 5, title: 'Section five — orange again', bgColor: '#bb7125', textColor: '#fcf3cf' },
]

function SampleRail({ id }: { id: number }) {
  return (
    <div className="sst-rail">
      <p className="sst-rail-item">Rail note {id}.1 — stays pinned while the text column scrolls</p>
      <p className="sst-rail-item">Rail note {id}.2 — this is the left sticky column</p>
      <p className="sst-rail-item">Rail note {id}.3 — same mechanism as the reference site's notes column</p>
    </div>
  )
}

function SampleContent({ id }: { id: number }) {
  return (
    <div className="sst-content">
      <p>
        This is section {id} of the scroll stack test. Scroll down and this section&rsquo;s
        header should stick to the top of the viewport, directly below any headers from
        sections above it that are already stuck.
      </p>
      <p>
        Keep scrolling and the next section&rsquo;s header will slide up and pin itself just
        underneath this one, piling the headers up like index cards. Scroll back up and they
        should peel off again in reverse order.
      </p>
      <p>
        While this text column scrolls, the rail column to the left and the media column to
        the right should stay pinned in place, tracking just below the stacked header for
        this section.
      </p>
      <p>
        This paragraph exists purely to give the section enough height to scroll through —
        section {id} needs to be taller than the viewport for the sticky effect to be
        visible at all.
      </p>
    </div>
  )
}

function SampleMedia({ id, textColor }: { id: number; textColor: string }) {
  return (
    <>
      <div className="sst-media-block" style={{ background: textColor }}>
        <span>{id}.A</span>
      </div>
      <div className="sst-media-block" style={{ background: textColor }}>
        <span>{id}.B</span>
      </div>
    </>
  )
}

export default function ScrollStackTest() {
  return (
    <div className="scroll-stack-test">
      <header className="sst-header">
        <p>Scroll stack test</p>
      </header>
      <main>
        {SECTIONS.map((s) => (
          <div key={s.id}>
            <h3 className="stack-head">{s.title}</h3>
            <section className="stack">
              <CaseStudySection
                bgColor={s.bgColor}
                textColor={s.textColor}
                rail={<SampleRail id={s.id} />}
                content={<SampleContent id={s.id} />}
                media={<SampleMedia id={s.id} textColor={s.textColor} />}
              />
            </section>
          </div>
        ))}
      </main>
    </div>
  )
}
```

Note: `h3.stack-head` and `section.stack` are wrapped in a `<div key={s.id}>` only so React has a single element per array item — this wrapper div is transparent to Task 3's hook, which looks for `.stack-head`'s `nextElementSibling`. Because the wrapper div's children are `[h3.stack-head, section.stack]` in that order, `stackHead.nextElementSibling` still correctly resolves to the `section.stack` in the same wrapper. Confirm this assumption holds in Task 3 Step 4's manual check.

- [ ] **Step 2: Add supporting styles**

```css
/* append to src/pages/ScrollStackTest/ScrollStackTest.css */

.stack-head {
  width: 100%;
  padding: var(--space-0-5) var(--space-1);
  font-size: var(--fs-body1);
  cursor: default;
}

.stack {
  width: 100%;
}

.sst-rail-item {
  font-size: var(--fs-caption1);
  margin-bottom: var(--space-0-5);
}

.sst-content p {
  font-size: var(--fs-body);
  margin-bottom: var(--space-1);
}

.sst-media-block {
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-heading1);
  color: #0a0a0a;
  opacity: 0.85;
}
```

- [ ] **Step 3: Verify visually**

Run: `npm run build`
Expected: exits 0, no TypeScript errors.

Run: `npm run dev`, open `http://localhost:5173/scroll-test`.
Expected: five sections in normal document flow (nothing sticky yet except the top page header), each with a distinct background color, a heading, a rail column with 3 lines of text, a content column with 4 paragraphs, and a media column with 2 colored squares labeled `{id}.A` / `{id}.B`. Scrolling behaves like a normal page — no stacking yet.

- [ ] **Step 4: Commit**

```bash
git add src/pages/ScrollStackTest/ScrollStackTest.tsx src/pages/ScrollStackTest/ScrollStackTest.css
git commit -m "Add five sample stacked sections to scroll stack test page"
```

---

### Task 3: `useStackingSections` hook — the actual scroll mechanic

**Files:**
- Create: `src/hooks/useStackingSections.ts`
- Modify: `src/pages/ScrollStackTest/ScrollStackTest.tsx`
- Modify: `src/pages/ScrollStackTest/ScrollStackTest.css`

**Interfaces:**
- Consumes: a `RefObject<HTMLElement | null>` pointing at a container that holds `.stack-head` elements as siblings immediately before their `.stack` section, and `.sst-header` as the fixed reference header — matches the DOM structure Task 2 built.
- Produces: `useStackingSections(containerRef: RefObject<HTMLElement | null>): void` — a hook with no return value; all effects are DOM writes.

- [ ] **Step 1: Write the hook**

```ts
// src/hooks/useStackingSections.ts
import { useEffect, type RefObject } from 'react'

const STACK_STEP_RATIO = 0.6
const RESIZE_DEBOUNCE_MS = 150
const RAIL_MEDIA_GAP_PX = 20

interface StackedHeader {
  el: HTMLElement
  section: HTMLElement | null
  top: number
  bottom: number
}

function isInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect()
  return rect.bottom > 0 && rect.top < window.innerHeight
}

/**
 * Ports the reference site's computeStickyness() + scroll-listener logic
 * (see CLAUDE.md → "Reference pattern: Stacking Sticky Sections").
 * Writes positioning directly to the DOM via refs instead of React state,
 * since driving this from state would re-render on every scroll frame.
 */
export function useStackingSections(containerRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const fixedHeader = container.querySelector<HTMLElement>('.sst-header')

    let stuckTop: StackedHeader[] = []
    let stuckBottom: StackedHeader[] = []

    function computeStickyness() {
      const headers = Array.from(container!.querySelectorAll<HTMLElement>('.stack-head'))
      const baseOffset = fixedHeader ? fixedHeader.offsetHeight : 0
      const stackStep = headers.length > 0 ? Math.round(headers[0].offsetHeight * STACK_STEP_RATIO) : 0

      stuckTop = []
      stuckBottom = []

      headers.forEach((el, index) => {
        const section = el.nextElementSibling as HTMLElement | null
        const top = baseOffset + index * stackStep
        const bottom = (headers.length - 1 - index) * stackStep
        const entry: StackedHeader = { el, section, top, bottom }

        if (section && section.classList.contains('stack')) {
          const railMediaTop = Math.round(top + el.offsetHeight + RAIL_MEDIA_GAP_PX)
          const rail = section.querySelector<HTMLElement>('.cs-grid-rail')
          const media = section.querySelector<HTMLElement>('.cs-grid-media')
          if (rail) rail.style.top = `${railMediaTop}px`
          if (media) media.style.top = `${railMediaTop}px`
        }

        if (isInViewport(el)) {
          el.style.top = `${top}px`
          el.style.bottom = 'initial'
          stuckTop.unshift(entry)
        } else {
          el.style.top = 'initial'
          el.style.bottom = `${bottom}px`
          stuckBottom.push(entry)
        }
      })
    }

    computeStickyness()

    let lastScrollTop = window.scrollY
    let isTicking = false

    function onScroll() {
      if (isTicking) return
      isTicking = true
      requestAnimationFrame(() => {
        const currentScrollTop = window.scrollY

        if (currentScrollTop < lastScrollTop) {
          if (stuckTop.length > 1) {
            const entry = stuckTop[0]
            const sectionTop = entry.section?.getBoundingClientRect().top ?? 0
            const headerBottom = entry.el.getBoundingClientRect().top + entry.el.offsetHeight
            if (Math.round(headerBottom) === Math.round(sectionTop)) {
              entry.el.style.top = 'initial'
              entry.el.style.bottom = `${entry.bottom}px`
              stuckTop.shift()
              stuckBottom.unshift(entry)
            }
          }
        } else if (stuckBottom.length > 0) {
          const entry = stuckBottom[0]
          const sectionTop = entry.section?.getBoundingClientRect().top ?? 0
          const headerBottom = entry.el.getBoundingClientRect().top + entry.el.offsetHeight
          if (Math.round(headerBottom) >= Math.round(sectionTop)) {
            entry.el.style.top = `${entry.top}px`
            entry.el.style.bottom = 'initial'
            stuckBottom.shift()
            stuckTop.unshift(entry)
          }
        }

        lastScrollTop = currentScrollTop
        isTicking = false
      })
    }

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null
    function onResize() {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(computeStickyness, RESIZE_DEBOUNCE_MS)
    }

    document.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)

    return () => {
      document.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (resizeTimeout) clearTimeout(resizeTimeout)
    }
  }, [containerRef])
}
```

- [ ] **Step 2: Wire the hook into the page**

In `src/pages/ScrollStackTest/ScrollStackTest.tsx`, add the ref and hook call:

```tsx
import { useRef } from 'react'
import './ScrollStackTest.css'
import CaseStudySection from '../../components/CaseStudySection'
import { useStackingSections } from '../../hooks/useStackingSections'
```

(add `useRef` to the existing React import if one exists; this page currently has none, so this is a new import line)

Inside the component, before the `return`:

```tsx
export default function ScrollStackTest() {
  const containerRef = useRef<HTMLDivElement>(null)
  useStackingSections(containerRef)

  return (
    <div className="scroll-stack-test" ref={containerRef}>
```

(keep the rest of the JSX exactly as Task 2 left it — only the opening `<div>` tag gains `ref={containerRef}`)

- [ ] **Step 3: Add the sticky CSS**

```css
/* append to src/pages/ScrollStackTest/ScrollStackTest.css */

.scroll-stack-test .stack-head {
  position: sticky;
  z-index: 2;
  background: #0a0a0a;
}

.scroll-stack-test .stack {
  isolation: isolate;
}

/* CaseStudySection.css sets `.cs-grid { overflow: hidden }` for the live
   case-study pages. An `overflow: hidden` ancestor becomes the nearest
   clipping/scroll container for any sticky descendant, which silently
   breaks position: sticky (the rail/media would never detach and pin —
   they'd just sit static). Override it here, scoped to this page only;
   CaseStudySection.css itself stays untouched. */
.scroll-stack-test .cs-grid {
  overflow: visible;
}

.scroll-stack-test .cs-grid-rail,
.scroll-stack-test .cs-grid-media {
  position: sticky;
}
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: exits 0, no TypeScript errors.

- [ ] **Step 5: Manually verify the stacking behavior**

Run: `npm run dev`, open `http://localhost:5173/scroll-test`.

Check, in order:
1. Scroll down slowly from the top. Section one's header ("Section one — orange") should stick to the top of the viewport (just below the "Scroll stack test" bar) once it reaches it.
2. Keep scrolling. Section two's header should stick directly underneath section one's header — both visible and stacked, not overlapping.
3. Continue through all five sections — headers should keep piling up in order.
4. Scroll back up. Headers should un-stack in reverse: the most recently stacked header should detach first.
5. While inside a section (headers already stacked above), confirm the rail column (left, 3 lines of text) and media column (right, 2 colored squares) stay pinned near the top of the viewport while the content paragraphs in the middle scroll past underneath.
6. Resize the browser window (or open devtools responsive mode and drag it) and confirm the stacking still lines up correctly after the 150ms debounce — no overlapping headers, no visible gaps.

If any check fails, fix the hook logic before proceeding — do not commit a broken stacking effect.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useStackingSections.ts src/pages/ScrollStackTest/ScrollStackTest.tsx src/pages/ScrollStackTest/ScrollStackTest.css
git commit -m "Implement stacking-sections scroll mechanic via useStackingSections hook"
```

---

## Self-Review Notes

- **Spec coverage:** headers stacking/unstacking (Task 3), sticky rail/media within a section (Task 3 + CSS), reuse of `CaseStudySection` (Task 2), URL-only route (Task 1), progress bar and note/figure visibility explicitly excluded (not implemented anywhere above) — all spec points are covered.
- **Type consistency:** `useStackingSections(containerRef: RefObject<HTMLElement | null>)` in Task 3 Step 1 matches the `useRef<HTMLDivElement>(null)` passed to it in Step 2 (`HTMLDivElement` satisfies `HTMLElement`). `.stack-head`, `.stack`, `.cs-grid-rail`, `.cs-grid-media`, `.sst-header` class names are consistent across Task 2's JSX/CSS and Task 3's hook queries.
- **No placeholders:** all steps contain complete, runnable code — no TODOs or "similar to above" shortcuts.
- **Caught during review:** `CaseStudySection.css`'s `.cs-grid { overflow: hidden }` would have silently broken `position: sticky` on `.cs-grid-rail`/`.cs-grid-media` (an `overflow: hidden` ancestor becomes the sticky element's clipping/scroll container). Fixed inline in Task 3 Step 3 with a scoped `.scroll-stack-test .cs-grid { overflow: visible }` override — confirmed no other ancestor (`main`, `.scroll-stack-test`, `body`/`html` in `index.css`) sets `overflow` in a way that would cause the same problem.
