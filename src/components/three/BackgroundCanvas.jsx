import { Canvas, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { NetworkScene } from './NetworkScene'

function ContextGuard({ onFailure }) {
  const renderer = useThree((state) => state.gl)

  useEffect(() => {
    const canvas = renderer.domElement
    const handleContextLoss = (event) => {
      event.preventDefault()
      onFailure()
    }

    canvas.addEventListener('webglcontextlost', handleContextLoss)
    return () => canvas.removeEventListener('webglcontextlost', handleContextLoss)
  }, [onFailure, renderer])

  return null
}

export default function BackgroundCanvas({ mobile, onFailure }) {
  const [active, setActive] = useState(!document.hidden)

  useEffect(() => {
    const handleVisibility = () => setActive(!document.hidden)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  return (
    <div className="webgl-background" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 52 }}
        dpr={mobile ? [1, 1.5] : [1, 2]}
        frameloop={active ? 'always' : 'never'}
        gl={{ alpha: true, antialias: !mobile, powerPreference: mobile ? 'low-power' : 'high-performance', stencil: false, depth: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
      >
        <ContextGuard onFailure={onFailure} />
        <PerformanceMonitor flipflops={2} onFallback={onFailure} bounds={mobile ? () => [16, 28] : (fps) => [28, Math.min(58, fps)]}>
          <NetworkScene mobile={mobile} />
        </PerformanceMonitor>
      </Canvas>
    </div>
  )
}
