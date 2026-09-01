import './CaseStudyHumanAI.css'
import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { asset } from '../../lib/nav'
import CaseStudyIntro from '../../components/CaseStudyIntro'
import CaseStudySection from '../../components/CaseStudySection'
import Footer from '../../components/Footer'
import MediaLightbox from '../../components/MediaLightbox'
import ProjectHeader from '../../components/ProjectHeader'
import StackedSection from '../../components/StackedSection'
import RetrospectiveSection, { RetroRevealToggle } from '../../components/RetrospectiveSection'
import type { RetroSegment } from '../../components/RetrospectiveSection'
import { useStackingSections } from '../../hooks/useStackingSections'
import { useActiveDiagramIndex } from '../../hooks/useActiveDiagramIndex'
import { useProportionalHeight } from '../../hooks/useProportionalHeight'
import { useScrollRevealProgress } from '../../hooks/useScrollRevealProgress'
import { useHoverReveal } from '../../hooks/useHoverReveal'

/* Overview/header colour scheme (Figma node 363:586) — change these to retheme the sticky
   header + Overview section. Unlike CaseStudyHomepage, this page is NOT single-toned
   end-to-end (every section below has its own accent color on a white canvas), so these
   vars are scoped to `.ai-page`, not the outer `.ai` wrapper — `.ai` must stay white for
   the untouched sections' own backgrounds to read correctly. Consumed as CSS custom
   properties (--cs-bg/--cs-fg/--cs-hover) set inline below, and passed as
   bgColor/textColor/hoverColor to ProjectHeader and CaseStudyIntro. Named --cs-* (not
   --ai-*) because RetrospectiveSection.css hardcodes those exact variable names — it has
   no color props, it only inherits theme from an ancestor. */
const PAGE_BG = '#12354e'
const PAGE_FG = '#f99d1b'
const PAGE_HOVER = '#f5ecc2'

/* "Aligning on the purpose" section colour override — passed to that one
   StackedSection, which sets --cs-bg/--cs-fg/--cs-hover on its header + wrapper;
   the nested CaseStudySection inherits (no colour props needed there). Set to
   the page defaults for now; change these three to retheme just that section. */
const PURPOSE_BG = PAGE_BG
const PURPOSE_FG = PAGE_FG
const PURPOSE_HOVER = PAGE_HOVER

/* "Tad too sensitive" closing section colour override — same mechanism (passed
   to its StackedSection). */
const NOTE_BG = '#fdbf68'
const NOTE_FG = PAGE_BG

/* Footer colour override — `bgColor` fills the (otherwise transparent) footer,
   `textColor` drives its text + borders. */
const FOOTER_BG = '#fdbf68'
const FOOTER_FG = PAGE_BG

interface PurposeReveal {
  key: string
  description: string
}

const purposeReveals: PurposeReveal[] = [
  { key: 'SMBs', description: 'MaaS360’s strategy was to acquire the SMB market for mobile device management.' },
  { key: 'secure their devices', description: 'The global average cost of a data breach is $4.4M, maintaining security is pivotal to ensure business continuity' },
  { key: 'minimal effort', description: 'The market was filled with bloated and complex solutions, creating an opportunity for a simpler option.' },
]

/* Left-column scroll-linked list (Figma node 642:8869 / 642:8972) — same
   architecture as AI Design Principles: the paragraph in the activation zone
   inverts to the hover colour, and the last one ("Why?") being active is what
   flips the sticky North star column from 12% to full opacity. */
interface PurposeParagraph {
  heading: string
  body: string
}

const purposeParagraphs: PurposeParagraph[] = [
  { heading: 'We wanted to...', body: 'Build the first AI offering for MaaS360, we wanted make a mark and set the boat sailing for future features.' },
  { heading: 'We hoped to...', body: 'We hoped that GenAI would be the core of our functionality, such that it helps with marketability on release.' },
  { heading: 'We aimed for...', body: 'Finding relevant places where we could use the technology, aimed at finding these workflows.' },
  { heading: 'Why?', body: 'This lead us down a path were we were focused on implementing the tech rather than delivering value.' },
]

interface AIPrincipleParagraph {
  heading: string
  body: string
  diagram?: string
  captionItems?: string[]
}

/* copy + diagram pairing (Figma node 427:410 / 427:843 / 427:890 / 427:916) */
const aiPrinciplesParagraphs: AIPrincipleParagraph[] = [
  { heading: 'Why?', body: 'Establish the framework for all AI experiences, that way this effort will have it’s ripples for future offerings.' },
  {
    heading: 'Proactive',
    body: 'Anticipate, predict and intervene before the user has resolve the issue or feel friction.',
    diagram: 'proactive.png',
    captionItems: [
      'Prioritise designing AI capabilities that avoid deployment problems, over diagnosing them.',
      'Nudge users only when required, do not introduce noise through false positives or superficial insights.',
      'Clarify an AI feature’s capabilities and limitations.',
    ],
  },
  {
    heading: 'Integrated',
    body: 'Compound and enhance established workflows, making existing workflows cumbersome with AI will be a failure on our part.',
    diagram: 'integrate.png',
    captionItems: [
      'Do not re-invent the wheel, make it run smoother.',
      'Minimise the separation between traditional product functionality and AI functionality.',
      'Do not default to the chat interface, evaluate and establish the need for chat.',
    ],
  },
  {
    heading: 'Contextualized',
    body: 'Design mouldable experiences, the functionality should adapt to diverse customer needs and contexts.',
    diagram: 'contextualize.png',
    captionItems: [
      'Morph workflows and granularity proportional to the size of the organisation.',
      'Contextualise organisation strategy for insights and recommendations, avoid generic intervention',
      'Information shown should always relate to the active page, workflow or surrounding information.'
    ],
  },
]

interface TransparencyTab {
  label: string
  src: string
}

interface TransparencyParagraph {
  label: string
  heading: string
  body: string
  diagram?: string
  tabs?: TransparencyTab[]
  captionItems?: string[]
}

/* copy + diagram pairing (Figma node 433:1151 / 433:10051 / 433:10070) */
const transparencyParagraphs: TransparencyParagraph[] = [
  {
    label: 'Clarity',
    heading: 'Reduce the black box feeling',
    body: 'Manage expectations by clearly communicating what the system is doing, how, and what information is used.',
    diagram: 'explainability.png',
    captionItems: [
      'Clear definition of the capability to manage user expectations',
      'Transparancy of AI model, and ability to learn more details',
      'Clarifies the process we use to generate insights',
    ],
    
  },
  {
    label: 'Always beta',
    heading: 'First ever realtime feedback and telemetry',
    body: 'Allowed design, product, and development to easily view and access user feedback. Fostered a user centred culture that complemented the existing engineering focus',
    tabs: [
      { label: 'Reinforcement', src: 'feedback positive.png' },
      { label: 'Reconsider', src: 'feedback negative.png' },
    ],
     captionItems: [
      'Enabled wider reach while saving time.',
      'Generated generic and detailed user sentiment metrics.',
      'Utilized to plan and clarify roadmap for this new business direction'

    ],
  },
]

interface PolicyRecParagraph {
  heading: string
  body: string
  diagram?: string
  video?: string
  captionItems?: string[]
}

/* copy + diagram pairing (Figma node 453:10105 / 453:26648 / 453:26680 / 453:26711) */
const policyRecParagraphs: PolicyRecParagraph[] = [
  {
    heading: 'Reducing the time to value from weeks to minutes.',
    body: 'Customers can align to security standards (STIGS, HIIPA, GDPR, etc) with a click of a button.\n \n An effort that required weeks of research and implementation.',
    diagram: 'Configure.png',
    video:'configure.mp4',
    captionItems: [
      'Lowers the costs for large organisations to meet compliance requirements',
      'Faster and more secure out of the box deployments for small and medium businesses',
      'Allows users focus on the required outcome, not configuration technicalities',

    ],
  },
  {
    heading: 'Lowering maintenance costs',
    body: 'Organisations can reduce operational resources for policy up-keep, as policies are automatically reviewed. \n \n Actionable recommendations point to the exact changes required to stay secure.',
    diagram: 'recommendations.png',
    video: 'recommendations.mp4',
    captionItems: [
      'Our business logic helps customers identify security gaps and upgrade policies when required.',
      'Significantly reduced the time users spent researching, testing, and updating policy settings.',
    ],
  },
  {
    heading: 'Controlled automation minimizes outages.',
    body: 'Misconfigured policies are often the reason for outages and productivity loss. \n \n The user experience prioritizes human review over heavy automation, avoiding bulk or hard to trace changes.',
    diagram: 'apply_recommendations.png',
    video: 'maintenance.mp4',
    captionItems: [
      'Trust human judgement on final decisions to update and deploy policies',
      'New language guidelines prioritizes clear cause-and-effect explainability',
      'A click through experience allows easy review before applying recommended changes.',
    ],
  },
  {
    heading: 'Quicker knowledge transfer',
    body: 'Our customers experience high IT admin turnover, and are burdened with constant re-onboarding. \n \n Policy summarizations reduce the time it takes for a new admin to contribute',
    diagram: 'summerization.png',
    video:'summerisations.mp4',
    captionItems: [
      'Transfer of basic knowledge is handled in-product, allowing more time for discussing questions, architecture and strategy.',
      'Benefits compond for organsations with 10-15 complex policies.',
    ],
  },
]

/* Shared between rail (screenshot mode) and media (video mode, below the video) — see
   the Screenshot/Video toggle in the Policy recommendations CaseStudySection call.
   `left` matches the video's caption placement (left-aligned under the widened media,
   like rail's own column) instead of the screenshot's centered-under-the-image default. */
function renderPolicyRecCaptions(items?: string[], align: 'center' | 'left' = 'center') {
  if (!items) return null
  return (
    <ol className={`ai-policyrec-caption-list${align === 'left' ? ' ai-policyrec-caption-list--left' : ''}`}>
      {items.map((item, idx) => (
        <li className="ai-policyrec-caption-item" key={idx}>
          <span className="type-caption1 ai-policyrec-caption-num">{idx + 1}</span>
          <span className="type-caption1 ai-policyrec-caption-text">{item}</span>
        </li>
      ))}
    </ol>
  )
}

/* Placeholder — update with this project's real time-allocation breakdown. */
const retroSegments: RetroSegment[] = [
  { label: 'Designing', percent: '~30%', items: ['Creating MaaS360 AI design guidelines', 'User experience workflow mapping', 'UI design'],  },
  { label: 'Dev support', percent: '~10%', items: ['Structuring figma files for seamless dev transition', 'Regular review and feedback sessions', 'Negotiating UX and technical compromises'], narrow: true, breakoutWidthPct: 220 },
  { label: 'Collaborating and strategising', percent: '~60%', items: ['Defining business logic along architects and product managers', 'Researching, defining and aligning on MaaS360‘s AI northstar', 'Researching and defining rate based monetisation system', 'Stakeholder meetings and buy-ins'] },
]

/* image assets (Figma node 40:3904) */
const imgIntroMockup = asset('/human_ai_ibm/ibm-homepage%202.png')
const imgContext = asset('/human_ai_ibm/context.png')

export default function CaseStudyHumanAI() {
  const pageRef = useRef<HTMLDivElement>(null)
  useStackingSections(pageRef, { fixedHeaderSelector: '.project-header' })

  const [retroRevealMode, setRetroRevealMode] = useState<'stay' | 'disappear'>('stay')

  // Only the `hovered` half of the hover-reveal is used now — the North star
  // notes are always rendered (they're part of the scroll wipe), so hovering a
  // term just highlights its matching note while the pointer is over it.
  const {
    hovered: purposeHovered,
    onEnter: onPurposeEnter,
    onLeave: onPurposeLeave,
  } = useHoverReveal<string>()

  const purposeContentRef = useRef<HTMLDivElement>(null)
  useProportionalHeight(purposeContentRef, 0.8)
  const activePurposeIndex = useActiveDiagramIndex(purposeContentRef, {
    paragraphSelector: '.ai-purpose-para',
    fixedHeaderSelector: '.project-header',
    offsetPx: 130,
  })
  // 0 → 1 wipe progress for the North star reveal (0 at "We wanted to…", 1 once
  // "Why?" reaches the top). Drives the veil height; terms unlock at 1.
  const purposeRevealProgress = useScrollRevealProgress(purposeContentRef, {
    paragraphSelector: '.ai-purpose-para',
    fixedHeaderSelector: '.project-header',
    offsetPx: 130,
  })
  const purposeUnlocked = purposeRevealProgress >= 1

  const principlesContentRef = useRef<HTMLDivElement>(null)
  useProportionalHeight(principlesContentRef, 0.5)
  const activePrincipleIndex = useActiveDiagramIndex(principlesContentRef, {
    paragraphSelector: '.ai-principles-para',
    fixedHeaderSelector: '.project-header',
    offsetPx: 130,
  })

  const transparencyContentRef = useRef<HTMLDivElement>(null)
  useProportionalHeight(transparencyContentRef, 0.5)
  const activeTransparencyIndex = useActiveDiagramIndex(transparencyContentRef, {
    paragraphSelector: '.ai-transparency-para',
    fixedHeaderSelector: '.project-header',
    offsetPx: 130,
  })

  const [feedbackTabIndex, setFeedbackTabIndex] = useState(0)

  // Transparency and trust lightbox (MediaLightbox) — index into
  // transparencyParagraphs, or null when closed.
  const [transparencyLightboxIndex, setTransparencyLightboxIndex] = useState<number | null>(null)
  const transparencyLightboxItem = transparencyLightboxIndex !== null ? transparencyParagraphs[transparencyLightboxIndex] : null
  // A tabbed item's lightbox media follows whichever tab is currently selected.
  const transparencyLightboxSrc = transparencyLightboxItem
    ? (transparencyLightboxItem.tabs ? transparencyLightboxItem.tabs[feedbackTabIndex].src : transparencyLightboxItem.diagram)
    : null

  const policyRecContentRef = useRef<HTMLDivElement>(null)
  useProportionalHeight(policyRecContentRef, 0.5)
  const activePolicyRecIndex = useActiveDiagramIndex(policyRecContentRef, {
    paragraphSelector: '.ai-policyrec-para',
    fixedHeaderSelector: '.project-header',
    offsetPx: 130,
  })

  // Policy recommendations lightbox (MediaLightbox) — index into
  // policyRecParagraphs, or null when closed.
  const [policyRecLightboxIndex, setPolicyRecLightboxIndex] = useState<number | null>(null)

  // Screenshot/Video toggle — per-paragraph, independently remembered (switching one
  // paragraph to video doesn't affect any other paragraph's mode). Only paragraphs with
  // a `video` ever read from this; everything else always renders as screenshot.
  const [policyRecMediaMode, setPolicyRecMediaMode] = useState<Record<number, 'screenshot' | 'video'>>({})
  const getPolicyRecMode = (i: number) =>
    policyRecParagraphs[i]?.video && policyRecMediaMode[i] === 'video' ? 'video' : 'screenshot'

  const pageStyle = {
    '--cs-bg': PAGE_BG,
    '--cs-fg': PAGE_FG,
    '--cs-hover': PAGE_HOVER,
  } as CSSProperties

  return (
    <div className="ai" style={pageStyle}>
      <div className="ai-page" ref={pageRef}>

        {/* ── PAGE HEADER (sticky, always visible) ── */}
        <ProjectHeader
          title="Human + AI at IBM MaaS360"
          bgColor={PAGE_BG}
          textColor={PAGE_FG}
        />

        {/* ── OVERVIEW (CaseStudyIntro) — Figma node 363:586 ── */}
        <StackedSection title="Overview">
          <CaseStudyIntro
            bgColor={PAGE_BG}
            textColor={PAGE_FG}
            hoverColor={PAGE_HOVER}
            description="Initiated the design and development the first ever GenAI capability for MaaS360. Along with the product team, I was deeply involved at every step in the product lifecycle from envisioning the offering to its delivery."
            responsibilities={[
              { prefix: 'Along wiht the PM, defined', link: 'monetisation strategy', description: 'Created a new usage based monitisation system to ensure revenue scales with GenAI costs' },
              { prefix: 'Core member involved in defining the', link: 'business logic', description: 'Worked closely with the engineering team to build a business logic that ensured the desired user experience.' },
              { prefix: 'Drove the project with a', link: 'mini startup culture', description: 'As I was part of the founding members, I was also responsible for contributing to the culture of the team.' },
              { prefix: "Defined the product's", link: 'AI design guidelines', description: 'Studied AI, GenAI and LLM design frameworks, systems and examples to define MaaS360 AI design guidelines, that ensured every experience remains aligned' },
              { prefix: 'Delivered', link: 'dev ready mockups', description: 'Seamlessly transitioned from design to development, supported the dev team in shipping a design accurate output' },
            ]}
            results={[
              { label: 'Engagement rate', stat: '~ 72%' },
              { label: 'Users adoption', stat: '~ 52%' },
              // { label: 'Best AI infusion in Software products at IBM', stat: 'Ranked 2nd' },
              { label: 'Customer feedback', stat: 'This should be in CNN and other news channels , it is a killer idea for regulated customers like us. We use it extensively now' },
            ]}
            media={{ src: imgIntroMockup, alt: 'IBM MaaS360 policy mockup collage', aspect: '1148 / 1046' }}
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
          <div className="ai-retro-wrap">
            <RetrospectiveSection segments={retroSegments} revealMode={retroRevealMode} height="60vh" hint="Give this a hover" />
          </div>
        </StackedSection>

        {/* ── CONTEXT (Figma node 363:682) ── */}
        <StackedSection title="Context">
          <div className="ai-context-content">
            <div className="ai-context-cols cs-sticky">
              <div className="ai-context-col">
                <p className="ai-context-label type-heading1">What is policy management?</p>
                <p className="ai-context-body type-body">A security feature that lets IT administrators enforce rules, settings, and restrictions on corporate devices.</p>
              </div>
              <div className="ai-context-col">
                <p className="ai-context-label type-heading1">What is the issue?</p>
                <p className="ai-context-body type-body"> As this offers granual control over hundreds of device functionality, creating an information heavy experience. It reaquired users to be proficient in all security standards.</p>
              </div>
              <div className="ai-context-col">
                <p className="ai-context-label type-heading1">Who are our users?</p>
                <p className="ai-context-body type-body">Small or medium business owners with no background in IT security. Or they're an overstretched IT admin, busy fixing technical issues.</p>
              </div>
            </div>
            <div className="ai-context-media">
              <p className="ai-context-label type-caption1">The policy mangement UI</p>
              <div className="ai-context-images">
                <div className="ai-context-image"><img src={imgContext} alt="MaaS360 Default iOS MDM Policy configuration screen" /></div>
                <div className="ai-context-image"><img src={imgContext} alt="MaaS360 Default iOS MDM Policy configuration screen" /></div>
              </div>
            </div>
          </div>
        </StackedSection>

        {/* ── ALIGNING ON THE PURPOSE (Figma node 642:8869 / 642:8972) ──
             Same CaseStudySection scroll-linked architecture as AI Design
             Principles / Policy recommendations: `content` is the left column
             that scrolls through 4 paragraphs (active one inverts to the hover
             colour); `media` (spanning the rail track — no rail here) is the
             sticky North star, revealed by a top-down wipe driven by
             useScrollRevealProgress (0 at "We wanted to…", 1 once "Why?" hits
             the top). The three terms only become hoverable at full reveal. */}
        <StackedSection
          title="Aligning on the purpose"
          bgColor={PURPOSE_BG}
          textColor={PURPOSE_FG}
          hoverColor={PURPOSE_HOVER}
        >
          <CaseStudySection
            mediaSpansRail
            content={
              <div className="ai-purpose-paras" ref={purposeContentRef}>
                {purposeParagraphs.map((p, i) => (
                  <div
                    className={`ai-purpose-para${i === activePurposeIndex ? ' active' : ''}`}
                    key={p.heading}
                  >
                    <p className="type-heading1 ai-purpose-para-heading">{p.heading}</p>
                    <p className="type-body ai-purpose-para-body">{p.body}</p>
                  </div>
                ))}
              </div>
            }
            media={
              <div className={`ai-purpose-northstar${purposeUnlocked ? ' unlocked' : ''}`}>
                <div className="ai-purpose-northstar-heading-group">
                  <p className="ai-purpose-label type-body">NORTH STAR</p>
                  <p className="ai-purpose-heading type-heading2">
                    Help{' '}
                    <span className="ai-purpose-term" onMouseEnter={purposeUnlocked ? () => onPurposeEnter('SMBs') : undefined} onMouseLeave={purposeUnlocked ? onPurposeLeave : undefined}>SMBs</span>{' '}
                    configure and maintain policies so that they can{' '}
                    <span className="ai-purpose-term" onMouseEnter={purposeUnlocked ? () => onPurposeEnter('secure their devices') : undefined} onMouseLeave={purposeUnlocked ? onPurposeLeave : undefined}>secure their devices</span>{' '}
                    with{' '}
                    <span className="ai-purpose-term" onMouseEnter={purposeUnlocked ? () => onPurposeEnter('minimal effort') : undefined} onMouseLeave={purposeUnlocked ? onPurposeLeave : undefined}>minimal effort</span>{' '}
                    to help redirect resources towards growing their business.
                  </p>
                </div>
                <div className="ai-purpose-reveal-col">
                  {purposeReveals.map((r) => (
                    <div
                      key={r.key}
                      className={`ai-purpose-reveal-box${purposeUnlocked && r.key === purposeHovered ? ' active' : ''}`}
                    >
                      <p className="ai-purpose-body type-body">{r.description}</p>
                    </div>
                  ))}
                </div>
                {/* Dimming veil — bottom-anchored, height shrinks as you scroll,
                    wiping the reveal in from the top. Height is the only thing
                    that changes per frame. */}
                <div
                  className="ai-purpose-northstar-veil"
                  aria-hidden="true"
                  style={{ height: `${(1 - purposeRevealProgress) * 100}%` }}
                />
              </div>
            }
          />
        </StackedSection>

        {/* ── AI DESIGN PRINCIPLES (Figma node 427:410) ── */}
        <StackedSection title="AI Design Principles">
          <CaseStudySection
            bgColor={PAGE_BG}
            textColor={PAGE_FG}
            rail={
              <div className="ai-principles-notes">
                {aiPrinciplesParagraphs.map((p, i) => (
                  <div
                    key={p.heading}
                    className={`ai-principles-note-item${i === activePrincipleIndex ? ' active' : ''}`}
                  >
                    {p.captionItems && (
                      <ol className="ai-principles-caption-list">
                        {p.captionItems.map((item, idx) => (
                          <li className="ai-principles-caption-item" key={idx}>
                            <span className="type-caption1 ai-principles-caption-num">{idx + 1}</span>
                            <span className="type-caption1 ai-principles-caption-text">{item}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                ))}
              </div>
            }
            content={
              <div className="ai-principles-paras" ref={principlesContentRef}>
                {aiPrinciplesParagraphs.map((p, i) => (
                  <div
                    className={`ai-principles-para${i === activePrincipleIndex ? ' active' : ''}`}
                    key={p.heading}
                  >
                    <p className="type-body ai-principles-para-heading">{p.heading}</p>
                    <p className="type-body ai-principles-para-body">{p.body}</p>
                  </div>
                ))}
              </div>
            }
            media={
              <div className="ai-principles-diagrams">
                {aiPrinciplesParagraphs.map((p, i) => (
                  <div
                    key={p.heading}
                    className={`ai-principles-diagram-item${i === activePrincipleIndex ? ' active' : ''}`}
                  >
                    {p.diagram && <img src={asset(`/human_ai_ibm/diagrams/${p.diagram}`)} alt={p.heading} />}
                  </div>
                ))}
              </div>
            }
          />
        </StackedSection>

        {/* ── TRANSPARENCY AND TRUST (Figma node 433:1151 / 433:10051) ── */}
        <StackedSection title="Transparency and trust" bgColor={"#fdbf68"} textColor={PAGE_BG}>
          <CaseStudySection
            rail={
              <div className="ai-transparency-notes">
                {transparencyParagraphs.map((p, i) => (
                  <div
                    key={p.label}
                    className={`ai-transparency-note-item${i === activeTransparencyIndex ? ' active' : ''}`}
                  >
                    {p.captionItems && (
                      <ol className="ai-transparency-caption-list">
                        {p.captionItems.map((item, idx) => (
                          <li className="ai-transparency-caption-item" key={idx}>
                            <span className="type-caption1 ai-transparency-caption-num">{idx + 1}</span>
                            <span className="type-caption1 ai-transparency-caption-text">{item}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                ))}
              </div>
            }
            content={
              <div className="ai-transparency-paras" ref={transparencyContentRef}>
                {transparencyParagraphs.map((p, i) => (
                  <div
                    className={`ai-transparency-para${i === activeTransparencyIndex ? ' active' : ''}`}
                    key={p.label}
                  >
                    <p className="type-body ai-transparency-label">{p.label}</p>
                    <p className="type-heading1 ai-transparency-heading">{p.heading}</p>
                    <p className="type-body ai-transparency-body">{p.body}</p>
                  </div>
                ))}
              </div>
            }
            media={
              <div className="ai-transparency-diagrams">
                {transparencyParagraphs.map((p, i) => (
                  <div
                    key={p.label}
                    className={`ai-transparency-diagram-item${i === activeTransparencyIndex ? ' active' : ''}`}
                  >
                    {p.tabs ? (
                      <>
                        <div className="ai-transparency-tabs">
                          {p.tabs.map((tab, tabIdx) => (
                            <button
                              key={tab.label}
                              type="button"
                              className={`ai-transparency-tab type-body${tabIdx === feedbackTabIndex ? ' active' : ''}`}
                              onClick={() => setFeedbackTabIndex(tabIdx)}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="ai-transparency-image-trigger"
                          onClick={() => setTransparencyLightboxIndex(i)}
                          aria-label={`View larger: ${p.heading}`}
                        >
                          <img
                            className="ai-transparency-image"
                            src={asset(`/human_ai_ibm/trust_and_transparency/${encodeURIComponent(p.tabs[feedbackTabIndex].src)}`)}
                            alt={p.heading}
                          />
                        </button>
                      </>
                    ) : (
                      p.diagram && (
                        <button
                          type="button"
                          className="ai-transparency-image-trigger"
                          onClick={() => setTransparencyLightboxIndex(i)}
                          aria-label={`View larger: ${p.heading}`}
                        >
                          <img
                            className="ai-transparency-image"
                            src={asset(`/human_ai_ibm/trust_and_transparency/${p.diagram}`)}
                            alt={p.heading}
                          />
                        </button>
                      )
                    )}
                  </div>
                ))}
              </div>
            }
          />
        </StackedSection>

        {/* ── POLICY RECOMMENDATIONS (Figma node 453:10105 / 453:26648 / 453:26680 / 453:26711) ── */}
        <StackedSection title="Policy recommendations" bgColor={"#fdbf68"} textColor={PAGE_BG}>
          <CaseStudySection
            mediaSpansRail={getPolicyRecMode(activePolicyRecIndex) === 'video'}
            rail={
              <div className="ai-policyrec-notes">
                {policyRecParagraphs.map((p, i) => (
                  <div
                    key={p.heading}
                    className={`ai-policyrec-note-item${i === activePolicyRecIndex ? ' active' : ''}`}
                  >
                    {p.video && (
                      <div className="ai-policyrec-media-toggle">
                        <button
                          type="button"
                          className={`type-body${getPolicyRecMode(i) === 'screenshot' ? ' active' : ''}`}
                          onClick={() => setPolicyRecMediaMode((m) => ({ ...m, [i]: 'screenshot' }))}
                        >
                          Screenshot
                        </button>
                        <button
                          type="button"
                          className={`type-body${getPolicyRecMode(i) === 'video' ? ' active' : ''}`}
                          onClick={() => setPolicyRecMediaMode((m) => ({ ...m, [i]: 'video' }))}
                        >
                          Video
                        </button>
                      </div>
                    )}
                    {getPolicyRecMode(i) === 'screenshot' && renderPolicyRecCaptions(p.captionItems)}
                  </div>
                ))}
              </div>
            }
            content={
              <div className="ai-policyrec-paras" ref={policyRecContentRef}>
                {policyRecParagraphs.map((p, i) => (
                  <div
                    className={`ai-policyrec-para${i === activePolicyRecIndex ? ' active' : ''}`}
                    key={p.heading}
                  >
                    <p className="type-heading1 ai-policyrec-heading">{p.heading}</p>
                    <p className="type-body ai-policyrec-body">{p.body}</p>
                  </div>
                ))}
              </div>
            }
            media={
              <div className="ai-policyrec-diagrams">
                {policyRecParagraphs.map((p, i) => (
                  <div
                    key={p.heading}
                    className={`ai-policyrec-diagram-item${i === activePolicyRecIndex ? ' active' : ''}`}
                  >
                    {getPolicyRecMode(i) === 'video' && p.video ? (
                      <>
                        <video
                          className="ai-policyrec-video"
                          src={asset(`/human_ai_ibm/slide_outs/${p.video}`)}
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                        {renderPolicyRecCaptions(p.captionItems, 'left')}
                      </>
                    ) : (
                      p.diagram && (
                        <button
                          type="button"
                          className="ai-policyrec-image-trigger"
                          onClick={() => setPolicyRecLightboxIndex(i)}
                          aria-label={`View larger: ${p.heading}`}
                        >
                          <img
                            className="ai-policyrec-image"
                            src={asset(`/human_ai_ibm/slide_outs/${p.diagram}`)}
                            alt={p.heading}
                          />
                        </button>
                      )
                    )}
                  </div>
                ))}
              </div>
            }
          />
        </StackedSection>

        {transparencyLightboxItem && transparencyLightboxSrc && (
          <MediaLightbox
            heading={transparencyLightboxItem.heading}
            notes={transparencyLightboxItem.captionItems}
            textColor={PAGE_FG}
            media={{
              kind: 'image',
              src: asset(`/human_ai_ibm/trust_and_transparency/${transparencyLightboxItem.tabs ? encodeURIComponent(transparencyLightboxSrc) : transparencyLightboxSrc}`),
              alt: transparencyLightboxItem.heading,
            }}
            onClose={() => setTransparencyLightboxIndex(null)}
          />
        )}

        {policyRecLightboxIndex !== null && policyRecParagraphs[policyRecLightboxIndex]?.diagram && (
          <MediaLightbox
            heading={policyRecParagraphs[policyRecLightboxIndex].heading}
            notes={policyRecParagraphs[policyRecLightboxIndex].captionItems}
            textColor={PAGE_FG}
            media={{
              kind: 'image',
              src: asset(`/human_ai_ibm/slide_outs/${policyRecParagraphs[policyRecLightboxIndex].diagram}`),
              alt: policyRecParagraphs[policyRecLightboxIndex].heading,
            }}
            onClose={() => setPolicyRecLightboxIndex(null)}
          />
        )}

        {/* ── TAD TOO SENSITIVE (Figma node 516:12417) ── */}
        <StackedSection title="Tad too sensitive" bgColor={NOTE_BG} textColor={NOTE_FG}>
          <div className="ai-note-content">
            <p className="type-heading2 ai-note-heading">
              I’d be happy to share more about my ideas for the revenue model, business logic and AI strategy.
            </p>
          </div>
        </StackedSection>

        <Footer bgColor={FOOTER_BG} textColor={FOOTER_FG}/>

      </div>
    </div>
  )
}
