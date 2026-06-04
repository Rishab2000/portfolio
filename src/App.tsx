import { useEffect, useState } from 'react'
import HomePage from './HomePage'
import CaseStudyHomepage from './CaseStudyHomepage'
import CaseStudyHumanAI from './CaseStudyHumanAI'
import { currentRoute } from './nav'

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
  return <HomePage />
}
