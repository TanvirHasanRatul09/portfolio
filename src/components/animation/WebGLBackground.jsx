import { Component, lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import { isResourceConstrained, supportsWebGL } from '../../lib/capabilities'

const BackgroundCanvas = lazy(() => import('../three/BackgroundCanvas'))

class CanvasBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() { return { failed: true } }

  componentDidCatch() { this.props.onFailure() }

  render() { return this.state.failed ? null : this.props.children }
}

export function WebGLBackground({ onAvailabilityChange }) {
  const { mobile, reduced } = useMotionPreferences()
  const constrained = mobile && isResourceConstrained()
  const [failed, setFailed] = useState(() => !supportsWebGL())
  const [enabled, setEnabled] = useState(false)
  const handleFailure = useCallback(() => setFailed(true), [])

  useEffect(() => { onAvailabilityChange?.(!failed && !constrained) }, [constrained, failed, onAvailabilityChange])

  useEffect(() => {
    if (failed || reduced || constrained) return undefined
    const enable = () => setEnabled(true)
    const idleId = 'requestIdleCallback' in window
      ? window.requestIdleCallback(enable, { timeout: mobile ? 2200 : 1200 })
      : window.setTimeout(enable, mobile ? 1400 : 500)
    return () => {
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleId)
      else window.clearTimeout(idleId)
    }
  }, [constrained, failed, mobile, reduced])

  if (failed || reduced || constrained || !enabled) return null

  return (
    <CanvasBoundary onFailure={handleFailure}>
      <Suspense fallback={null}>
        <BackgroundCanvas mobile={mobile} onFailure={handleFailure} />
      </Suspense>
    </CanvasBoundary>
  )
}
