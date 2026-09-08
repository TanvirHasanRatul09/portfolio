import { lazy, Suspense, useEffect, useState } from 'react'

const MotionController = lazy(() => import('./MotionController'))

export function DeferredMotion() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const enable = () => setEnabled(true)
    const idleId = 'requestIdleCallback' in window
      ? window.requestIdleCallback(enable, { timeout: 1400 })
      : window.setTimeout(enable, 700)
    return () => {
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleId)
      else window.clearTimeout(idleId)
    }
  }, [])

  return enabled ? <Suspense fallback={null}><MotionController /></Suspense> : null
}
