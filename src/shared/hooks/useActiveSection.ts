import { useEffect, useState } from 'react'

// Id of the section that crosses the middle of the screen, or null.
// Sections can appear later (lazy-loaded), so new ones are picked up when <main> changes.
export const useActiveSection = (ids: string[], enabled: boolean) => {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join(',')

  useEffect(() => {
    if (!enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )

    const observeAll = () =>
      key.split(',').forEach((id) => {
        const element = document.getElementById(id)
        if (element) observer.observe(element)
      })

    observeAll()
    const main = document.querySelector('main')
    const watcher = new MutationObserver(observeAll)
    if (main) watcher.observe(main, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      watcher.disconnect()
    }
  }, [key, enabled])

  return enabled ? active : null
}
