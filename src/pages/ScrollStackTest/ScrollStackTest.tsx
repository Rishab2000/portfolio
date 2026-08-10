import { useRef } from 'react'
import './ScrollStackTest.css'
import CaseStudySection from '../../components/CaseStudySection'
import StackedSection from '../../components/StackedSection'
import { useStackingSections } from '../../hooks/useStackingSections'

interface SampleSection {
  id: number
  title: string
  bgColor: string
  textColor: string
}

const SECTIONS: SampleSection[] = [
  { id: 1, title: 'Section one — orange', bgColor: '#bb7125', textColor: '#fcf3cf' },
  { id: 2, title: 'Section two — navy', bgColor: '#12354e', textColor: '#f99d1b' },
  { id: 3, title: 'Section three — purple', bgColor: '#9a72aa', textColor: '#f5ecc2' },
  { id: 4, title: 'Section four — forest', bgColor: '#112f2c', textColor: '#fdd4bd' },
  { id: 5, title: 'Section five — orange again', bgColor: '#bb7125', textColor: '#fcf3cf' },
]

function SampleRail({ id }: { id: number }) {
  return (
    <div className="sst-rail">
      <p className="sst-rail-item type-caption1">Rail note {id}.1 — stays pinned while the text column scrolls</p>
      <p className="sst-rail-item type-caption1">Rail note {id}.2 — this is the left sticky column</p>
      <p className="sst-rail-item type-caption1">Rail note {id}.3 — same mechanism as the reference site's notes column</p>
    </div>
  )
}

const FILLER_PARAGRAPHS = [
  'The point of this filler paragraph is purely to add scrollable height — the sticky effect only becomes visible once a section is taller than the viewport, so short sections make it impossible to properly test the stacking behavior.',
  'As you keep scrolling through this paragraph and the ones after it, the header for this section should stay pinned in its stacked position the entire time, and the rail and media columns should stay pinned alongside it.',
  'Nothing in this paragraph is meaningful content — it exists only to give the content column enough length that scrolling through one section takes a deliberate, noticeable amount of scrolling, rather than resolving in a single mouse-wheel tick.',
  'If the section still feels too short to test comfortably, this is the block of text to extend further — add more entries to the FILLER_PARAGRAPHS array in ScrollStackTest.tsx.',
]

function SampleContent({ id }: { id: number }) {
  return (
    <div className="sst-content">
      <p className="type-body">
        This is section {id} of the scroll stack test. Scroll down and this section&rsquo;s
        header should stick to the top of the viewport, directly below any headers from
        sections above it that are already stuck.
      </p>
      <p className="type-body">
        Keep scrolling and the next section&rsquo;s header will slide up and pin itself just
        underneath this one, piling the headers up like index cards. Scroll back up and they
        should peel off again in reverse order.
      </p>
      <p className="type-body">
        While this text column scrolls, the rail column to the left and the media column to
        the right should stay pinned in place, tracking just below the stacked header for
        this section.
      </p>
      {FILLER_PARAGRAPHS.map((text, i) => (
        <p className="type-body" key={i}>{text}</p>
      ))}
      {FILLER_PARAGRAPHS.map((text, i) => (
        <p className="type-body" key={`repeat-${i}`}>{text}</p>
      ))}
    </div>
  )
}

function SampleMedia({ id, textColor }: { id: number; textColor: string }) {
  return (
    <>
      <div className="sst-media-block type-heading1" style={{ background: textColor }}>
        <span>{id}.A</span>
      </div>
      <div className="sst-media-block type-heading1" style={{ background: textColor }}>
        <span>{id}.B</span>
      </div>
    </>
  )
}

export default function ScrollStackTest() {
  const containerRef = useRef<HTMLDivElement>(null)
  useStackingSections(containerRef, { fixedHeaderSelector: '.sst-header' })

  return (
    <div className="scroll-stack-test" ref={containerRef}>
      <header className="sst-header">
        <p>Scroll stack test</p>
      </header>
      <main>
        {SECTIONS.map((s) => (
          <StackedSection key={s.id} title={s.title}>
            <CaseStudySection
              bgColor={s.bgColor}
              textColor={s.textColor}
              rail={<SampleRail id={s.id} />}
              content={<SampleContent id={s.id} />}
              media={<SampleMedia id={s.id} textColor={s.textColor} />}
            />
          </StackedSection>
        ))}
      </main>
    </div>
  )
}
