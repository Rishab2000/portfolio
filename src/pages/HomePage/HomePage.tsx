import './HomePage.css'
import ProjectRow from '../../components/ProjectRow'
import Footer from '../../components/Footer'
import { asset } from '../../lib/nav'

export default function HomePage() {
  return (
    <div className="portfolio">
      <div className="layout-inner">

        {/* ── MAIN CONTENT ── */}
        <main className="main-content">

          {/* 1. Hero + Projects */}
          <section className="section-approach-projects">
            <div className="hero-heading-block">
              <div className="hero-name-col">
                <div className="hero-name-top">
                  <p className="type-heading3 hero-heading hero-heading-text">Rishab Sachidanand</p>
                  <p className="type-body hero-years">4.8 years experience in shipping products | B.Des, <em>upcoming</em> MA </p>
                </div>
              </div>
              <div className="hero-description">
                <p className="type-body">I’m a hyper contextual designer, immersing into the domain to handcraft every aspect of the solution and system to be unique and relevant.</p>
                <p className="type-body">I’m interested in building software that lasts,  the type that does one thing really well than average in many. I approach design with a system mindset, while also being experimental with ideas.</p>
              </div>
            </div>

            <div className="project-list">
              <ProjectRow hoverColor="#9a72aa" hoverTextColor="#f5ecc2" title="Automated calendar" path="/security-vision" showcaseImage={asset('/automated-calendar/product_shots/2026-07-01_10-30-50.png')} />
              <ProjectRow hoverColor="#12354e" hoverTextColor="#f99d1b" title="Human + AI at IBM MaaS360" path="/human-ai-maas360" showcaseImage={asset('/human_ai_ibm/overview.mp4')} />
              <ProjectRow hoverColor="#802626" hoverTextColor="#f5ecc2" title="Modernizing IBM MaaS360’s dashboard" path="/homepage-modernization" showcaseImage={asset('/homepage-modernization/overview.png')} />
            </div>
          </section>
 
        </main>

        <Footer textColor="#292929" />

      </div>
    </div>
  )
}
