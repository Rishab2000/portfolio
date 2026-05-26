import './App.css'

const imgSdplus1 = "http://localhost:3845/assets/0a90aff006fa139a2dc229f706f2a1d9f4e2ee89.png";
const imgHomepageTile1 = "http://localhost:3845/assets/62efb099f904f9a8e1b51d39180b8509422c1fc8.png";
const imgWebMockupV2Front1 = "http://localhost:3845/assets/20da8b177c8cd7ceb01086b943ad41b72f9126c1.png";
const imgIbmLogoPngPhoto1 = "http://localhost:3845/assets/95a3806928544ce36b3aa60e06db18a330dbeb5c.png";
const imgFrame373951 = "http://localhost:3845/assets/79f50483a4ab8db0aa866319629c4978bac31fb6.png";

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

export default function App() {
  return (
    <div className="portfolio">
      <div className="layout-grid">

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
              <div className="divider-e0" />

              <div className="bio">
                <p>4 years 8 months of experience building software in the Security and AI domain.&nbsp;</p>
                <p>&#8203;</p>
                <p>I also build apps using SwiftUI to solve very niche problems that I have.&nbsp;</p>
                <p>&#8203;</p>
                <p>And and, I am a photographer too ✨</p>
              </div>

              <div className="divider-e0" />

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
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="main-content">

          {/* Approach + Projects */}
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
              {/* Homepage — blue gradient */}
              <div className="project-card card-homepage">
                <div className="card-img-wrapper-homepage">
                  <img src={imgFrame373951} alt="" />
                </div>
              </div>

              {/* AI — dark */}
              <div className="project-card card-ai">
                <div className="card-img-wrapper">
                  <img src={imgWebMockupV2Front1} alt="" />
                </div>
              </div>

              {/* Security — purple */}
              <div className="project-card card-security">
                <div className="card-img-wrapper">
                  <img src={imgHomepageTile1} alt="" />
                </div>
              </div>

              {/* SD+ — green */}
              <div className="project-card card-sdplus">
                <div className="card-img-wrapper">
                  <img src={imgSdplus1} alt="" />
                </div>
              </div>
            </div>
          </section>

          {/* Extended Cut */}
          <section className="section-extended">
            <div className="extended-header">
              <p className="extended-title">Extended cut</p>
              <p className="extended-desc">Experiments and explorations with different mediums. A collection of work showcasing my range from Photography, motion design to coding mobile apps.</p>
            </div>
            <div className="extended-media">
              <div className="media-frame-tall" />
              <div className="media-stacked">
                <div className="media-placeholder-top" />
                <div className="media-placeholder-bottom" />
              </div>
            </div>
          </section>

          {/* Testimonials + Footer */}
          <div className="section-testimonials-footer">
            <div className="testimonials-inner">
              <div className="testimonials-title-row">
                <p className="testimonials-heading">
                  <span className="t-extralight">If you need to decide,</span>
                  <span className="t-regular">{` don't just take my word for it`}</span>
                </p>
              </div>

              <div className="testimonials-list">
                <div className="t-group">
                  <div className="fade-in-top" />
                  <TestimonialCard
                    quote="What also distinguished Rishab was his curiosity and drive to learn beyond the boundaries of design itself. He consistently sought to understand the broader product ecosystem and was proactive in building cross‑functional collaboration."
                    name="Vishal Kamat"
                    role="Vice President @ IBM"
                  />
                </div>
                <div className="t-group">
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
                  <div className="fade-in-bottom" />
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
