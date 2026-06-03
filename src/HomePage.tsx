import './App.css'
import { navigate } from './nav'

const imgIbmLogoPngPhoto1 = "/ibm-logo.png";

const imgHomepage = "/homepage.png";
const imgAi       = "/ai.png";
const imgSecurity = "/security.png";
const imgSdplus   = "/sdplus.png";

function TestimonialCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <div className="card-testimonial">
      <p className="card-quote">{quote}</p>
      <div className="card-rule" />
      <div className="card-attr">
        <p className="attr-name">{name}</p>
        <p className="attr-role">{role}</p>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="portfolio">
      <div className="layout-inner">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-inner">

            <div className="sidebar-name-block">
              <p className="name">Rishab Sachidanand</p>
              <div className="subtitle">
                <span className="subtitle-prev">Prev. UX Designer II</span>
                <span className="subtitle-at">@</span>
                <img src={imgIbmLogoPngPhoto1} alt="IBM" className="ibm-logo" />
              </div>
            </div>

            <div className="sidebar-sections">
              <div className="divider-e0 sidebar-top-divider" />

              <div className="bio">
                <p>4 years 8 months of experience building software in the Security and AI domain.&nbsp;</p>
                <p>&#8203;</p>
                <p>I also build apps using SwiftUI to solve very niche problems that I have.&nbsp;</p>
                <p>&#8203;</p>
                <p>And and, I am a photographer too ✨</p>
              </div>

              <div className="divider-e0 sidebar-mid-divider" />

              <div className="sidebar-info-block">
                <p className="info-label">My coordinates:</p>
                <div className="info-values">
                  <p className="coord-dim">46.51958619478512</p>
                  <p className="coord-dim">6.6106845424942655</p>
                  <p className="coord-main">aka Lausanne, Switzerland 📍</p>
                </div>
              </div>

              <div className="sidebar-info-block">
                <p className="info-label">Online addresses:</p>
                <div className="info-values">
                  <p style={{ lineHeight: 'normal' }}>rishabsachidanand.com</p>
                  <a href="https://substack.com/@rishabsachidanand" target="_blank" rel="noopener noreferrer" className="link-underline">Substack</a>
                  <a href="https://www.linkedin.com/in/rishbs/" target="_self" className="link-underline">LinkedIn</a>
                  <a href="https://www.instagram.com/rishab_sachidanand/" target="_self" className="link-underline">Instagram</a>
                </div>
              </div>
            </div>

          </div>
          {/* Visible only at tablet — sits below the 3-col info row */}
          <div className="divider-e0 header-bottom-rule" />
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="main-content">

          {/* 1. Approach + Projects */}
          <section className="section-approach-projects">
            <div className="approach-row">
              <div className="approach-col">
                <p className="approach-heading">My design approach</p>
                <p className="approach-body">Is through a systems lens, basing my decisions on my research of the product's business and technical requirements. This helps me define a clear vision, align teams around shared goals, drive cross-functional work, own the end-to-end design process and ensure things move forward.</p>
              </div>
              <div className="approach-col">
                <p className="approach-heading">Strengths&nbsp;</p>
                <p className="approach-body">Is with in collaborating, maintaining vision alignment across cross-functional teams, managing product constraints and risks, and leading product design with a vision.</p>
              </div>
              <div className="approach-col">
                <p className="approach-heading">And realistically,</p>
                <p className="approach-body">I've seen and experienced what it takes to build and grow products at scale. I owned the design of features that reached thousands of customers across APAC and North America.</p>
              </div>
            </div>

            <div className="project-cards">
              <div
                className="project-card project-card-link"
                onClick={() => navigate('/homepage-modernization')}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate('/homepage-modernization') }}
              >
                <img src={imgHomepage} alt="Homepage project" className="card-cover-img" />
              </div>
              <div
                className="project-card project-card-link"
                onClick={() => navigate('/human-ai-maas360')}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate('/human-ai-maas360') }}
              >
                <img src={imgAi} alt="AI project" className="card-cover-img" />
              </div>
              <div className="project-card">
                <img src={imgSecurity} alt="Security project" className="card-cover-img" />
              </div>
              <div className="project-card">
                <img src={imgSdplus} alt="SD+ project" className="card-cover-img" />
              </div>
            </div>
          </section>

          {/* 2. Extended Cut */}
          <section className="section-extended">
            <div className="extended-header">
              <p className="extended-title">Extended cut</p>
              <p className="extended-desc">Experiments and explorations with different mediums. A collection of work showcasing my range from Photography, motion design to coding mobile apps.</p>
            </div>
            <div className="extended-media">
              {/* Left — tall hiking video */}
              <video
                className="media-frame-tall"
                src="/hiking.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="media-stacked">
                {/* Top — motion design */}
                <video
                  className="media-video-top"
                  src="/motion.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                {/* Bottom — coding */}
                <video
                  className="media-video-bottom"
                  src="/coding.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            </div>
          </section>

          {/* 3. Testimonials + Footer */}
          <div className="section-testimonials-footer">

            <div className="testimonials-inner">
              <div className="testimonials-title-row">
                <p className="testimonials-heading">
                  <span className="t-extralight">If you need to decide,</span>
                  <span className="t-regular">{` don't just take my word for it`}</span>
                </p>
              </div>

              {/* Two columns */}
              <div className="testimonials-cols">

                {/* Left col — Vishal, sandwiched by fades */}
                <div className="t-col">
                  <div className="fade-col1-top" />
                  <TestimonialCard
                    quote="What also distinguished Rishab was his curiosity and drive to learn beyond the boundaries of design itself. He consistently sought to understand the broader product ecosystem and was proactive in building cross‑functional collaboration."
                    name="Vishal Kamat"
                    role="Vice President @ IBM"
                  />
                  <div className="fade-col1-bottom" />
                </div>

                {/* Right col — Rajshree + Rishabh, top flex fade, short bottom fade */}
                <div className="t-col t-col-right">
                  <div className="fade-col2-top" />
                  <TestimonialCard
                    quote="Throughout this time, he demonstrated good design thinking, and communicated + presented his work very nicely to the stakeholders; which made stakeholders interested in prioritising the development and rollout of new designs."
                    name="Rajshree Deshmukh"
                    role="Ex Senior Product Designer @ IBM"
                  />
                  <TestimonialCard
                    quote="His pragmatic approach coupled with his knack of improving his technical and functional skill set has been a driving factor in our product lifecycle. As a design student, he naturally possesses an abundance of creativity, but it's his willingness to work hard and his dedication that really catches the eye."
                    name="Rishabh Arora"
                    role="Dev Lead @ Smarter Dharma"
                  />
                  <div className="fade-col2-bottom" />
                </div>

              </div>
            </div>

            <footer className="footer">
              <div className="footer-inner">
                <div className="footer-rule" />
                <div className="footer-body">
                  <p className="footer-heading">{`It doesn't need end here.  🌼`}</p>
                  <div className="footer-contact-row">
                    <div className="footer-contact">
                      <p className="contact-label">Contact:</p>
                      <div className="contact-links">
                        <a href="tel:+41772896224" className="link-underline">+41 772896224</a>
                        <p>Rishabsachidanand@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </footer>

          </div>

        </main>
      </div>
    </div>
  )
}
