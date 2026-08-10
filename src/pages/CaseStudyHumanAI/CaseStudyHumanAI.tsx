import './CaseStudyHumanAI.css'
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

interface PurposeReveal {
  key: string
  description: string
}

const purposeReveals: PurposeReveal[] = [
  { key: 'SMBs', description: 'MaaS360’s strategy was to acquire the SMB market for mobile device management.' },
  { key: 'secure their devices', description: 'The global average cost of a data breach is $4.4M, security is pivotal to ensure business continuity.' },
  { key: 'minimal effort', description: "The available solutions were bloated and complex, creating an opportunity for a simpler option." },
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
    body: 'The experience should nudge admins when intervention is needed, without requiring them to remember or take extra steps.',
    diagram: 'proactive.png',
    captionItems: [
      'Prioritise designing AI capabilities that help avoid issues over diagnosing them',
      'Nudge when intervention is required',
      'Communicate and clarify the feature’s capabilities and limitations',
    ],
  },
  {
    heading: 'Integrated',
    body: 'Integrated seamlessly with existing and established workflows without increasing friction, while utilizing and enhance its experience.',
    diagram: 'integrate.png',
    captionItems: [
      'Do not re-invent the wheel, “at least not right now”.',
      'Enhance established workflows when possible, not disrupt them.',
      'Intentional usage of the chat interface.',
    ],
  },
  {
    heading: 'Contextualized',
    body: 'Information and functionality should align with diverse customer needs and contexts, understanding user and organizational goals to provide a relevant experience.',
    diagram: 'contextualize.png',
    captionItems: [
      'Functionality should morph and align to the organisation’s strategy',
      'Information should always contextualise to the active workflow or page',
    ],
  },
]

/* Placeholder — update with this project's real time-allocation breakdown. */
const retroSegments: RetroSegment[] = [
  { label: 'Placeholder category 1', percent: '~10%', items: ['Placeholder activity — update with real copy.'] },
  { label: 'Placeholder category 2', percent: '~30%', items: ['Placeholder activity — update with real copy.'] },
  { label: 'Placeholder category 3', percent: '~40%', items: ['Placeholder activity — update with real copy.'] },
  { label: 'Placeholder category 4', percent: '~20%', items: ['Placeholder activity — update with real copy.'] },
]

/* image assets (Figma node 40:3904) */
const imgIntroMockup = asset('/human_ai_ibm/ibm-homepage%202.png')
const imgContext = asset('/human_ai_ibm/context.png')
const imgSolMacbook1 = asset('/ai/sol-macbook1.png')
const imgSolMacbook2 = asset('/ai/sol-macbook2.png')
const imgSolFeedback1 = asset('/ai/sol-feedback1.png')
const imgSolFeedback2 = asset('/ai/sol-feedback2.png')
const imgSolFeedback3 = asset('/ai/sol-feedback3.png')

export default function CaseStudyHumanAI() {
  const pageRef = useRef<HTMLDivElement>(null)
  useStackingSections(pageRef, { fixedHeaderSelector: '.project-header' })

  const [retroRevealMode, setRetroRevealMode] = useState<'stay' | 'disappear'>('stay')

  const {
    revealed: purposeRevealed,
    hovered: purposeHovered,
    reveal: revealPurpose,
    onEnter: onPurposeEnter,
    onLeave: onPurposeLeave,
  } = useHoverReveal<string>()

  const principlesContentRef = useRef<HTMLDivElement>(null)
  const activePrincipleIndex = useActiveDiagramIndex(principlesContentRef, {
    paragraphSelector: '.ai-principles-para',
    fixedHeaderSelector: '.project-header',
    offsetPx: 130,
  })

  const pageStyle = {
    '--cs-bg': PAGE_BG,
    '--cs-fg': PAGE_FG,
    '--cs-hover': PAGE_HOVER,
  } as CSSProperties

  return (
    <div className="ai">
      <div className="ai-page" ref={pageRef} style={pageStyle}>

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
              { label: 'Best AI infusion in Software products at IBM', stat: 'Ranked 2nd' },
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
          <RetrospectiveSection segments={retroSegments} revealMode={retroRevealMode} />
        </StackedSection>

        {/* ── CONTEXT (Figma node 363:682) ── */}
        <StackedSection title="Context">
          <div className="ai-context-content">
            <div className="ai-context-cols">
              <div className="ai-context-col">
                <p className="ai-context-label type-body">WHAT IS POLICY MANAGEMENT?</p>
                <p className="ai-context-body type-body">A security feature that lets IT administrators enforce rules, settings, and restrictions on corporate devices, providing granual control over device functionality and restrictions.</p>
              </div>
              <div className="ai-context-col">
                <p className="ai-context-label type-body">WHAT IS THE ISSUE?</p>
                <p className="ai-context-body type-body"> As this offers granual control over device functionality, there are hundreds of rules creating an extremely information heavy experience. It reaquired users to be extremely proficient its functioning and security standards.</p>
              </div>
              <div className="ai-context-col">
                <p className="ai-context-label type-body">WHO ARE OUR USERS?</p>
                <p className="ai-context-body type-body">They are either small or medium business owners with no background in security and MDM. Or they're an overstretched IT admin, busy attending to support tickets or fixing technical issues.</p>
              </div>
            </div>
            <div className="ai-context-media">
              <p className="ai-context-label type-body">POLICY MANAGEMENT UI</p>
              <div className="ai-context-images">
                <div className="ai-context-image"><img src={imgContext} alt="MaaS360 Default iOS MDM Policy configuration screen" /></div>
                <div className="ai-context-image"><img src={imgContext} alt="MaaS360 Default iOS MDM Policy configuration screen" /></div>
              </div>
            </div>
          </div>
        </StackedSection>

        {/* ── ALIGNING ON THE PURPOSE (Figma node 413:151) ── */}
        <StackedSection title="Aligning on the purpose">
          <div className="ai-purpose-content">
            <div className="ai-purpose-cols">
              <div className="ai-purpose-col">
                <p className="ai-purpose-label type-body">WE WANTED TO...</p>
                <p className="ai-purpose-body type-body">Build the first AI offering for MaaS360, leaving a mark and set the boat sailing for future features.</p>
              </div>
              <div className="ai-purpose-col">
                <p className="ai-purpose-label type-body">WE HOPED THAT...</p>
                <p className="ai-purpose-body type-body">GenAI would be the core of our functionality, such that it helps with marketability.</p>
              </div>
              <div className="ai-purpose-col">
                <p className="ai-purpose-label type-body">WE AIMED FOR...</p>
                <p className="ai-purpose-body type-body">Finding relevant places where we could use the technology, aimed at finding these workflows.</p>
              </div>
            </div>

            <div className="ai-purpose-terminal">
              <div className="ai-purpose-terminal-row">
                <p className="type-body">============================================================================================================================================================================================================================================================================================================================</p>
                <p className="type-body"><span className="ai-purpose-terminal-word">Futile end</span>============================================================================================================================================================================================================================================================================================================================</p>
                <p className="type-body">============================================================================================================================================================================================================================================================================================================================</p>
              </div>
              <div className="ai-purpose-cols">
                <div />
                <div className="ai-purpose-col">
                  <p className="ai-purpose-label type-body">WHY?</p>
                  <p className="ai-purpose-body type-body">We go too caught up with implementing the tech rather than delivering value.</p>
                </div>
                <div />
              </div>
              {/* <div className="ai-purpose-cols">
                <div />
                <div className="ai-purpose-col">
                  <p className="ai-purpose-label type-body">TO MOVE FORWARD</p>
                  <p className="ai-purpose-body type-body">Defined our north star, a singular goal that informs every decision.</p>
                </div>
                <div />
              </div> */}
            </div>

            <div className="ai-purpose-terminal-row">
              <p className="type-body">============================================================================================================================================================================================================================================================================================================================</p>
              <p className="type-body"><span className="ai-purpose-terminal-word">Reoriented</span>============================================================================================================================================================================================================================================================================================================================</p>
              <p className="type-body">============================================================================================================================================================================================================================================================================================================================</p>
            </div>

            <div className="ai-purpose-northstar">
              
              <div className="ai-purpose-northstar-heading-group">
                <p className="ai-purpose-label type-body">NORTH STAR</p>
                <p className="ai-purpose-heading type-heading2">
                  Help{' '}
                  <span className="ai-purpose-term" onMouseEnter={() => onPurposeEnter('SMBs')} onMouseLeave={onPurposeLeave} onClick={() => revealPurpose('SMBs')}>SMBs</span>{' '}
                  configure and maintain policies so that they can{' '}
                  <span className="ai-purpose-term" onMouseEnter={() => onPurposeEnter('secure their devices')} onMouseLeave={onPurposeLeave} onClick={() => revealPurpose('secure their devices')}>secure their devices</span>{' '}
                  with{' '}
                  <span className="ai-purpose-term" onMouseEnter={() => onPurposeEnter('minimal effort')} onMouseLeave={onPurposeLeave} onClick={() => revealPurpose('minimal effort')}>minimal effort</span>{' '}
                  to help redirect resources towards growing their business.
                </p>
              </div>
              <div className="ai-purpose-reveal-row">
                {purposeReveals.map((r) => (
                  <div
                    key={r.key}
                    className={`ai-purpose-reveal-box${purposeRevealed.has(r.key) ? ' revealed' : ''}${r.key === purposeHovered ? ' active' : ''}`}
                  >
                    <p className="ai-purpose-body type-body">{r.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </StackedSection>

        {/* ── AI DESIGN PRINCIPLES (Figma node 427:410) ── */}
        <StackedSection title="AI Design Principles">
          <CaseStudySection
            bgColor={PAGE_BG}
            textColor={PAGE_FG}
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
          />
        </StackedSection>

        {/* ── ALIGNING DESIGN AND BUSINESS ── */}
        <section className="ai-section">
          <div className="ai-align-box">
            <div className="ai-align-row">
              <div className="ai-align-left hidden">
                <p className="goal type-label1">Creating a</p>
              </div>
              <div className="ai-align-right ruled pb40">
                <p className="ai-align-heading type-heading4">Aligning design and business</p>
              </div>
            </div>

            <div className="ai-align-row">
              <div className="ai-align-left">
                <div className="ai-align-num"><p className="type-body">01</p></div>
                <p className="goal type-label1">Business goal</p>
              </div>
              <div className="ai-align-right ruled pb40">
                <p className="ai-align-body type-heading3">
                  <span className="ln">MaaS360&rsquo;s strategic direction was to acquire the </span>
                  <span className="ln accent">SMB</span>
                  <span className="ln"> mobile device management market, which </span>
                  <span className="ln accent">lacks a simple</span>
                  <span className="ln"> and comprehensive </span>
                  <span className="ln accent">solution.</span>
                </p>
              </div>
            </div>

            <div className="ai-align-row">
              <div className="ai-align-left">
                <div className="ai-align-num"><p className="type-body">02</p></div>
                <p className="goal type-label1">Design goal</p>
              </div>
              <div className="ai-align-right pb32">
                <p className="ai-align-body type-heading3 tight">
                  <span className="ln">Help </span>
                  <span className="ln accent">SMBs</span>
                  <span className="ln"> configure, understand and maintain policies so that they can </span>
                  <span className="ln accent">manage their devices</span>
                  <span className="ln"> with </span>
                  <span className="ln accent">minimal effort</span>
                  <span className="ln"> and </span>
                  <span className="ln">focus more on growing their business</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SOLUTION ── */}
        <section className="ai-section">
          <div className="ai-solution-inner">
            <div className="ai-label"><p className="type-label1">Solution</p></div>

            {/* Block A — Policy summarisation */}
            <div className="ai-sol-row">
              <div className="ai-sol-colA">
                <div className="ai-sol-greencard">
                  <p className="ttl type-heading2">Policy summarisation</p>
                </div>
                <div className="ai-sol-bordered">
                  <p className="type-body">Policy summarization explains the policy and its configuration in a few words, this helps users understand the policy without manually reviewing each of the 100+ parameters.</p>
                </div>
              </div>
              <div className="ai-sol-imgpanel">
                <div className="ai-sol-img ai-sol-macbook1">
                  <img src={imgSolMacbook1} alt="Policy summarisation in MaaS360" />
                </div>
              </div>
            </div>

            {/* Block B — Policy recommendation */}
            <div className="ai-sol-row">
              <div className="ai-sol-imgpanel beige fit">
                <div className="ai-sol-img ai-sol-macbook2">
                  <img src={imgSolMacbook2} alt="Policy recommendation flow" />
                </div>
              </div>
              <div className="ai-sol-colB">
                <div className="ai-sol-greencard gap24 tall">
                  <p className="ttl type-heading2">Policy recommendation</p>
                  <p className="body type-body">Policy summarization explains the policy and its configuration in a few words, this helps users understand the policy without manually reviewing each of the 100+ parameters.</p>
                </div>
                <div className="ai-sol-bordered">
                  <p className="type-body">Policy summarization explains the policy and its configuration in a few words, this helps users understand the policy without manually reviewing each of the 100+ parameters.</p>
                </div>
                <div className="ai-sol-reduced">
                  <p className="ttl type-heading2">Reduced policy creation time</p>
                  <p className="sub type-body">from 3 weeks to 1 day</p>
                </div>
              </div>
            </div>

            {/* Block C — Transparency banner */}
            <div className="ai-sol-banner">
              <div className="inner">
                <p className="type-heading2">Transparency and feedback</p>
              </div>
            </div>

            {/* Block D — Feedback image strip */}
            <div className="ai-sol-feedback">
              <div className="fb f1"><img src={imgSolFeedback1} alt="Feedback rating" /></div>
              <div className="fb f2"><img src={imgSolFeedback2} alt="Analyze policy" /></div>
              <div className="fb f3"><img src={imgSolFeedback3} alt="Feedback reasons" /></div>
            </div>
          </div>
        </section>

        {/* ── USAGE METRICS ── */}
        <section className="ai-section ai-usage">
          <div className="ai-label"><p className="type-label1">Usage metrics</p></div>
          <div className="ai-usage-box">
            <div className="ai-usage-row">
              <div className="ai-metric">
                <div className="ai-metric-num type-stat1"><span className="sb">~</span><span>72</span><span>%</span></div>
                <p className="ai-metric-label type-caption1">Regularly interacted with the feature</p>
              </div>
              <div className="ai-metric">
                <div className="ai-metric-num type-stat1"><span className="sb">~</span><span>61</span><span>%</span></div>
                <p className="ai-metric-label type-caption1">Configured recommendation</p>
              </div>
              <div className="ai-metric">
                <div className="ai-metric-num type-stat1"><span>52</span><span>%</span></div>
                <p className="ai-metric-label type-caption1">Applied recommendations</p>
              </div>
            </div>
          </div>
        </section>

        <Footer textColor="#f5ecc2" />

      </div>
    </div>
  )
}
