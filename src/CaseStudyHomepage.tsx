import './CaseStudyHomepage.css'
import { navigate, asset } from './nav'

/* image assets (Figma node 187:434) */
const imgHero = asset('/cs/hero.png')
const imgArtMain = asset('/cs/art-main.png')
const imgArtR1 = asset('/cs/art-r1.png')
const imgArtR2 = asset('/cs/art-r2.png')
const imgOldHome = asset('/cs/old-homepage.png')
const imgWCompliance = asset('/cs/w-compliance.png')
const imgWGroup85 = asset('/cs/w-group85.png')
const imgWDevices = asset('/cs/w-devices.png')
const imgWGroup37042 = asset('/cs/w-group37042.png')
const imgWGroup87 = asset('/cs/w-group87.png')
const imgWWatson = asset('/cs/w-watson.png')
const imgFlexibility = asset('/cs/flexibility.png')
const imgCustomization = asset('/cs/customization.png')
const imgLinkedin = asset('/cs/linkedin.svg')
const imgMedium = asset('/cs/medium.svg')

function ArrowDown() {
  return (
    <svg className="cs-metric-arrow" viewBox="0 0 25 29" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12.5 1.5V27M12.5 27L2.5 17M12.5 27L22.5 17" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function CaseStudyHomepage() {
  return (
    <div className="cs">
      <div className="cs-page">

        {/* ── HEADER ── */}
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
        <section className="cs-hero">
          <div className="cs-hero-inner">
            <div className="cs-hero-left">
              <h1 className="cs-hero-title">Modernizing MaaS360&rsquo;s dashboard</h1>
              <div className="cs-hero-desc">
                <div className="cs-hero-desc-col1">
                  <p>Led and owned the design process - </p>
                  <p>&#8203;</p>
                  <ul>
                    <li>Defined <span className="u">business value</span> </li>
                    <li>Conducted <span className="u">user research</span> </li>
                    <li>Created <span className="u">design framework</span> </li>
                  </ul>
                </div>
                <ul className="cs-hero-desc-col2">
                  <li>Delivered <span className="u">dev ready mockups</span> </li>
                  <li>Facilitated <span className="u">user feedback sessions</span> </li>
                  <li>Drove <span className="u">C-suite consensus</span> to push to production</li>
                </ul>
              </div>
            </div>
            <div className="cs-hero-tile">
              <img src={imgHero} alt="MaaS360 dashboard" />
            </div>
          </div>
        </section>

        {/* ── METRICS — The facts ── */}
        <section className="cs-section cs-metrics">
          <div className="cs-label is-centered">
            <p>The facts</p>
          </div>
          <div className="cs-metrics-box">
            <div className="cs-metrics-row">
              <div className="cs-metric">
                <div className="cs-metric-num">
                  <span>~</span><span>60</span><span>%</span>
                </div>
                <p className="cs-metric-label">Adoption rate during beta testing</p>
              </div>
              <div className="cs-metric">
                <div className="cs-metric-num">
                  <ArrowDown /><span>72</span><span>%</span>
                </div>
                <p className="cs-metric-label">No:of clicks for key workflows</p>
              </div>
              <div className="cs-metric">
                <div className="cs-metric-num">
                  <ArrowDown /><span>27</span><span>%</span>
                </div>
                <p className="cs-metric-label">Time to complete key workflows</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── THE ART ── */}
        <section className="cs-section gap8">
          <div className="cs-label is-centered">
            <p>The art</p>
          </div>
          <div className="cs-art-row">
            <div className="cs-art-left">
              <div className="cs-imgwrap">
                <img src={imgArtMain} alt="New MaaS360 homepage design" />
              </div>
            </div>
            <div className="cs-art-right">
              <div className="cs-art-tile t1">
                <div className="cs-imgwrap">
                  <img src={imgArtR1} alt="Homepage widget detail" />
                </div>
              </div>
              <div className="cs-art-tile t2">
                <div className="cs-imgwrap">
                  <img src={imgArtR2} alt="Homepage widget detail" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROBLEMS ── */}
        <section className="cs-section pad24">
          <div className="cs-problems-inner">
            <div className="cs-label is-red">
              <p>Problems with the existing homepage</p>
            </div>
            <div className="cs-problems-box">
              <div className="cs-oldhome">
                <img src={imgOldHome} alt="Old MaaS360 homepage" />
              </div>
              <div className="cs-problem-cards">
                <div className="cs-problem-card">
                  <p className="ttl">Lack of a summarized system status </p>
                  <p className="body">IT admins are required to view multiple pages to gather information, to later piece it together from memory to form a complete understanding.</p>
                </div>
                <div className="cs-problem-card">
                  <p className="ttl">Deep and lengthy navigation paths</p>
                  <p className="body">Our product offers a rich amount of information, however users need to follow lengthy workflows to find the details they need.</p>
                </div>
                <div className="cs-problem-card">
                  <p className="ttl">Lack of flexibility</p>
                  <p className="body">Existing capabilities lack contextualization, adding unnecessary noise/information to customers with specific needs.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BANNER: The homepage should help IT admins begin with their day ── */}
        <section className="cs-section pad24">
          <div className="cs-banner-box blue">
            <div className="cs-banner-line w1027">
              <p>The homepage&nbsp;</p>
            </div>
            <div className="cs-banner-line w1027 indent">
              <p>should help IT admins&nbsp;&nbsp;</p>
            </div>
            <div className="cs-banner-row3">
              <div className="cs-banner-line nowrap">
                <p>begin with their day</p>
              </div>
              <p className="cs-banner-desc">The older homepage, designed in 2012, lacks tools for quick monitoring, support data-driven decisions, and efficient management of their deployment. Admins were forced to navigate deep into the product to find relevant data.</p>
            </div>
          </div>
        </section>

        {/* ── ESTABLISH CALLOUT ── */}
        <section className="cs-section pad24">
          <div className="cs-callout">
            <p>
              It was important to establish the ( <span className="accent">Need</span> ) for modernising and ( <span className="accent">Ensure</span> ) all&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;( <span className="accent">Stakeholders</span> ) were aligned.&nbsp;
            </p>
          </div>
        </section>

        {/* ── BANNER: Gaining Stakeholder Buy in ── */}
        <section className="cs-section pad24">
          <div className="cs-banner-box purple">
            <div className="cs-banner-line w1027">
              <p>Gaining</p>
            </div>
            <div className="cs-banner-line w1027 indent">
              <p>Stakeholder</p>
            </div>
            <div className="cs-banner-row3">
              <div className="cs-banner-line nowrap">
                <p>Buy in</p>
              </div>
              <div className="cs-banner-desc">
                <p>To create customer benefit and bring this to life complete stakeholder support was required.</p>
                <p>&#8203;</p>
                <p>I focused on articulating the problem in a way that resonated with the stakeholders&rsquo; priorities and needs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRIORITISATION ── */}
        <section className="cs-section cs-prio-section">
          <div className="cs-prio-inner">
            <div className="cs-prio-pills">
              <div className="cs-prio-pill left">
                <p>Prioritisation</p>
              </div>
              <div className="cs-prio-circle" />
              <div className="cs-prio-pill right">
                <p>Partyyyyyyyyyy 🎉</p>
              </div>
            </div>
            <div className="cs-prio-bigbox">
              <div className="cs-prio-bigrow">
                <div className="cs-prio-letsship">
                  <p>Let&rsquo;s ship</p>
                </div>
                <div className="cs-prio-para">
                  <div>
                    <p>After multiple rounds of collaborative workshops, this project received executive support. The long journey from an internship concept to productisation was a happy moment.&nbsp;&nbsp;</p>
                    <p>&#8203;</p>
                    <p>With the gears set in motion, it was time to flesh out the user experience!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── DATA WIDGETS ── */}
        <section className="cs-section pad24 cs-dw-section">
          <div className="cs-dw-row">
            <div className="cs-dw-left">
              <div className="cs-dw-greenlabel">
                <p>Data widgets reduced no:of clicks by 72%</p>
              </div>
              <div className="cs-dw-textbox">
                <p className="lead">Designed micro layout systems to ensure consistency and scalability with future widgets </p>
                <div className="grp">
                  <p className="a">Displays KPIs from critical segments of the product. The homepage provides an overview of key statuses for which admins previously had to navigate deep within the product to access.</p>
                  <p className="b">I can provide more details about the widgets over a conversation 😁</p>
                </div>
              </div>
            </div>
            <div className="cs-dw-grid">
              <div className="cs-dw-col">
                <div className="cs-dw-img" style={{ aspectRatio: '912 / 1065' }}>
                  <img src={imgWCompliance} alt="Compliance status widget" />
                </div>
                <div className="cs-dw-img" style={{ aspectRatio: '264 / 354' }}>
                  <img src={imgWGroup85} alt="Activity feed widget" />
                </div>
              </div>
              <div className="cs-dw-col center">
                <div className="cs-dw-img" style={{ aspectRatio: '362 / 248' }}>
                  <img src={imgWDevices} alt="Devices last reported widget" />
                </div>
                <div className="cs-dw-img" style={{ aspectRatio: '266 / 584' }}>
                  <img src={imgWGroup37042} alt="Notifications widget" />
                </div>
              </div>
              <div className="cs-dw-col">
                <div className="cs-dw-img" style={{ aspectRatio: '912 / 1236' }}>
                  <img src={imgWGroup87} alt="Watchlist widget" />
                </div>
                <div className="cs-dw-img" style={{ aspectRatio: '912 / 1377' }}>
                  <img src={imgWWatson} alt="Watson advisor widget" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FLEXIBLE ARCHITECTURE ── */}
        <div className="cs-flex">
          <div className="cs-flex-inner">
            <img className="cs-flex-img" src={imgFlexibility} alt="Flexible homepage layout structure" />
            <div className="cs-flex-card">
              <p className="ttl">Flexible architecture</p>
              <p className="body">Maintains page structure and accommodates a range of data types</p>
            </div>
          </div>
        </div>

        {/* ── PERSONALISATION ── */}
        <div className="cs-pers">
          <div className="cs-pers-row">
            <div className="cs-pers-green">
              <p className="ttl">Personalisation</p>
              <p className="body">Offering complete customisation for their use case.</p>
            </div>
            <div className="cs-pers-bordered">
              <p>Flexible architecture allows for complete customisation. IT admins can easily change the default setup&nbsp; by dragging and dropping widgets from a (growing) library.</p>
            </div>
          </div>
          <img className="cs-pers-img" src={imgCustomization} alt="Customization — drag and drop widgets" />
        </div>

        {/* ── WRAPPING IT UP ── */}
        <section className="cs-wrap cs-section">
          <div className="cs-wrap-inner">
            <p className="cs-wrap-title">Wrapping it up 🎁</p>
            <div className="cs-wrap-cards">
              <div className="cs-wrap-card">
                <p className="ttl">Defining Objectives and Key Results (OKRs)</p>
                <div className="body">
                  <p>Without a product manager, the initiative had to be taken to research, and define metrics for success. </p>
                  <p>&#8203;</p>
                  <p>This involved gaining a deep understanding of the business, market and product; <span className="u">collaborated with the director to define OKRs</span></p>
                </div>
              </div>
              <div className="cs-wrap-card">
                <p className="ttl">Systems thinking</p>
                <div className="body">
                  <p>Revamping the homepage required unifying the entire product, a design that will stay central for the next 7-8 yrs. </p>
                  <p>&#8203;</p>
                  <p>To deliver, I mapped a deep understanding various dependencies and its interrelationships, ensuring each decision aligns with the product&rsquo;s long-term direction. </p>
                </div>
              </div>
              <div className="cs-wrap-card">
                <p className="ttl">Stakeholder management</p>
                <div className="body">
                  <p>Aligning stakeholders and the leadership was crucial to ensure value realisation.</p>
                  <p>&#8203;</p>
                  <p>The process honed my communication and management skills, collaborating closely with technical leaders and executives. </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
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
