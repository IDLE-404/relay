import { lazy, Suspense, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useReveal } from '@/shared/hooks'
import About from './components/About'
import Audiences from './components/Audiences'
import Challenges from './components/Challenges'
import ConsolePreview from './components/ConsolePreview'
import Hero from './components/Hero'
import Steps from './components/Steps'
import UseCasesSkeleton from './components/UseCasesSkeleton'
import styles from './HomePage.module.css'

// The playground pulls in React Flow, so it is a separate chunk.
const UseCases = lazy(() => import('./components/UseCases'))

const HomePage = () => {
  const { hash, key } = useLocation()
  useReveal()

  // Header links go to "/#id"; scroll there (also when the same link is clicked again).
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash, key])

  return (
    <div className={styles.home}>
      <Hero />
      <About />
      <Challenges />
      <Steps />
      <Audiences />
      <Suspense fallback={<UseCasesSkeleton />}>
        <UseCases />
      </Suspense>
      <ConsolePreview />
    </div>
  )
}

export default HomePage
