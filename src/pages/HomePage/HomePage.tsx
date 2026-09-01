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
                  <div className="type-body hero-years">
                    <span className="hero-degree-term">5 yrs 6 mos
                      <span className="hero-degree-tooltip">
                        <p className="type-body">4 years 8 months @ IBM Software Labs | UX Designer</p>
                        <p className="type-body">10 months @ Smarter Dharma | Sole designer at the Startup</p>
                      </span>
                    </span> experience in shipping products | <span className="hero-degree-term">B Des
                      <span className="hero-degree-tooltip">
                        <p className="type-body">Bachelor in Design | 2016 - 2020</p>
                        <p className="type-body">Srishti Manipal Institute of Art Design and Technology, Bangalore</p>
                      </span>
                    </span>, <span className="hero-degree-term"><em>upcoming</em> MA
                      <span className="hero-degree-tooltip">
                        <p className="type-body">Master in Digital Experience Design | 2025 - 2027</p>
                        <p className="type-body">ECAL, Switzerland</p>
              
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="hero-description">
                <p className="type-body">I’m a hyper contextual designer, immersing into the domain to handcraft every aspect of the solution and system to be unique and relevant.</p>
                <p className="type-body">I’m interested in building software that lasts,  the type that does one thing really well than average in many. I approach design with a system mindset, while also being experimental with ideas.</p>
              </div>
            </div>

            <div className="project-list">
              <ProjectRow hoverColor="#9a72aa" hoverTextColor="#f5ecc2" title="Automated calendar" path="/security-vision" showcaseImage={asset('/automated-calendar/overview/demo-setup.png')} />
              <ProjectRow hoverColor="#12354e" hoverTextColor="#f99d1b" title="Human + AI at IBM MaaS360" path="/human-ai-maas360" showcaseImage={asset('/human_ai_ibm/overview.mp4')} />
              <ProjectRow hoverColor="#802626" hoverTextColor="#f5ecc2" title="Modernizing IBM MaaS360’s dashboard" path="/homepage-modernization" showcaseImage={asset('/homepage-modernization/overview.mp4')} />
              <p className="type-body project-list-note">In the process of adding more fun projects!</p>
            </div>
          </section>
 
        </main>

        <Footer textColor="#292929" />

      </div>
    </div>
  )
}
