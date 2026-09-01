import './CaseStudyAutomatedCalendar.css'
import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { asset } from '../../lib/nav'
import CaseStudyIntro from '../../components/CaseStudyIntro'
import CaseStudySection from '../../components/CaseStudySection'
import Footer from '../../components/Footer'
import MediaLightbox from '../../components/MediaLightbox'
import ProjectHeader from '../../components/ProjectHeader'
import StackedSection from '../../components/StackedSection'
import { useStackingSections } from '../../hooks/useStackingSections'
import { useActiveDiagramIndex } from '../../hooks/useActiveDiagramIndex'
import { useProportionalHeight } from '../../hooks/useProportionalHeight'
import RetrospectiveSection from '../../components/RetrospectiveSection'
import type { RetroSegment } from '../../components/RetrospectiveSection'

/* Whole-page colour scheme — change these to retheme the entire page.
   Consumed as CSS custom properties (--cs-bg/--cs-fg/--cs-hover) set inline
   on the page root below, and passed as bgColor/textColor to every themed
   component (ProjectHeader, CaseStudyIntro). */
const PAGE_BG = '#9a72aa'
const PAGE_FG = '#f5ecc2'
const PAGE_HOVER = '#fdd4bd'

/* image assets (Figma node 516:12417) */
const imgDemoSetup = asset('/automated-calendar/overview/demo-setup.png')
const imgDemoInteraction = asset('/automated-calendar/overview/demo-interaction.jpg')

/* video assets (Figma node 516:12446) */
const vidDemo = asset('/automated-calendar/video/demo.mp4')
const imgVidPoster = asset('/automated-calendar/video/poster.jpg')

interface ConceptSegment {
  text: string
  /** true = core phrase, stays full opacity under the "Its essence" tab */
  essence: boolean
}

/* copy + essence/filler split (Figma node 597:3456) — spans stay in one
   flowing paragraph rather than a list so the wrapping reads as prose. */
const conceptSegments: ConceptSegment[] = [
  { text: 'Help', essence: false },
  { text: ' busy families ', essence: true },
  { text: 'move beyond', essence: false },
  { text: ' scheduling chaos ', essence: true },
  { text: 'through a central view, morphing long-term plans into ', essence: false },
  { text: 'simple, achievable daily actions.', essence: true },
]

/* "CORE LOGIC" row (Figma node 597:3510 / 597:3536 / 597:3574 / 597:3605) —
   reuses RetrospectiveSection wholesale (same bordered-segment grid,
   hover-reveal-and-stay panel row) rather than a bespoke pattern. `percent`
   is left empty so the rule box renders blank (Figma's box has no text in
   it) and every column gets an equal share (RetrospectiveSection falls back
   to an equal weight when it can't parse a number out of `percent`).
   "Calendar events"/"Deadlines" and "Chores"/"Un-bound to-dos" are paired via
   groupKey — hovering either tile in a pair highlights both and reveals one
   merged panel spanning both columns, matching the Figma hover states. */
const conceptCoreLogicSegments: RetroSegment[] = [
  { label: 'Calendar events', percent: '', items: ['Bound to a specific date and time, they are expected to occur within that time slot'], groupKey: 'time-bound' },
  { label: 'Deadlines', percent: '', items: [], groupKey: 'time-bound' },
  { label: 'Chores', percent: '', items: ['Flexible and not bound to a time slot, can be completed at any time of the day.'], groupKey: 'flexible' },
  { label: 'Un-bound to-dos', percent: '', items: [], groupKey: 'flexible' },
]

/* "Interaction goal" block (Figma node 597:3510, appended below Core logic)
   — one heading + two body paragraphs, same plain 2-column layout (fixed
   content column, single image, no rail) as the Inspiration section below. */
const interactionGoalHeading = 'Interaction goal'
const interactionGoalBody: string[] = [
  'Inspired by the behaviour of parent(s) coming to the kitchen or the living room to plan or align on the things they need to do.',
  'These are artifact that always live in the same place, and helps the viewer quickly get an overview of what needs to be done, it requires very little interaction. Just looking at it.',
]
const imgTargetBehaviour = asset('/automated-calendar/target_behaviour.png')

interface InspirationParagraph {
  heading: string
  body: string
}

/* copy (Figma node 598:3710) — plain static 2-column layout (fixed-width
   content column, single collage image), not CaseStudySection's 3-column
   content/rail/media grid — this design has no rail/middle column at all. */
const inspirationParagraphs: InspirationParagraph[] = [
  { heading: 'Print references', body: 'Cause I wanted to replicate the feeling of looking at a physical calendar, I hit the library to collect references from typography and graphic design books (Helmut Schmid’s & Rostislav Vaněk’s work, Munich Olympic visual guidelines and more ). \n \n These heavily influenced my type setting and overall layout design' },
  { heading: 'Signage', body: 'Signage design was a key source of inspiration for creating a readable and scannable interface, pivoting my approach to use a mix of monospaced and proportional typefaces.' },
]

const imgInspiration = asset('/automated-calendar/inspiration.png')

/* "Product shots" 2×2 grid (Figma node 610:3911) — no text, just the four
   photos; filenames match the Figma layer names 1:1 (top-left, top-right,
   bottom-left, bottom-right, in that order). */
const productShots = [
  '2026-07-01_10-30-23.jpg',
  '2026-07-01_10-30-50.jpg',
  '2026-07-01_10-31-28.jpg',
  '2026-07-01_10-31-56.jpg',
]

interface BackendCaption {
  text: string
  /** optional nested sub-list, e.g. the JSON fields under paragraph 2's first caption */
  items?: string[]
}

interface BackendParagraph {
  heading: string
  body: string
  diagram: string
  captionItems: BackendCaption[]
}

/* copy + diagram pairing (Figma node 582:2834 / 582:3068 / 582:3139 / 582:3227) —
   each diagram builds on the previous one as the backend pipeline gains a step. */
const backendParagraphs: BackendParagraph[] = [
  {
    heading: 'Data sources',
    body: 'Pull calendar information from existing calendar platforms, the prototype will not create any calendar events.',
    diagram: '1.png',
    captionItems: [
      { text: 'Configured only Google and Apple calendar API' },
      { text: 'Used a fixed but diverse set of events' },
    ],
  },
  {
    heading: 'Clean and organising the data',
    body: 'Calendar information is parsed and re-organised into a JSON with relevant fields that are required by the prototype.',
    diagram: '2.png',
    captionItems: [
      { text: 'Data organised into a JSON containing:', items: ['Date', 'Time', 'Location', 'Person/People', 'Title', 'Description'] },
      { text: 'Simultaneously an LLM reads calendar title, description or location to add categorisation tags.' },
    ],
  },
  {
    heading: 'Generating LLM responses',
    body: 'LLM reads the JSON to generates calendar summaries that will can later be displayed on demand.',
    diagram: '3.png',
    captionItems: [
      { text: 'JSON is passed through Gemini to generate a short 1-2 line description of the calendar events' },
      { text: 'These are stored attached to the calendar events as “narrative blocks”' },
    ],
  },
  {
    heading: 'Match calendar and face data',
    body: 'On recognition of a face, the name of the face is matched with calendar events of same name, providing a filtered view of the complete calendar database.',
    diagram: '4.png',
    captionItems: [
      { text: 'Face scan runs every 5 seconds to save resources' },
      { text: 'Based on the person detected and time of the day, the backend serves a filtered JSON for the UI' },
    ],
  },
]

interface UiParagraph {
  heading: string
  body: string
  diagram: string
  captionItems: string[]
}

/* PLACEHOLDER COPY — heading/body/caption text below is a stand-in (some of
   it literally duplicated from the Back-end section) until the real UI copy
   is written; only the structure/diagram pairing (Figma node 583:3279 /
   584:3327 / 585:3372 / 586:3415) is final. Safe to edit the strings below
   directly, the shape doesn't need to change. */
const uiParagraphs: UiParagraph[] = [
  // {
  //   heading: 'Table top calendar',
  //   body: 'An automated calendar that compiles all your events to tell you exactly what you need to do in the next few hours',
  //   diagram: '0.png',
  //   captionItems: [
  //     'Simply ideas to the its core essence. Those are the ones that are remembered. Not too much fluff to remember.',
  //     'Ideas that require too much explanation might not be the most efficient phase',
  //   ],
  // },
  {
    heading: 'Auto grouping',
    body: 'Help users plan their chores around time-bound events, this helps them visualize their and structure their day.',
    diagram: '1.png',
    captionItems: [
      'Chores slot into the time gaps between events',
      'When possible, out and about chores (ex: grocery shopping) is grouped with an outdoor event',
    ],
  },
  {
    heading: 'Combined narrative',
    body: 'When people look at the display, it updates to show a inwoven narrative, helping them plan their day together.',
    diagram: '2.png',
    captionItems: [
      'Each user can pick their colour, allowing them to discern their events.',
      'Creates a space to align, plan and negotiate chores. Avoiding any confusions',
    ],
  },
  {
    heading: 'Details',
    body: 'Aglamoration of two calendars, each stripped to their essence helping user act on their plan ',
    diagram: '3.png',
    captionItems: [
      'Chores do not show a time, but placement indicates recommended time',
      'Easily identify overlapping events',
    ],
  },
]

export default function CaseStudyAutomatedCalendar() {
  const pageRef = useRef<HTMLDivElement>(null)
  useStackingSections(pageRef, { fixedHeaderSelector: '.project-header' })

  const [conceptTab, setConceptTab] = useState<'statement' | 'essence'>('essence')

  const uiContentRef = useRef<HTMLDivElement>(null)
  useProportionalHeight(uiContentRef, 1)
  const activeUiIndex = useActiveDiagramIndex(uiContentRef, {
    paragraphSelector: '.ac-ui-para',
    fixedHeaderSelector: '.project-header',
    offsetPx: 130,
  })

  // UI diagrams lightbox (MediaLightbox, Figma node 515:12335 pattern) — index
  // into uiParagraphs, or null when closed.
  const [uiLightboxIndex, setUiLightboxIndex] = useState<number | null>(null)

  // Scrolls the page so the UI paragraph at `index` sits exactly at the same
  // activation line useActiveDiagramIndex uses above (fixed header + this
  // section's own stack-head + the same 130px offsetPx) — so that after
  // cycling through the lightbox with arrow keys and closing it, the page is
  // scrolled to wherever the paragraph you were last looking at naturally
  // reads as "active", not wherever you happened to scroll from originally.
  // Deferred via setTimeout(0) rather than called synchronously: MediaLightbox
  // still has document.body.style.overflow locked at the moment onClose
  // fires (its own cleanup effect only restores it on unmount, after this
  // render), and scrollTo is a no-op while the page can't scroll at all.
  function scrollUiParagraphIntoActivation(index: number) {
    const container = uiContentRef.current
    const target = container?.querySelectorAll<HTMLElement>('.ac-ui-para')[index]
    if (!target) return
    const fixedHeader = document.querySelector<HTMLElement>('.project-header')
    const stackHead = container?.closest('.stack')?.previousElementSibling
    const activationLine =
      (fixedHeader?.offsetHeight ?? 0) + (stackHead instanceof HTMLElement ? stackHead.offsetHeight : 0) + 130
    const delta = target.getBoundingClientRect().top - activationLine
    window.scrollTo({ top: window.scrollY + delta })
  }

  function closeUiLightbox() {
    if (uiLightboxIndex !== null) {
      const index = uiLightboxIndex
      setTimeout(() => scrollUiParagraphIntoActivation(index), 0)
    }
    setUiLightboxIndex(null)
  }

  const backendContentRef = useRef<HTMLDivElement>(null)
  useProportionalHeight(backendContentRef, 1)
  const activeBackendIndex = useActiveDiagramIndex(backendContentRef, {
    paragraphSelector: '.ac-backend-para',
    fixedHeaderSelector: '.project-header',
    offsetPx: 130,
  })

  const pageStyle = {
    '--cs-bg': PAGE_BG,
    '--cs-fg': PAGE_FG,
    '--cs-hover': PAGE_HOVER,
  } as CSSProperties

  return (
    <div className="ac" style={pageStyle}>
      <div className="ac-page" ref={pageRef}>

        {/* ── PAGE HEADER (sticky, always visible) ── */}
        <ProjectHeader title="Automated calendar" bgColor={PAGE_BG} textColor={PAGE_FG} />

        {/* ── OVERVIEW (Figma node 516:12417) ── */}
        <StackedSection title="Overview">
          <CaseStudyIntro
            bgColor={PAGE_BG}
            textColor={PAGE_FG}
            hoverColor={PAGE_HOVER}
            description={[
              'This project represented a paradigm shift from reactive computing, requiring explicit interaction, to proactive where the system responds based on intent.',
              'The goal is design an experience and system that does not require explicit interaction, clicks or touches.',
            ]}
            characteristics={{
              label: 'PROJECT CHARACTERISTICS',
              items: ['3 months duration', 'Individual effort', 'Developing a working prototype'],
            }}
            listLabel="LEARNINGS"
            responsibilities={[
              { prefix: 'Identifying behaviours or challenges that present', link: 'product opportunities', description: 'Sensitized capability to identify behaviours, actions or friction points that inform intervention.' },
              { prefix: 'Plan and presenting a', link: ' convincing demo', description: 'Learnt the challenges of building a convincing demo envirnoment and designing a prototype that required no intervention' },
              { prefix: 'Coding a', link: 'functional prototype', description: 'Built a full stack project to learn back-end design and its connection to a front-end. Although it was coded with AI assistance, I learnt effective rapid prototyping techniques.' },
              { prefix: 'Scripting and filming', link: 'product videos', description: 'To pitch and sell out idea, I filmed a product video that conveyed the value prosition in just a few minutes.' },
            ]}
            media={[
              { src: imgDemoSetup, alt: 'Automated calendar demo setup', aspect: '3840 / 2160' },
              { src: imgDemoInteraction, alt: 'Automated calendar demo in use', aspect: '3840 / 2160' },
            ]}
          />
        </StackedSection>

        {/* ── WATCH IT TO BELIEVE IT (Figma node 516:12446) ── */}
        <StackedSection title="Watch it to believe it">
          <div className="ac-video-wrap">
            <video
              className="ac-video"
              src={vidDemo}
              poster={imgVidPoster}
              controls
              playsInline
              preload="metadata"
            />
          </div>
        </StackedSection>

        {/* ── CONCEPT (Figma node 597:3456) ── */}
        <StackedSection title="Concept">
          <div className="ac-concept-content">
            <div className="ac-concept-tabs">
              <button
                type="button"
                className={`ac-concept-tab type-body${conceptTab === 'statement' ? ' active' : ''}`}
                onClick={() => setConceptTab('statement')}
              >
                Statement,
              </button>
              <button
                type="button"
                className={`ac-concept-tab type-body${conceptTab === 'essence' ? ' active' : ''}`}
                onClick={() => setConceptTab('essence')}
              >
                and its essence
              </button>
            </div>
            <p className="ac-concept-statement type-heading3">
              {conceptSegments.map((s, i) => (
                <span
                  key={i}
                  className={conceptTab === 'essence' && !s.essence ? 'dim' : undefined}
                >
                  {s.text}
                </span>
              ))}
            </p>
          </div>

          <div className="ac-concept-corelogic">
            <p className="ac-concept-label type-body">Core logic</p>
            <RetrospectiveSection segments={conceptCoreLogicSegments} hint="Give this a hover" />
          </div>

          <div className="ac-concept-goal">
            <div className="ac-concept-goal-content cs-sticky">
              <p className="type-heading1 ac-concept-goal-heading">{interactionGoalHeading}</p>
              <div className="ac-concept-goal-body">
                {interactionGoalBody.map((p, i) => (
                  <p className="type-body" key={i}>{p}</p>
                ))}
              </div>
            </div>
            <div className="ac-concept-goal-media">
                <p className="type-caption1 ac-concept-goal-caption">Yes these are AI generated images, but you get the point.</p>
              <div className="ac-concept-goal-image">
                <img src={imgTargetBehaviour} alt="Parents planning together at the kitchen fridge" />
              </div>
            
            </div>
          </div>
        </StackedSection>

        {/* ── INSPIRATION (Figma node 598:3710) ── */}
        <StackedSection title="Inspiration">
          <div className="ac-inspiration-content">
            <div className="ac-inspiration-paras cs-sticky">
              {inspirationParagraphs.map((p) => (
                <div className="ac-inspiration-para" key={p.heading}>
                  <p className="type-heading1 ac-inspiration-para-heading">{p.heading}</p>
                  <p className="type-body ac-inspiration-para-body">{p.body}</p>
                </div>
              ))}
            </div>
            <div className="ac-inspiration-media">
              <img src={imgInspiration} alt="Print and signage design references" />
            </div>
          </div>
        </StackedSection>

        {/* ── UI (placeholder copy — Figma node 583:3279 / 584:3327 / 585:3372 / 586:3415) ── */}
        <StackedSection title="UI">
          <CaseStudySection
            bgColor={PAGE_BG}
            textColor={PAGE_FG}
            rail={
              <div className="ac-ui-notes">
                {uiParagraphs.map((p, i) => (
                  <div
                    key={p.heading}
                    className={`ac-ui-note-item${i === activeUiIndex ? ' active' : ''}`}
                  >
                    <ol className="ac-ui-caption-list">
                      {p.captionItems.map((item, idx) => (
                        <li className="ac-ui-caption-item" key={idx}>
                          <span className="type-caption1 ac-ui-caption-num">{idx + 1}</span>
                          <span className="type-caption1 ac-ui-caption-text">{item}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            }
            content={
              <div className="ac-ui-paras" ref={uiContentRef}>
                {uiParagraphs.map((p, i) => (
                  <div
                    className={`ac-ui-para${i === activeUiIndex ? ' active' : ''}`}
                    key={p.heading}
                  >
                    <p className="type-heading1 ac-ui-para-heading">{p.heading}</p>
                    <p className="type-body ac-ui-para-body">{p.body}</p>
                  </div>
                ))}
              </div>
            }
            media={
              <div className="ac-ui-diagrams">
                {uiParagraphs.map((p, i) => (
                  <div
                    key={p.heading}
                    className={`ac-ui-diagram-item${i === activeUiIndex ? ' active' : ''}`}
                  >
                    <button
                      type="button"
                      className="ac-ui-diagram-trigger"
                      onClick={() => setUiLightboxIndex(i)}
                      aria-label={`View larger: ${p.heading}`}
                    >
                      <img src={asset(`/automated-calendar/UI/${p.diagram}`)} alt={p.heading} />
                    </button>
                  </div>
                ))}
              </div>
            }
          />
        </StackedSection>

        {uiLightboxIndex !== null && (
          <MediaLightbox
            heading={uiParagraphs[uiLightboxIndex].heading}
            description={uiParagraphs[uiLightboxIndex].body}
            notes={uiParagraphs[uiLightboxIndex].captionItems}
            textColor={PAGE_FG}
            media={{ kind: 'image', src: asset(`/automated-calendar/UI/${uiParagraphs[uiLightboxIndex].diagram}`), alt: uiParagraphs[uiLightboxIndex].heading }}
            onClose={closeUiLightbox}
            onNext={() => setUiLightboxIndex((i) => (i === null ? i : Math.min(i + 1, uiParagraphs.length - 1)))}
            onPrevious={() => setUiLightboxIndex((i) => (i === null ? i : Math.max(i - 1, 0)))}
          />
        )}

        {/* ── BACK-END (Figma node 582:2834 / 582:3068 / 582:3139 / 582:3227) ── */}
        <StackedSection title="Back-end">
          <CaseStudySection
            bgColor={PAGE_BG}
            textColor={PAGE_FG}
            rail={
              <div className="ac-backend-notes">
                {backendParagraphs.map((p, i) => (
                  <div
                    key={p.heading}
                    className={`ac-backend-note-item${i === activeBackendIndex ? ' active' : ''}`}
                  >
                    <ol className="ac-backend-caption-list">
                      {p.captionItems.map((c, idx) => (
                        <li className="ac-backend-caption-item" key={idx}>
                          <span className="type-caption1 ac-backend-caption-num">{idx + 1}</span>
                          <span className="type-caption1 ac-backend-caption-text">
                            {c.text}
                            {c.items && (
                              <ul className="ac-backend-caption-sublist">
                                {c.items.map((item) => <li key={item}>{item}</li>)}
                              </ul>
                            )}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            }
            content={
              <div className="ac-backend-paras" ref={backendContentRef}>
                {backendParagraphs.map((p, i) => (
                  <div
                    className={`ac-backend-para${i === activeBackendIndex ? ' active' : ''}`}
                    key={p.heading}
                  >
                    <p className="type-heading1 ac-backend-para-heading">{p.heading}</p>
                    <p className="type-body ac-backend-para-body">{p.body}</p>
                  </div>
                ))}
              </div>
            }
            media={
              <div className="ac-backend-diagrams">
                {backendParagraphs.map((p, i) => (
                  <div
                    key={p.heading}
                    className={`ac-backend-diagram-item${i === activeBackendIndex ? ' active' : ''}`}
                  >
                    <img src={asset(`/automated-calendar/backend-diagrams/${p.diagram}`)} alt={p.heading} />
                  </div>
                ))}
              </div>
            }
          />
        </StackedSection>

        {/* ── PRODUCT SHOTS (Figma node 610:3911) ── */}
        <StackedSection title="Product shots">
          <div className="ac-shots-grid">
            {productShots.map((src) => (
              <div className="ac-shots-item" key={src}>
                <img src={asset(`/automated-calendar/product_shots/${src}`)} alt="" />
              </div>
            ))}
          </div>
        </StackedSection>

        <Footer textColor={PAGE_FG} />

      </div>
    </div>
  )
}
