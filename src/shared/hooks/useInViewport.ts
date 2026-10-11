import { useEffect, useState, type RefObject } from 'react'

// inView: the element is on screen and the tab is visible. seen: it has been on screen at least once.
// Use it to run timers and animations only while someone can see them.
export const useInViewport = (ref: RefObject<Element | null>, rootMargin = '0px') => {
  const [intersecting, setIntersecting] = useState(false)
  const [seen, setSeen] = useState(false)
  const [tabVisible, setTabVisible] = useState(() => document.visibilityState === 'visible')

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting)
        if (entry.isIntersecting) setSeen(true)
      },
      { rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, rootMargin])

  useEffect(() => {
    const update = () => setTabVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  return { inView: intersecting && tabVisible, seen }
}
