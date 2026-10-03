import './Semantic.css'
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

/* Whole-page colour scheme — change these to retheme the entire page.
   Consumed as CSS custom properties (--cs-bg/--cs-fg/--cs-hover) set inline
   on the page root below, and passed as bgColor/textColor to every themed
   component (ProjectHeader, CaseStudyIntro). PLACEHOLDER — pick real colours
   once the Figma spec exists. */
const PAGE_BG = '#ffefae'
const PAGE_FG = '#704213'
const PAGE_HOVER = '#484D26'

/* PLACEHOLDER asset — swap for the real Overview media once available. */
const imgPlaceholder = asset('/semantic/intro.mp4')

/* ── WHAT IS THIS — two-column CaseStudySection (mediaSpansRail, see
   CLAUDE.md's "Two column" shorthand), same shape as "The details" below. */
interface WhatIsThisTab {
  label: string
  diagram: string
}

interface WhatIsThisParagraph {
  heading: string
  body: string
  diagram?: string
  video?: string
  tabs?: WhatIsThisTab[]
  captionItems?: string[]
}

function whatIsThisDiagramFor(p: WhatIsThisParagraph, tabIndex: number): string | undefined {
  return p.tabs ? p.tabs[tabIndex]?.diagram : p.diagram
}

/* PLACEHOLDER COPY — swap for real content once available; only the
   structure/pairing is final. */
const whatIsThisParagraphs: WhatIsThisParagraph[] = [
  {
    heading: 'Static content',
    body: 'Text on the web is static, whereas preferences are dynamic. Someone might prefer skimming an article, someone else might be reading to improve their vocabulary, and another might have just begun to learn the language.',
    diagram: 'context/problem_identification.png',
  },
  {
    heading: 'The vision',
    body: 'Provide a flexible experience for reading text on the web, while retaining the idea and message the author intended. \n \nImagine an experience that aligns with our reading preferences and proficiency.',
    diagram: 'context/concept.mp4',
  },
  {
    heading: 'Design strategy',
    body: 'An experience that sits atop the original content, invisible when not required. The content is the only constant while the interface is transient. \n \nRespecting authorship, the experience keeps the original version of the passage always available and easy to reinstate.',
    diagram: 'context/open_close.mp4',
  },
  // {
  //   heading: 'Potential usecases',
  //   body: 'This is an experience that sits on top of the web experience, invisible when not required. An edit experience embedded into the core experience while retaining context and style of the original website.',
  //   diagram: 'context/open_close.mp4',
  // },

]

function renderWhatIsThisCaptions(items?: string[], align: 'center' | 'left' = 'center') {
  if (!items) return null
  return (
    <ol className={`sm-whatisthis-caption-list${align === 'left' ? ' sm-whatisthis-caption-list--left' : ''}`}>
      {items.map((item, idx) => (
        <li className="sm-whatisthis-caption-item" key={idx}>
          <span className="type-caption1 sm-whatisthis-caption-num">{idx + 1}</span>
          <span className="type-caption1 sm-whatisthis-caption-text">{item}</span>
        </li>
      ))}
    </ol>
  )
}

/* ── THE DETAILED — two-column CaseStudySection (mediaSpansRail, see
   CLAUDE.md's "Two column" shorthand). `media` renders `video` if present,
   else the active `tabs` entry's diagram if the paragraph has tabs, else the
   plain `diagram` — only one of these per paragraph is ever used. `tabs`
   renders as a switcher in `rail` (same slot the Screenshot/Video toggle
   would use), per CLAUDE.md's note on adding a real switch when one is
   actually asked for. */
interface DetailedTab {
  label: string
  diagram: string
}

interface DetailedParagraph {
  heading: string
  body: string
  diagram?: string
  video?: string
  tabs?: DetailedTab[]
  captionItems?: string[]
}

function diagramFor(p: DetailedParagraph, tabIndex: number): string | undefined {
  return p.tabs ? p.tabs[tabIndex]?.diagram : p.diagram
}

/* PLACEHOLDER COPY — swap for real content once available; only the
   structure/pairing is final. */
const detailedParagraphs: DetailedParagraph[] = [
  {
    heading: 'Motion character and design',
    body: 'Interaction animations start and end slowly with exponential acceleration and deceleration, "slingshotting" from one state to another. \n \nThe goal is to have minimal noise created by the transition while still signalling a change.',
    video: 'details/motion_overview.mp4',
    // captionItems: [
    //   'Placeholder caption item one.',
    //   'Placeholder caption item two.',
    // ],
  },
  {
    heading: 'The pursuit towards no personality',
    body: 'The intent in selecting Mono typography (IBM Plex Mono) was to have a neutral and utilitarian style, since this experience is layered on top of other interfaces that have personalities and styles of their own.',
    tabs: [
      { label: 'NYT', diagram: 'details/typography/NYT.png' },
      { label: 'The Guardian', diagram: 'details/typography/gaurdian.png' },
      { label: 'Substack', diagram: 'details/typography/substack.png' },
      { label: 'Medium', diagram: 'details/typography/medium.png' },
    ],
  },
  {
    heading: 'Glass... AGAIN?!',
    body: 'Glass acts as a metaphor for selecting and investigating, contributes to the goal of neutrality, and helps maintain the context of the current page. \n \nThis UI glass has been designed to remove distractions that come from overdone refractions, depth and lighting.',
    diagram: 'details/glass.png',
  },
]

/* Shared by media's video and image branches — captions render next to
   whichever media is showing. */
function renderDetailedCaptions(items?: string[], align: 'center' | 'left' = 'center') {
  if (!items) return null
  return (
    <ol className={`sm-detailed-caption-list${align === 'left' ? ' sm-detailed-caption-list--left' : ''}`}>
      {items.map((item, idx) => (
        <li className="sm-detailed-caption-item" key={idx}>
          <span className="type-caption1 sm-detailed-caption-num">{idx + 1}</span>
          <span className="type-caption1 sm-detailed-caption-text">{item}</span>
        </li>
      ))}
    </ol>
  )
}

/* ── FUNCTIONALITY — two-column CaseStudySection (mediaSpansRail, see
   CLAUDE.md's "Two column" shorthand), same shape as "The details",
   including its `tabs` switcher in `rail`. Unlike "The details", a tab here
   can carry a `video` or a `diagram`, since "Fluid text"'s tabs are videos. */
interface FunctionalityTab {
  label: string
  video?: string
  diagram?: string
}

interface FunctionalityParagraph {
  heading: string
  body: string
  diagram?: string
  video?: string
  tabs?: FunctionalityTab[]
  captionItems?: string[]
}

function functionalityMediaFor(
  p: FunctionalityParagraph,
  tabIndex: number,
): { video?: string; diagram?: string } {
  const source = p.tabs ? p.tabs[tabIndex] : p
  return { video: source?.video, diagram: source?.diagram }
}

/* PLACEHOLDER COPY — swap for real content once available; only the
   structure/pairing is final. */
const functionalityParagraphs: FunctionalityParagraph[] = [
  {
    heading: 'Opening interaction',
    body: 'The interaction had to have enough fail safes so that it didn‘t happen accidentally, but easy enough to initiate it without much frictiony.',
    diagram: 'features/interaction_final.mp4',
    captionItems: [
      'Two selection states prevent unintentional activations, it also allows selecting multiple paragraphs.',
      'The soft selection state can be activated by a single click',
      'Hard selection can be enabled by a pitch-out gesture or double click.',
    ],
  },
  {
    heading: 'Fluid text',
    body: 'Text on the web is static, whereas preference is dynamic. Someone might prefer to skim the article or want a gist, while another might be reading to improve their vocabulary or another is learning the language.',
    tabs: [
      { label: 'Abstraction', video: 'features/abstraction_showcase.mp4' },
      { label: 'Vocabulary', video: 'features/vocabulary_showcase.mp4' },

    ],
    captionItems: [
      'Update paragraphs into TLDRs while still maintain context',
      'Change the vocabulary to suit the expertise of the reader',
      'Non destructive change, retains the original text',
    ],
  },
  {
    heading: 'Why not have some fun?',
    body: 'Help readers consume the content from different perspectives, does not serve a specific purpose but introducing new perspectives. \n \n Who knows what ideas can come out of reading different perspectives.',
    diagram: 'features/style.mp4',
  },
]

function renderFunctionalityCaptions(items?: string[], align: 'center' | 'left' = 'center') {
  if (!items) return null
  return (
    <ol className={`sm-functionality-caption-list${align === 'left' ? ' sm-functionality-caption-list--left' : ''}`}>
      {items.map((item, idx) => (
        <li className="sm-functionality-caption-item" key={idx}>
          <span className="type-caption1 sm-functionality-caption-num">{idx + 1}</span>
          <span className="type-caption1 sm-functionality-caption-text">{item}</span>
        </li>
      ))}
    </ol>
  )
}

export default function Semantic() {
  const pageRef = useRef<HTMLDivElement>(null)
  useStackingSections(pageRef, { fixedHeaderSelector: '.project-header' })

  const whatIsThisContentRef = useRef<HTMLDivElement>(null)
  useProportionalHeight(whatIsThisContentRef, 0.8)
  const activeWhatIsThisIndex = useActiveDiagramIndex(whatIsThisContentRef, {
    paragraphSelector: '.sm-whatisthis-para',
    fixedHeaderSelector: '.project-header',
    offsetPx: 130,
  })

  // "What is this?" lightbox (MediaLightbox) — index into
  // whatIsThisParagraphs, or null when closed.
  const [whatIsThisLightboxIndex, setWhatIsThisLightboxIndex] = useState<number | null>(null)

  // Tab switcher — per-paragraph, independently remembered. Only paragraphs
  // with `tabs` ever read from this.
  const [whatIsThisTabIndex, setWhatIsThisTabIndex] = useState<Record<number, number>>({})
  const getWhatIsThisTab = (i: number) => whatIsThisTabIndex[i] ?? 0

  // Same --cs-grid-toggle-h reservation as "The details" below.
  const whatIsThisGridStyle = {
    '--cs-grid-toggle-h': whatIsThisParagraphs[activeWhatIsThisIndex]?.tabs ? 'var(--space-3)' : '0px',
  } as CSSProperties

  const detailedContentRef = useRef<HTMLDivElement>(null)
  useProportionalHeight(detailedContentRef, 1)
  const activeDetailedIndex = useActiveDiagramIndex(detailedContentRef, {
    paragraphSelector: '.sm-detailed-para',
    fixedHeaderSelector: '.project-header',
    offsetPx: 130,
  })

  // "The detailed" lightbox (MediaLightbox) — index into detailedParagraphs, or
  // null when closed.
  const [detailedLightboxIndex, setDetailedLightboxIndex] = useState<number | null>(null)

  // Tab switcher — per-paragraph, independently remembered. Only paragraphs
  // with `tabs` ever read from this.
  const [detailedTabIndex, setDetailedTabIndex] = useState<Record<number, number>>({})
  const getDetailedTab = (i: number) => detailedTabIndex[i] ?? 0

  // Reserves --cs-grid-toggle-h (see CaseStudySection.css) only while the
  // active paragraph actually has tabs, so paragraphs without a switcher
  // don't get a dead gap above their media — computed here (rather than a
  // CSS `:has()` gate on `.active`) so it's tied to the same activeIndex
  // source of truth driving every other active-state toggle on this page.
  const detailedGridStyle = {
    '--cs-grid-toggle-h': detailedParagraphs[activeDetailedIndex]?.tabs ? 'var(--space-3)' : '0px',
  } as CSSProperties

  const functionalityContentRef = useRef<HTMLDivElement>(null)
  useProportionalHeight(functionalityContentRef, 1)
  const activeFunctionalityIndex = useActiveDiagramIndex(functionalityContentRef, {
    paragraphSelector: '.sm-functionality-para',
    fixedHeaderSelector: '.project-header',
    offsetPx: 130,
  })

  // "Functionality" lightbox (MediaLightbox) — index into
  // functionalityParagraphs, or null when closed.
  const [functionalityLightboxIndex, setFunctionalityLightboxIndex] = useState<number | null>(null)

  // Tab switcher — per-paragraph, independently remembered. Only paragraphs
  // with `tabs` ever read from this.
  const [functionalityTabIndex, setFunctionalityTabIndex] = useState<Record<number, number>>({})
  const getFunctionalityTab = (i: number) => functionalityTabIndex[i] ?? 0

  // Same --cs-grid-toggle-h reservation as "The details" above.
  const functionalityGridStyle = {
    '--cs-grid-toggle-h': functionalityParagraphs[activeFunctionalityIndex]?.tabs ? 'var(--space-3)' : '0px',
  } as CSSProperties

  const pageStyle = {
    '--cs-bg': PAGE_BG,
    '--cs-fg': PAGE_FG,
    '--cs-hover': PAGE_HOVER,
  } as CSSProperties

  return (
    <div className="sm" style={pageStyle}>
      <div className="sm-page" ref={pageRef}>

        {/* ── PAGE HEADER (sticky, always visible) ── */}
        <ProjectHeader title="Semantic: A dynamic web experience" bgColor={PAGE_BG} textColor={PAGE_FG} />

        {/* ── OVERVIEW — PLACEHOLDER COPY, replace once the real case study content is ready ── */}
        <StackedSection title="Overview">
          <CaseStudyIntro
            bgColor={PAGE_BG}
            textColor={PAGE_FG}
            hoverColor={PAGE_HOVER}
            description={[
              'A experimental reading surface that lets readers to mould text to their preferences. A passage can be tuned to change vocabulary, style, and the voice it’s written in.',
            ]}
            characteristics={{
              label: 'PROJECT CHARACTERISTICS',
              items: ['An interface that deliberately has no personality.',
                'The experience disappears into the act of reading.',
                'Designed to feel native in every context'],
            }}
            listLabel="SKILLS"
            responsibilities={[
              { prefix: 'AI assisted rapid prototyping' },
              { prefix: 'Interaction motion design'},
              { prefix: 'User interface design'},
            ]}
            media={{ src: imgPlaceholder, alt: 'Placeholder image', aspect: '16 / 10' }}
            twoColumn
          />
        </StackedSection>

        {/* ── WHAT IS THIS — PLACEHOLDER COPY, two-column CaseStudySection
             (see CLAUDE.md's "Two column" shorthand) ── */}
        <StackedSection title="What is this?">
          <div style={whatIsThisGridStyle}>
            <CaseStudySection
              mediaSpansRail
              rail={
                <div className="sm-whatisthis-notes">
                  {whatIsThisParagraphs.map((p, i) => (
                    <div
                      key={p.heading}
                      className={`sm-whatisthis-note-item${i === activeWhatIsThisIndex ? ' active' : ''}`}
                    >
                      {p.tabs && (
                        <div className="sm-whatisthis-tabs">
                          {p.tabs.map((tab, tIdx) => (
                            <button
                              key={tab.label}
                              type="button"
                              className={`type-body${getWhatIsThisTab(i) === tIdx ? ' active' : ''}`}
                              onClick={() => setWhatIsThisTabIndex((m) => ({ ...m, [i]: tIdx }))}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              }
              content={
                <div className="sm-whatisthis-paras" ref={whatIsThisContentRef}>
                  {whatIsThisParagraphs.map((p, i) => (
                    <div
                      className={`sm-whatisthis-para${i === activeWhatIsThisIndex ? ' active' : ''}`}
                      key={p.heading}
                    >
                      <p className="type-heading1 sm-whatisthis-heading">{p.heading}</p>
                      <p className="type-body sm-whatisthis-body">{p.body}</p>
                    </div>
                  ))}
                </div>
              }
              media={
                <div className="sm-whatisthis-diagrams">
                  {whatIsThisParagraphs.map((p, i) => {
                    const diagramSrc = whatIsThisDiagramFor(p, getWhatIsThisTab(i))
                    return (
                      <div
                        key={p.heading}
                        className={`sm-whatisthis-diagram-item${i === activeWhatIsThisIndex ? ' active' : ''}`}
                      >
                        {p.video ? (
                          <>
                            <video
                              className="sm-whatisthis-video"
                              src={asset(`/semantic/${p.video}`)}
                              autoPlay
                              loop
                              muted
                              playsInline
                            />
                            {renderWhatIsThisCaptions(p.captionItems, 'left')}
                          </>
                        ) : (
                          diagramSrc && (
                            <>
                              <button
                                type="button"
                                className="sm-whatisthis-image-trigger"
                                onClick={() => setWhatIsThisLightboxIndex(i)}
                                aria-label={`View larger: ${p.heading}`}
                              >
                                <img
                                  className="sm-whatisthis-image"
                                  src={asset(`/semantic/${diagramSrc}`)}
                                  alt={p.heading}
                                />
                              </button>
                              {renderWhatIsThisCaptions(p.captionItems, 'left')}
                            </>
                          )
                        )}
                      </div>
                    )
                  })}
                </div>
              }
            />
          </div>
        </StackedSection>

        {whatIsThisLightboxIndex !== null && (() => {
          const p = whatIsThisParagraphs[whatIsThisLightboxIndex]
          const diagramSrc = whatIsThisDiagramFor(p, getWhatIsThisTab(whatIsThisLightboxIndex))
          if (!diagramSrc) return null
          return (
            <MediaLightbox
              heading={p.heading}
              notes={p.captionItems}
              textColor={PAGE_FG}
              media={{ kind: 'image', src: asset(`/semantic/${diagramSrc}`), alt: p.heading }}
              onClose={() => setWhatIsThisLightboxIndex(null)}
            />
          )
        })()}

        {/* ── THE DETAILED — PLACEHOLDER COPY, two-column CaseStudySection
             (see CLAUDE.md's "Two column" shorthand) ── */}
        <StackedSection title="The details">
          <div style={detailedGridStyle}>
            <CaseStudySection
              mediaSpansRail
              rail={
                <div className="sm-detailed-notes">
                  {detailedParagraphs.map((p, i) => (
                    <div
                      key={p.heading}
                      className={`sm-detailed-note-item${i === activeDetailedIndex ? ' active' : ''}`}
                    >
                      {p.tabs && (
                        <div className="sm-detailed-tabs">
                          {p.tabs.map((tab, tIdx) => (
                            <button
                              key={tab.label}
                              type="button"
                              className={`type-body${getDetailedTab(i) === tIdx ? ' active' : ''}`}
                              onClick={() => setDetailedTabIndex((m) => ({ ...m, [i]: tIdx }))}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              }
              content={
                <div className="sm-detailed-paras" ref={detailedContentRef}>
                  {detailedParagraphs.map((p, i) => (
                    <div
                      className={`sm-detailed-para${i === activeDetailedIndex ? ' active' : ''}`}
                      key={p.heading}
                    >
                      <p className="type-heading1 sm-detailed-heading">{p.heading}</p>
                      <p className="type-body sm-detailed-body">{p.body}</p>
                    </div>
                  ))}
                </div>
              }
              media={
                <div className="sm-detailed-diagrams">
                  {detailedParagraphs.map((p, i) => {
                    const diagramSrc = diagramFor(p, getDetailedTab(i))
                    return (
                      <div
                        key={p.heading}
                        className={`sm-detailed-diagram-item${i === activeDetailedIndex ? ' active' : ''}`}
                      >
                        {p.video ? (
                          <>
                            <video
                              className="sm-detailed-video"
                              src={asset(`/semantic/${p.video}`)}
                              autoPlay
                              loop
                              muted
                              playsInline
                            />
                            {renderDetailedCaptions(p.captionItems, 'left')}
                          </>
                        ) : (
                          diagramSrc && (
                            <>
                              <button
                                type="button"
                                className="sm-detailed-image-trigger"
                                onClick={() => setDetailedLightboxIndex(i)}
                                aria-label={`View larger: ${p.heading}`}
                              >
                                <img
                                  className="sm-detailed-image"
                                  src={asset(`/semantic/${diagramSrc}`)}
                                  alt={p.heading}
                                />
                              </button>
                              {renderDetailedCaptions(p.captionItems, 'left')}
                            </>
                          )
                        )}
                      </div>
                    )
                  })}
                </div>
              }
            />
          </div>
        </StackedSection>

        {detailedLightboxIndex !== null && (() => {
          const p = detailedParagraphs[detailedLightboxIndex]
          const diagramSrc = diagramFor(p, getDetailedTab(detailedLightboxIndex))
          if (!diagramSrc) return null
          return (
            <MediaLightbox
              heading={p.heading}
              notes={p.captionItems}
              textColor={PAGE_FG}
              media={{ kind: 'image', src: asset(`/semantic/${diagramSrc}`), alt: p.heading }}
              onClose={() => setDetailedLightboxIndex(null)}
            />
          )
        })()}

        {/* ── FUNCTIONALITY — PLACEHOLDER COPY, two-column CaseStudySection
             (see CLAUDE.md's "Two column" shorthand) ── */}
        <StackedSection title="Functionality">
          <div style={functionalityGridStyle}>
            <CaseStudySection
              mediaSpansRail
              rail={
                <div className="sm-functionality-notes">
                  {functionalityParagraphs.map((p, i) => (
                    <div
                      key={p.heading}
                      className={`sm-functionality-note-item${i === activeFunctionalityIndex ? ' active' : ''}`}
                    >
                      {p.tabs && (
                        <div className="sm-functionality-tabs">
                          {p.tabs.map((tab, tIdx) => (
                            <button
                              key={tab.label}
                              type="button"
                              className={`type-body${getFunctionalityTab(i) === tIdx ? ' active' : ''}`}
                              onClick={() => setFunctionalityTabIndex((m) => ({ ...m, [i]: tIdx }))}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              }
              content={
                <div className="sm-functionality-paras" ref={functionalityContentRef}>
                  {functionalityParagraphs.map((p, i) => (
                    <div
                      className={`sm-functionality-para${i === activeFunctionalityIndex ? ' active' : ''}`}
                      key={p.heading}
                    >
                      <p className="type-heading1 sm-functionality-heading">{p.heading}</p>
                      <p className="type-body sm-functionality-body">{p.body}</p>
                    </div>
                  ))}
                </div>
              }
              media={
                <div className="sm-functionality-diagrams">
                  {functionalityParagraphs.map((p, i) => {
                    const { video, diagram } = functionalityMediaFor(p, getFunctionalityTab(i))
                    return (
                      <div
                        key={p.heading}
                        className={`sm-functionality-diagram-item${i === activeFunctionalityIndex ? ' active' : ''}`}
                      >
                        {video ? (
                          <>
                            <video
                              className="sm-functionality-video"
                              src={asset(`/semantic/${video}`)}
                              autoPlay
                              loop
                              muted
                              playsInline
                            />
                            {renderFunctionalityCaptions(p.captionItems, 'left')}
                          </>
                        ) : (
                          diagram && (
                            <>
                              <button
                                type="button"
                                className="sm-functionality-image-trigger"
                                onClick={() => setFunctionalityLightboxIndex(i)}
                                aria-label={`View larger: ${p.heading}`}
                              >
                                <img
                                  className="sm-functionality-image"
                                  src={asset(`/semantic/${diagram}`)}
                                  alt={p.heading}
                                />
                              </button>
                              {renderFunctionalityCaptions(p.captionItems, 'left')}
                            </>
                          )
                        )}
                      </div>
                    )
                  })}
                </div>
              }
            />
          </div>
        </StackedSection>

        {functionalityLightboxIndex !== null && (() => {
          const p = functionalityParagraphs[functionalityLightboxIndex]
          const { diagram } = functionalityMediaFor(p, getFunctionalityTab(functionalityLightboxIndex))
          if (!diagram) return null
          return (
            <MediaLightbox
              heading={p.heading}
              notes={p.captionItems}
              textColor={PAGE_FG}
              media={{ kind: 'image', src: asset(`/semantic/${diagram}`), alt: p.heading }}
              onClose={() => setFunctionalityLightboxIndex(null)}
            />
          )
        })()}

        <Footer textColor={PAGE_FG} />

      </div>
    </div>
  )
}
