import { useEffect, useState } from 'react'
import HomePage from './pages/HomePage/HomePage'
import CaseStudyHomepage from './pages/CaseStudyHomepage/CaseStudyHomepage'
import CaseStudyHumanAI from './pages/CaseStudyHumanAI/CaseStudyHumanAI'
import CaseStudyUXRoadmap from './pages/CaseStudyUXRoadmap/CaseStudyUXRoadmap'
import ScrollStackTest from './pages/ScrollStackTest/ScrollStackTest'
import { currentRoute } from './lib/nav'

export default function App() {
  const [path, setPath] = useState(currentRoute())

  useEffect(() => {
    const onPop = () => setPath(currentRoute())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [path])

  if (path === '/homepage-modernization') return <CaseStudyHomepage />
  if (path === '/human-ai-maas360') return <CaseStudyHumanAI />
  if (path === '/ux-roadmap-sdplus') return <CaseStudyUXRoadmap />
  if (path === '/scroll-test') return <ScrollStackTest />
  return <HomePage />
}
