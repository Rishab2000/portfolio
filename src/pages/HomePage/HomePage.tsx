import { useLayoutEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import './HomePage.css'
import ProjectRow from '../../components/ProjectRow'
import Footer from '../../components/Footer'
import { asset } from '../../lib/nav'

// Same cursor-following preview mechanism as ProjectRow's showcase image.
const NAME_VIDEO_OFFSET_X = 16
const NAME_VIDEO_OFFSET_Y = 16
const NAME_VIDEO_EDGE_MARGIN = 8

export default function HomePage() {
  const [showNameVideo, setShowNameVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoPosRef = useRef({ x: 0, y: 0 })

  function applyVideoPosition() {
    const el = videoRef.current
    if (!el) return

    let left = videoPosRef.current.x + NAME_VIDEO_OFFSET_X
    let top = videoPosRef.current.y - el.getBoundingClientRect().height - NAME_VIDEO_OFFSET_Y
    el.style.left = `${left}px`
    el.style.top = `${top}px`

    // Nudge back on-screen if any edge overflows (the name sits near the top of the page).
    const rect = el.getBoundingClientRect()
    const margin = NAME_VIDEO_EDGE_MARGIN
    if (rect.left < margin) left += margin - rect.left
    if (rect.right > window.innerWidth - margin) left -= rect.right - (window.innerWidth - margin)
    if (rect.top < margin) top += margin - rect.top
    if (rect.bottom > window.innerHeight - margin) top -= rect.bottom - (window.innerHeight - margin)
    el.style.left = `${left}px`
    el.style.top = `${top}px`
  }

  useLayoutEffect(() => {
    if (!showNameVideo) return
    applyVideoPosition()
  }, [showNameVideo])

  const positionVideo = (e: ReactMouseEvent) => {
    videoPosRef.current = { x: e.clientX, y: e.clientY }
    applyVideoPosition()
  }

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
                  <p
                    className="type-heading3 hero-heading hero-heading-text"
                    onMouseEnter={(e) => { positionVideo(e); setShowNameVideo(true) }}
                    onMouseMove={positionVideo}
                    onMouseLeave={() => setShowNameVideo(false)}
                  >
                    Rishab Sachidanand
                    {showNameVideo && (
                      <video
                        ref={videoRef}
                        src={asset('/myphoto/App Preview.mp4')}
                        autoPlay
                        loop
                        muted
                        playsInline
                        aria-hidden="true"
                        className="hero-name-hover-video"
                        onLoadedMetadata={applyVideoPosition}
                      />
                    )}
                  </p>
                  <div className="type-body hero-years">
                    <span className="hero-degree-term">5 yrs 7 months
                      <span className="hero-degree-tooltip">
                        <p className="type-body">4 years 7 months @ IBM Software Labs | UX Designer</p>
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
              <ProjectRow hoverColor="#9a72aa" hoverTextColor="#f5ecc2" title="Common ground: An ambient calendar" path="/common-ground" showcaseImage={asset('/automated-calendar/overview/demo-setup.png')} />
              <ProjectRow hoverColor="#12354e" hoverTextColor="#f99d1b" title="Human + AI at IBM MaaS360" path="/human-ai-maas360" showcaseImage={asset('/human_ai_ibm/overview.mp4')} />
              <ProjectRow hoverColor="#802626" hoverTextColor="#f5ecc2" title="Modernizing IBM MaaS360’s dashboard" path="/homepage-modernization" showcaseImage={asset('/homepage-modernization/overview.mp4')} />
              <ProjectRow hoverColor="#ffefae" hoverTextColor="#704213" title="Semantic: A dynamic web experience" path="/semantic" showcaseImage={asset('/semantic/intro.mp4')} />
              <p className="type-body project-list-note">In the process of adding more fun projects!</p>
            </div>
          </section>
 
        </main>

        <Footer textColor="#292929" />

      </div>
    </div>
  )
}
