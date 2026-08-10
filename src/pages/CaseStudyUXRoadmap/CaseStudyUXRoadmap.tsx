import './CaseStudyUXRoadmap.css'
import { navigate, asset } from '../../lib/nav'
import Footer from '../../components/Footer'

/* image assets (Figma node 42:369) */
const imgHero = asset('/sd/hero.png')
const imgContext = asset('/sd/context.png')
const imgJourneyTask = asset('/sd/journey-task.png')
const imgJourneyTouchpoints = asset('/sd/journey-touchpoints.png')
const imgInsights = asset('/sd/insights.png')
const imgInterventions = asset('/sd/interventions.png')

const imgLinkedin = asset('/cs/linkedin.svg')
const imgMedium = asset('/cs/medium.svg')

export default function CaseStudyUXRoadmap() {
  return (
    <div className="sd">
      <div className="sd-page">

        {/* ── HEADER (shared) ── */}
        <header className="cs-header">
          <nav className="cs-nav">
            <button className="cs-nav-home" onClick={() => navigate('/')}>Home</button>
            <div className="cs-nav-icons">
              <a href="https://www.linkedin.com/in/rishbs/" target="_self" aria-label="LinkedIn">
                <img src={imgLinkedin} alt="LinkedIn" />
              </a>
              <a href="https://substack.com/@rishabsachidanand" target="_blank" rel="noopener noreferrer" aria-label="Medium">
                <img src={imgMedium} alt="Medium" />
              </a>
            </div>
          </nav>
        </header>

        {/* ── HERO ── */}
        <section className="sd-hero">
          <div className="sd-hero-inner">
            <div className="sd-hero-left">
              <h1 className="sd-hero-title type-heading2">Creating a user experience roadmap map</h1>
              <div className="sd-hero-desc type-body">
                <p>Owned the product design and delivery in a startup-</p>
                <p>&#8203;</p>
                <ul>
                  <li>Defined road map for UX evolution</li>
                  <li>Designed critical Go-to-market features</li>
                  <li>Fine-tuned and expanded design system</li>
                </ul>
              </div>
            </div>
            <div className="sd-hero-tile">
              <img src={imgHero} alt="SD+ Insights dashboard" />
            </div>
          </div>
        </section>

        {/* ── CONTEXT ── */}
        <section className="sd-section">
          <div className="sd-context-inner">
            <div className="sd-label"><p className="type-label1">Context</p></div>
            <div className="sd-context-box">
              <div className="sd-context-text">
                <p className="type-body">SD+ is a  real estate sustainability product that helps builders make informed decisions through data driven insights. We suggest best sustainable interventions to help construct green buildings</p>
              </div>
              <div className="sd-context-img">
                <img src={imgContext} alt="SD+ Insights screen" />
              </div>
            </div>
          </div>
        </section>

        {/* ── UNDERSTANDING THE PROBLEMS BANNER ── */}
        <section className="sd-section">
          <div className="sd-banner">
            <div className="sd-banner-line"><p className="type-heading4">Understanding the</p></div>
            <div className="sd-banner-line indent"><p className="type-heading4">problems customers</p></div>
            <div className="sd-banner-row3">
              <div className="sd-banner-line faced"><p className="type-heading4">faced</p></div>
              <div className="sd-banner-desc type-body">
                <p>We learned that customers found that product was not aligned with customer&rsquo;s needs.</p>
                <p>&#8203;</p>
                <p>A well defined design goal was necessary to help stay focused &amp; delivery a valuable user experience.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CREATING A UNIFIED PRODUCT VISION ── */}
        <section className="sd-section">
          <div className="sd-vision-box">
            <div className="sd-vision-row">
              <div className="sd-vision-left">
                <p className="goal type-label1">Creating a</p>
              </div>
              <div className="sd-vision-right head ruled pb40">
                <p className="sd-vision-heading type-heading4">Unified product vision</p>
              </div>
            </div>

            <div className="sd-vision-row">
              <div className="sd-vision-left">
                <div className="sd-vision-num"><p className="type-body">01</p></div>
                <p className="goal type-label1">Pre to post-sale</p>
              </div>
              <div className="sd-vision-right ruled pb40">
                <p className="sd-vision-body type-heading3">Five distinct stages our users would pass through.</p>
                <div className="sd-vision-rimg" style={{ aspectRatio: '1272 / 294' }}>
                  <img src={imgJourneyTask} alt="Customer journey stages" />
                </div>
              </div>
            </div>

            <div className="sd-vision-row">
              <div className="sd-vision-left">
                <div className="sd-vision-num"><p className="type-body">02</p></div>
                <p className="goal type-label1">Touchpoints</p>
              </div>
              <div className="sd-vision-right pb32">
                <p className="sd-vision-body type-heading3">Defined our users&rsquo; interactions by describing through touch points  with our organisation.</p>
                <div className="sd-vision-rimg" style={{ aspectRatio: '1272 / 369' }}>
                  <img src={imgJourneyTouchpoints} alt="Customer journey touchpoints" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── IDENTIFYING OPPORTUNITIES ── */}
        <section className="sd-section">
          <div className="sd-opps-inner">
            <div className="sd-label is-green"><p className="type-label1">Identifying opporuntities</p></div>
            <div className="sd-opps-callout">
              <div className="sd-opps-callout-text type-body">
                <p>Using the ( <span className="accent">Jobs to be done </span>) framework, user stories were chalked up. This helped </p>
                <p>(<span className="accent"> Identify multiple opportunities </span>) at each phase in the customer journey. ( <span className="accent">Focused </span>) on the ( <span className="accent">Core product </span>) experience </p>
              </div>
            </div>
            <div className="sd-opps-box">
              <div className="sd-opps-cards">
                <div className="sd-opps-card">
                  <p className="ttl type-heading1">Maximise business insights for CEOs</p>
                  <p className="body type-body">Assist CEOs in monitoring a project&rsquo;s sustainability via KPIs to ensure it is progressing in the right direction.</p>
                </div>
                <div className="sd-opps-card">
                  <p className="ttl type-heading1">Dynamic &amp; visual sustainability data</p>
                  <p className="body type-body">Assist architects understand the sustainability impact of various interventions applied to the building&rsquo;s design.</p>
                </div>
                <div className="sd-opps-card">
                  <p className="ttl type-heading1">Collaboration among architects</p>
                  <p className="body type-body">Help architects responsible of specific aspects of the building  effectively collaborate and ensure the building meets sustainability goals.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── INSIGHTS / INTERVENTIONS SHOWCASE ── */}
        <section className="sd-showcase">

          {/* Insights */}
          <div className="sd-card insights">
            <div className="sd-tabs">
              <div className="sd-tab active"><p className="type-body">After</p></div>
              <div className="sd-tab inactive"><p className="type-body">Before</p></div>
            </div>
            <div className="sd-card-body">
              <div className="sd-card-textcol">
                <div className="sd-card-greenlabel">
                  <p className="type-body">Redesigned the insights page to help understand project progress</p>
                </div>
                <div className="sd-card-bullets">
                  <ul className="type-body">
                    <li>Dashboard structure eliminated the need for scrolling</li>
                    <li>Calculated insights on financial investment and saving</li>
                    <li>Location based sustainability suggestions</li>
                    <li>Illustrative badges to indicate sustainability level</li>
                  </ul>
                </div>
              </div>
              <div className="sd-card-img">
                <img src={imgInsights} alt="Redesigned SD+ Insights page" />
              </div>
            </div>
          </div>

          {/* Interventions */}
          <div className="sd-card interventions">
            <div className="sd-tabs">
              <div className="sd-tab active"><p className="type-body">After</p></div>
              <div className="sd-tab inactive"><p className="type-body">Before</p></div>
            </div>
            <div className="sd-card-body">
              <div className="sd-card-textcol">
                <div className="sd-card-greenlabel">
                  <p className="type-body">Creating transparency for architects</p>
                </div>
                <div className="sd-card-bullets">
                  <ul className="type-body">
                    <li>Transparent approval workflow to help architects understand project progress</li>
                    <li>Detailed resource usage metrics</li>
                    <li>Information to help architects understand compliance.</li>
                    <li>Metrics to assess against relative to industry standards</li>
                  </ul>
                </div>
              </div>
              <div className="sd-card-img">
                <img src={imgInterventions} alt="SD+ Interventions page" />
              </div>
            </div>
          </div>

        </section>

        <Footer textColor="#f5ecc2" />

      </div>
    </div>
  )
}
