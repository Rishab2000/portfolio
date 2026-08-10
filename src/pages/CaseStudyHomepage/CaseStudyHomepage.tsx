import './CaseStudyHomepage.css'
import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { asset } from '../../lib/nav'
import CaseStudyIntro from '../../components/CaseStudyIntro'
import CaseStudySection from '../../components/CaseStudySection'
import Footer from '../../components/Footer'
import ProjectHeader from '../../components/ProjectHeader'
import StackedSection from '../../components/StackedSection'
import RetrospectiveSection, { RetroRevealToggle } from '../../components/RetrospectiveSection'
import type { RetroSegment } from '../../components/RetrospectiveSection'
import { useStackingSections } from '../../hooks/useStackingSections'
import { useActiveDiagramIndex } from '../../hooks/useActiveDiagramIndex'

/* Whole-page colour scheme — change these two to retheme the entire page.
   Consumed as CSS custom properties (--cs-bg/--cs-fg/--cs-hover) set inline
   on the page root below, and passed as bgColor/textColor to every themed
   component (ProjectHeader, CaseStudyIntro, CaseStudySection). */
const PAGE_BG = '#802626'
const PAGE_FG = '#f5ecc2'
const PAGE_HOVER = '#E0DEF2'

interface ApproachParagraph {
  heading: string
  body: string
  diagram: string
  captionItems?: string[]
}

interface OutcomeHotspot {
  xPct: number
  yPct: number
}

interface OutcomeDiagram {
  /** default image, path relative to /homepage-modernization/outcomes/ */
  src: string
  /** optional hover-state image per hotspot, same order/length as hotspots */
  hovers?: string[]
  /** optional hit-zone position (% of image width/height) per hotspot, same order as hovers */
  hotspots?: OutcomeHotspot[]
}

interface OutcomeParagraph {
  label: string
  heading: string
  body: string
  diagram?: OutcomeDiagram
  captionItems?: string[]
}

/* copy (Figma node 287:1738 no-hover / 264:209 hover, file VQlMKH4DWH87cZ0JASPuyO) */
const retroSegments: RetroSegment[] = [
  {
    label: 'Designing',
    percent: '~30%',
    items: [
      'Detailing workflows',
      'Exploring, ideating and designing the framework',
      'Designing mockups and prototypes',
    ],
  },
  {
    label: 'User research and customer interaction',
    percent: '~25%',
    items: [
      'Customer interviews',
      'NPS surveys & feedback documents',
      'User testing & co-creation meetings',
    ],
  },
  {
    label: 'Stakeholder management',
    percent: '~15%',
    items: [
      'Feedback sessions & collaborative brainstorming',
      'Vision alignment',
      'Approvals and red tapes',
    ],
    narrow: true,
  },
  {
    label: 'Dev support and productisation',
    percent: '~35%',
    items: [
      'Design documentation for dev team',
      'Aligning with technical limitation',
      'Ensuring the shipped product showcased the desired experience',
      'Adapting design for phase wise implementation',
    ],
  },
]

/* copy + diagram pairing (Figma node 246:373, file VQlMKH4DWH87cZ0JASPuyO) */
const approachParagraphs: ApproachParagraph[] = [
  {
    heading: 'Articulating the business value',
    body: 'Through studying the product roadmap, strategy documents, speaking with the leadership, senior technical staff, observing competitor I was able to build a working understanding of the market and our business strategy.\n \n This helped me able to articulate benefits in a way that resonated with the stakeholders’ priorities.',
    diagram: 'articulating_the_business_value.svg',
    captionItems: [
      'It will reduce future maintenance cost',
      'Designing a simpler and intelligible homepage will make it easier target SMBs our core market',
      'It can help amplify our security strategy',
    ],
  },
  {
    heading: 'Identifying product issues the modernisation can target',
    body: 'The homepage is the starting point and should help IT admins begin their day easily. This simple understanding guided the research, I focused on understanding the challenges IT admins faced with daily workflows with the complete product.',
    diagram: 'indentifying_product_issues.svg',
  },
  {
    heading: 'Co-creating with stakeholders',
    body: "Without stakeholder support, customer benefits may remain unrealised. For this, I co-created the solution to ensure the project resonated with the stakeholders’ priorities.",
    diagram: 'cocreating_with_stakeholders.svg',
    captionItems: [
      'Involved key stakeholders from the beginning so that there was a feeling of ownership across the board.',
      'Communicated across multiple verticals to ensure the design approach covers all bases.',
      'Co-creating through multiple iterations until we arrived at a solution that we all believed in - one that would benefit users.',
    ],
  },
  {
    heading: 'Designing a framework',
    body: 'Without formal guidelines, I was responsible for designing a framework for the homepage. One ensured it can scale elegantly for any future changes or additions.',
    diagram: 'designing_a_framework.svg',
    captionItems: [
      'Designed a scalable framework that can help future teams expand the homepage’s capabilities.',
      'Defined design principles that was guidelines for a good homepage experience.',
      'Clear and explicit documentation so people could understand even without me in the room.',
    ],
  },
  {
    heading: 'Phase-wise deconstruction',
    body: 'Since this was a mammoth that had no official funding, I transformed the design into smaller, logical phases. These could then be picked up along with existing projects. \n \n Through this we reached a solid foundation, that was used as proof of concept to obtain formal development resources.',
    diagram: 'phasewise_deconstruction.svg',
    captionItems: [
      'Distilled the homepage into its core capabilities, ones that can be developed individually.',
      'Detailed design specs so that developers could pick it up asynchronously.',
      'Tested capabilities as they went out to continuously iterate through user feedback.',
    ],
  },
]

/* copy + diagram pairing (Figma node 264:159, file VQlMKH4DWH87cZ0JASPuyO) */
const outcomeParagraphs: OutcomeParagraph[] = [
  {
    label: 'Flexible architecture',
    heading: 'Maintains composure when faced with different use cases',
    body: 'The layout allows flexibility for customisation, fluidity for different data types and easy scalability and maintenance.',
    diagram: {
      src: 'flexibility/no_hover.png',
      hovers: ['flexibility/one_hover.png', 'flexibility/two_hover.png'],
      hotspots: [
        { xPct: 21.8, yPct: 29.7 },
        { xPct: 73.3, yPct: 75.2 },
      ],
    },
    captionItems: [
      'The fixed-width widgets with content hugging height affords a page structure to accommodate information of varying natures.',
      'Widgets can be moved around the dashboard without dirupting spacing and harmony',
    ],
  },
  {
    label: 'Data widgets',
    heading: 'Reduced no:of clicks by 72%',
    body: 'Through user research, surfaced key KPIs that resulted in quicker decisions and more efficient workflows.',
    diagram: {
      src: 'widgets.png',
    },
    captionItems: [
      'Designed a micro layout systems to ensure consistency with future widgets',
      'The widgets provide an overview for which admins previously had to navigate deep within the product to access.',
    ],
  },
  {
    label: 'Personalisation',
    heading: 'Homepage caters to the usecases of 35k plus users',
    body: 'The homepage is completely customisable to the user’s needs, research informed that cookie cutter approach would only cause increase user friction and engineering overhead.',
    diagram: {
      src: 'customisation/no_hover.png',
      hovers: ['customisation/one_hover.png', 'customisation/two_hover.png'],
      hotspots: [
        { xPct: 69.6, yPct: 39.7 },
        { xPct: 89.2, yPct: 88.9 },
      ],
    },
    captionItems: [
      'User’s can make customise their homepage with the widgets that align workflows or usecases.',
      'Designed a catalogue of widgets that will grow and scale as the product evolves.',
    ],
  },
  {
    label: 'Beyond this',
    heading: 'More details over a conversation ;)',
    body: 'If you’re interested I’d love to  walk you through my process and share more design examples for this project.',
  },
]

/* image assets (Figma node 187:434) */
const imgOldHome = asset('/homepage-modernization/old-homepage.png')

/* image assets (Figma node 159:147 — CaseStudyIntro) */
const imgIntro = asset('/homepage-modernization/intro_image.png')

export default function CaseStudyHomepage() {
  const pageRef = useRef<HTMLDivElement>(null)
  useStackingSections(pageRef, { fixedHeaderSelector: '.project-header' })

  const [retroRevealMode, setRetroRevealMode] = useState<'stay' | 'disappear'>('stay')

  const approachContentRef = useRef<HTMLDivElement>(null)
  const activeDiagramIndex = useActiveDiagramIndex(approachContentRef, {
    paragraphSelector: '.approach-para',
    fixedHeaderSelector: '.project-header',
    offsetPx: 130,
  })

  const outcomesContentRef = useRef<HTMLDivElement>(null)
  const activeOutcomeIndex = useActiveDiagramIndex(outcomesContentRef, {
    paragraphSelector: '.cs-outcomes-para',
    fixedHeaderSelector: '.project-header',
    offsetPx: 130,
  })

  const pageStyle = {
    '--cs-bg': PAGE_BG,
    '--cs-fg': PAGE_FG,
    '--cs-hover': PAGE_HOVER,
  } as CSSProperties

  return (
    <div className="cs" style={pageStyle}>
      <div className="cs-page" ref={pageRef}>

        {/* ── PAGE HEADER (sticky, always visible) ── */}
        <ProjectHeader
          title="Modernizing IBM MaaS360’s dashboard"
          bgColor={PAGE_BG}
          textColor={PAGE_FG}
        />

        {/* ── OVERVIEW (CaseStudyIntro) ── */}
        <StackedSection title="Overview">
          <CaseStudyIntro
            bgColor={PAGE_BG}
            textColor={PAGE_FG}
            hoverColor={PAGE_HOVER}
            description="Starting out as an incubator project this moved to create the face of the product. This involved complete re-architecting and re-designing MaaS360’s homepage dashboard, building a scalable design framework that will sustain any future additions."
            responsibilities={[
              { prefix: 'Defined', link: 'business value', description: 'Simpler management flows makes it an attractive purchase for smaller businesses, expanding our market scope' },
              { prefix: 'Conducted', link: 'user research', description: 'Initiated MaaS360’s first ever user interviews to initiate a customer focused approach and process' },
              { prefix: 'Drove', link: 'C-suite consensus', description: 'Advocated the business and user value of modernisation to leadership to ensure development prioritisation.' },
              { prefix: 'Created', link: 'design framework', description: 'Designed a scalable UI framework that ensured consistency to future developments to the homepage' },
              { prefix: 'Delivered', link: 'dev ready mockups', description: 'Seamlessly transitioned from design to development, supported the dev team in shipping a design accurate output' },
              { prefix: 'Facilitated', link: 'user feedback sessions', description: 'Regularly reviewed designs with customers to ensure quality and alignment with expectations and requirements.' },
            ]}
            results={[
              { label: 'Adoption rate during beta testing', stat: '~ 60%' },
              { label: 'No:of clicks for key workflows', stat: '↓ 72%' },
              { label: 'Time to complete key workflows', stat: '↓ 27%' },
            ]}
            media={{ src: imgIntro, alt: 'IBM MaaS360 product overview collage', aspect: '1024 / 1626' }}
          />
        </StackedSection>

        {/* ── RETROSPECTIVE ── */}
        <StackedSection
          title="Retrospective"
          headerRight={
            <RetroRevealToggle
              checked={retroRevealMode === 'stay'}
              onToggle={() => setRetroRevealMode((m) => (m === 'stay' ? 'disappear' : 'stay'))}
            />
          }
        >
          <RetrospectiveSection segments={retroSegments} revealMode={retroRevealMode} />
        </StackedSection>

        {/* ── CHALLENGES ── */}
        <StackedSection title="Challenges">
          <div className="cs-section pad24">
            <div className="cs-inner cs-challenge">
              <div className="cs-challenge-top">
                <div className="cs-challenge-intro">
                  <p className="cs-challenge-eyebrow type-body">Problem given to me</p>
                  <p className="cs-challenge-quote type-heading2">Modernise our 12 year old homepage to align with our product&rsquo;s current design.</p>
                </div>
                <div className="cs-challenge-artifact">
                  <div className="cs-oldhome">
                    <img src={imgOldHome} alt="Old MaaS360 homepage" />
                  </div>
                  {/* <p className="cs-challenge-caption type-caption1">The homepage, unchanged since 2012</p> */}
                </div>
              </div>

              <div className="cs-challenge-issues">
                <p className="cs-challenge-eyebrow type-body">Problems that I uncovered</p>
                <div className="cs-challenge-grid">
                  <div className="cs-challenge-col">
                    <div className="cs-challenge-item">
                      <p className="cs-challenge-item-ttl type-heading1">No summarized system status</p>
                      <p className="cs-challenge-item-desc type-body">IT admins are required to view multiple pages to gather information, to later piece it together from memory to form a complete understanding.</p>
                    </div>
                    <div className="cs-challenge-item">
                      <p className="cs-challenge-item-ttl type-heading1">Lengthy navigation paths</p>
                      <p className="cs-challenge-item-desc type-body">Our product offers a rich amount of information, however users need to follow lengthy workflows to find the details they need.</p>
                    </div>
                    <div className="cs-challenge-item">
                      <p className="cs-challenge-item-ttl type-heading1">Lack of flexibility</p>
                      <p className="cs-challenge-item-desc type-body">Existing capabilities lack contextualization, adding unnecessary noise/information to customers with specific needs.</p>
                    </div>
                    <div className="cs-challenge-axis-col">
                      <div className="cs-challenge-axis-rule" />
                      <p className="cs-challenge-axis-label type-caption1">Design problems</p>
                    </div>
                  </div>
                  <div className="cs-challenge-col">
                    <div className="cs-challenge-item">
                      <p className="cs-challenge-item-ttl type-heading1">No business requirements</p>
                      <p className="cs-challenge-item-desc type-body">Product team was not involved, this was an incubator project run by the engineering and design team, as a result there was no guidance on business direction</p>
                    </div>
                    <div className="cs-challenge-item">
                      <p className="cs-challenge-item-ttl type-heading1">Unclear design patterns</p>
                      <p className="cs-challenge-item-desc type-body">IBM design patterns for analytical homepages was still in its nascent stages, the carbon design team was working on a scaleable framework for homepages</p>
                    </div>
                    <div className="cs-challenge-item">
                      <p className="cs-challenge-item-ttl type-heading1">No funding to productise</p>
                      <p className="cs-challenge-item-desc type-body">As this was an incubator project, means to productise was through volunteers, there was no formal pipeline to deliver the feature to customers.</p>
                    </div>
                    <div className="cs-challenge-axis-col">
                      <div className="cs-challenge-axis-rule" />
                      <p className="cs-challenge-axis-label type-caption1">Systemic challenges</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </StackedSection>

        {/* ── APPROACH ── */}
        <StackedSection title="Approach">
          <CaseStudySection
            bgColor={PAGE_BG}
            textColor={PAGE_FG}
            content={
              <div className="cs-approach-paras" ref={approachContentRef}>
                {approachParagraphs.map((p, i) => (
                  <div
                    className={`approach-para${i === activeDiagramIndex ? ' active' : ''}`}
                    key={p.heading}
                  >
                    <p className="type-body approach-para-heading">{p.heading}</p>
                    <p className="type-body approach-para-body">{p.body}</p>
                  </div>
                ))}
              </div>
            }
            media={
              <div className="cs-approach-diagrams">
                {approachParagraphs.map((p, i) => (
                  <div
                    key={p.heading}
                    className={`cs-approach-diagram-item${i === activeDiagramIndex ? ' active' : ''}`}
                  >
                    <img
                      src={asset(`/homepage-modernization/diagrams/svgs/${encodeURIComponent(p.diagram)}`)}
                      alt={p.heading}
                    />
                    {p.captionItems && (
                      <ol className="cs-approach-caption-list">
                        {p.captionItems.map((item, idx) => (
                          <li className="cs-approach-caption-item" key={idx}>
                            <span className="type-caption1 cs-approach-caption-num">{idx + 1}</span>
                            <span className="type-caption1 cs-approach-caption-text">{item}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                ))}
              </div>
            }
          />
        </StackedSection>

        {/* ── DESIGN OUTCOMES (264:159) ── */}
        <StackedSection title="Design outcomes">
          <CaseStudySection
            bgColor={PAGE_BG}
            textColor={PAGE_FG}
            content={
              <div className="cs-outcomes-paras" ref={outcomesContentRef}>
                {outcomeParagraphs.map((p, i) => (
                  <div
                    className={`cs-outcomes-para${i === activeOutcomeIndex ? ' active' : ''}`}
                    key={p.label}
                  >
                    <p className="type-body cs-outcomes-label">{p.label}</p>
                    <p className="type-heading1 cs-outcomes-heading">{p.heading}</p>
                    <p className="type-body cs-outcomes-body">{p.body}</p>
                  </div>
                ))}
              </div>
            }
            media={
              <div className="cs-outcomes-diagrams">
                {outcomeParagraphs.map((p, i) => (
                  <div
                    key={p.label}
                    className={`cs-outcomes-diagram-item${i === activeOutcomeIndex ? ' active' : ''}`}
                  >
                    {p.diagram && (
                      <div className="cs-outcomes-image-stack">
                        <img
                          className="cs-outcomes-image cs-outcomes-image-base"
                          src={asset(`/homepage-modernization/outcomes/${p.diagram.src}`)}
                          alt={p.heading}
                        />
                        {p.diagram.hovers?.map((hover, idx) => (
                          <img
                            key={hover}
                            className="cs-outcomes-image cs-outcomes-image-variant"
                            data-variant={idx + 1}
                            src={asset(`/homepage-modernization/outcomes/${hover}`)}
                            alt=""
                            aria-hidden="true"
                          />
                        ))}
                        {p.diagram.hotspots?.map((spot, idx) => (
                          <div
                            key={idx}
                            className="cs-outcomes-hotspot"
                            data-hotspot={idx + 1}
                            style={{ left: `${spot.xPct}%`, top: `${spot.yPct}%` }}
                          />
                        ))}
                      </div>
                    )}
                    {p.captionItems && (
                      <ol className="cs-outcomes-caption-list">
                        {p.captionItems.map((item, idx) => (
                          <li className="cs-outcomes-caption-item" data-caption={idx + 1} key={idx}>
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
          />
        </StackedSection>

        <Footer textColor={PAGE_FG} />

      </div>
    </div>
  )
}
