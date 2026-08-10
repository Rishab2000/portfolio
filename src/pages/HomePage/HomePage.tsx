import './HomePage.css'
import ProjectRow from '../../components/ProjectRow'
import Footer from '../../components/Footer'

export default function HomePage() {
  return (
    <div className="portfolio">
      <div className="layout-inner">

        {/* ── MAIN CONTENT ── */}
        <main className="main-content">

          {/* 1. Hero + Projects */}
          <section className="section-approach-projects">
            <div className="hero-heading-block">
              <p className="hero-heading hero-heading-text">
                <span className="hero-heading-name">Rishab Sachidanand, </span>
                {/* <br></br>
                <span className="hero-heading-desc">digital product designer with 4.5 years of experience.</span> */}
              </p>
              <p className="hero-description">
                Hyper contextual designer who drowns himself into the domain to handcraft every aspect of the design and system to be unique and relevant to the context. Someone who approaches software through systems mindset but still explores experimental ideas. Interested in building software that lasts, and software that does one thing really well and not many things poorly.
              </p>
            </div>

            <div className="project-list">
              <ProjectRow hoverColor="#802626" hoverTextColor="#f5ecc2" title="Modernizing IBM MaaS360’s dashboard" path="/homepage-modernization" />
              <ProjectRow hoverColor="#12354e" hoverTextColor="#f99d1b" title="Human + AI at IBM MaaS360" path="/human-ai-maas360" />
              <ProjectRow hoverColor="#9a72aa" hoverTextColor="#f5ecc2" title="Designing IBM MaaS360's security vision" path="/security-vision" />
              <ProjectRow hoverColor="#112f2c" hoverTextColor="#fdd4bd" title="Creating a user experience roadmap map" path="/ux-roadmap-sdplus" />
            </div>
          </section>

        </main>

        <Footer textColor="#292929" />

      </div>
    </div>
  )
}
