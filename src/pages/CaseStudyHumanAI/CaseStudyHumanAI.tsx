import './CaseStudyHumanAI.css'
import { navigate, asset } from './nav'

/* image assets (Figma node 40:3904) */
const imgHeroMockup = asset('/ai/hero-mockup.png')
const imgCtxPolicy1 = asset('/ai/ctx-policy1.png')
const imgCtxFrame1 = asset('/ai/ctx-frame1.png')
const imgCtxFrame2 = asset('/ai/ctx-frame2.png')
const imgCtxPolicy2 = asset('/ai/ctx-policy2.png')
const imgProbMacbook = asset('/ai/prob-macbook.png')
const imgSolMacbook1 = asset('/ai/sol-macbook1.png')
const imgSolMacbook2 = asset('/ai/sol-macbook2.png')
const imgSolFeedback1 = asset('/ai/sol-feedback1.png')
const imgSolFeedback2 = asset('/ai/sol-feedback2.png')
const imgSolFeedback3 = asset('/ai/sol-feedback3.png')

const imgLinkedin = asset('/cs/linkedin.svg')
const imgMedium = asset('/cs/medium.svg')

export default function CaseStudyHumanAI() {
  return (
    <div className="ai">
      <div className="ai-page">

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
        <section className="ai-hero">
          <div className="ai-hero-inner">
            <div className="ai-hero-left">
              <h1 className="ai-hero-title">Human + AI at IBM MaaS360</h1>
              <p className="ai-hero-desc">Lead designer for strategy, User experience and interface. Collaborated with Product Manager for create a revenue model.</p>
            </div>
            <div className="ai-hero-tile">
              <img src={imgHeroMockup} alt="MaaS360 AI policy mockup" />
            </div>
          </div>
        </section>

        {/* ── METRICS · The facts ── */}
        <section className="ai-section ai-metrics">
          <div className="ai-facts-row">
            <div className="ai-facts-label">
              <p>The facts</p>
            </div>
            <div className="ai-facts-green">
              <div className="ai-metric-row">
                <div className="ai-metric">
                  <div className="ai-metric-num"><span className="sb">~</span><span>72</span><span>%</span></div>
                  <p className="ai-metric-label">Interacted with the feature</p>
                </div>
                <div className="ai-metric">
                  <div className="ai-metric-num"><span className="sb">~</span><span>52</span><span>%</span></div>
                  <p className="ai-metric-label">Users adopted it into their workflow</p>
                </div>
                <div className="ai-metric">
                  <div className="ai-metric-num"><span>Ranked</span><span>2</span></div>
                  <p className="ai-metric-label grow">Best AI infusion in Software products at IBM</p>
                </div>
              </div>
            </div>
          </div>
          <div className="ai-quote">
            <p className="ai-quote-text">“This should be in CNN and other news channels , it is a killer idea for regulated customers like us. We use it extensively now”</p>
            <p className="ai-quote-attr">- Customer feedback</p>
          </div>
        </section>

        {/* ── CONTEXT ── */}
        <section className="ai-section">
          <div className="ai-context-inner">
            <div className="ai-label is-blue"><p>Context</p></div>
            <div className="ai-context-row">
              <div className="ai-context-text">
                <p>Enhanced the policy management workflow by automating key steps, significantly reducing the time and effort required for manual policy updates. </p>
                <p>This allowed admins to more easily align with global security standards.</p>
              </div>
              <div className="ai-context-grid">
                <div className="ai-ctx-tile t1">
                  <div className="imgwrap"><img src={imgCtxPolicy1} alt="Policy summarization" /></div>
                </div>
                <div className="ai-ctx-tile t2">
                  <div className="imgwrap"><img src={imgCtxFrame1} alt="Analyze policy" /></div>
                </div>
                <div className="ai-ctx-tile t3">
                  <div className="imgwrap"><img src={imgCtxFrame2} alt="Feedback" /></div>
                </div>
                <div className="ai-ctx-tile t4">
                  <div className="imgwrap"><img src={imgCtxPolicy2} alt="Policy summarization" /></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── IDENTIFIED PROBLEMS ── */}
        <section className="ai-section">
          <div className="ai-problems-inner">
            <div className="ai-label is-red"><p>Identified problems</p></div>
            <div className="ai-problems-box">
              <div className="ai-problems-img">
                <img src={imgProbMacbook} alt="MaaS360 policy configuration screen" />
              </div>
              <div className="ai-problem-cards">
                <div className="ai-problem-card">
                  <p className="ttl">Manual effort</p>
                  <p className="body">Customers are required to continuously monitor the latest security standards across various online resources to update and maintain their device management policy.</p>
                </div>
                <div className="ai-problem-card">
                  <p className="ttl">Several days and weeks to update policy</p>
                  <p className="body">Customers spend several hours researching security standards and weeks to create and implement a functional policy.</p>
                </div>
                <div className="ai-problem-card">
                  <p className="ttl">Organisations are vulnerable</p>
                  <p className="body">Organisations face security threats that can result in an attack. The global average cost of a data breach is $ 4.4M, and businesses are at constant risk with outdated and insecure device management policies.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ALIGNING DESIGN AND BUSINESS ── */}
        <section className="ai-section">
          <div className="ai-align-box">
            <div className="ai-align-row">
              <div className="ai-align-left hidden">
                <p className="goal">Creating a</p>
              </div>
              <div className="ai-align-right ruled pb40">
                <p className="ai-align-heading">Aligning design and business</p>
              </div>
            </div>

            <div className="ai-align-row">
              <div className="ai-align-left">
                <div className="ai-align-num"><p>01</p></div>
                <p className="goal">Business goal</p>
              </div>
              <div className="ai-align-right ruled pb40">
                <p className="ai-align-body">
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
                <div className="ai-align-num"><p>02</p></div>
                <p className="goal">Design goal</p>
              </div>
              <div className="ai-align-right pb32">
                <p className="ai-align-body tight">
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
            <div className="ai-label"><p>Solution</p></div>

            {/* Block A — Policy summarisation */}
            <div className="ai-sol-row">
              <div className="ai-sol-colA">
                <div className="ai-sol-greencard">
                  <p className="ttl">Policy summarisation</p>
                </div>
                <div className="ai-sol-bordered">
                  <p>Policy summarization explains the policy and its configuration in a few words, this helps users understand the policy without manually reviewing each of the 100+ parameters.</p>
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
                  <p className="ttl">Policy recommendation</p>
                  <p className="body">Policy summarization explains the policy and its configuration in a few words, this helps users understand the policy without manually reviewing each of the 100+ parameters.</p>
                </div>
                <div className="ai-sol-bordered">
                  <p>Policy summarization explains the policy and its configuration in a few words, this helps users understand the policy without manually reviewing each of the 100+ parameters.</p>
                </div>
                <div className="ai-sol-reduced">
                  <p className="ttl">Reduced policy creation time</p>
                  <p className="sub">from 3 weeks to 1 day</p>
                </div>
              </div>
            </div>

            {/* Block C — Transparency banner */}
            <div className="ai-sol-banner">
              <div className="inner">
                <p>Transparency and feedback</p>
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
          <div className="ai-label"><p>Usage metrics</p></div>
          <div className="ai-usage-box">
            <div className="ai-usage-row">
              <div className="ai-metric">
                <div className="ai-metric-num"><span className="sb">~</span><span>72</span><span>%</span></div>
                <p className="ai-metric-label">Regularly interacted with the feature</p>
              </div>
              <div className="ai-metric">
                <div className="ai-metric-num"><span className="sb">~</span><span>61</span><span>%</span></div>
                <p className="ai-metric-label">Configured recommendation</p>
              </div>
              <div className="ai-metric">
                <div className="ai-metric-num"><span>52</span><span>%</span></div>
                <p className="ai-metric-label">Applied recommendations</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER (shared) ── */}
        <footer className="cs-footer">
          <div className="cs-footer-inner">
            <div className="cs-footer-rule" />
            <div className="cs-footer-body">
              <p className="cs-footer-heading">{`It doesn't need end here.  🌼`}</p>
              <div className="cs-footer-contact">
                <p className="label">Contact:</p>
                <div className="cs-footer-links">
                  <a href="tel:+41772896224">+41 772896224</a>
                  <p>Rishabsachidanand@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  )
}
