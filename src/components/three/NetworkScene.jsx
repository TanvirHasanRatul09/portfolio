import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function seeded(index) {
  const value = Math.sin(index * 999.91) * 43758.5453
  return value - Math.floor(value)
}

export function NetworkScene({ mobile }) {
  const group = useRef()
  const core = useRef()
  const orbit = useRef()
  const packets = useRef()
  const { pointer } = useThree()
  const nodeCount = mobile ? 48 : 110
  const edgeCount = mobile ? 20 : 58
  const packetCount = mobile ? 7 : 16

  const { nodes, edges, routes } = useMemo(() => {
    const nodePositions = new Float32Array(nodeCount * 3)
    for (let index = 0; index < nodeCount; index += 1) {
      nodePositions[index * 3] = (seeded(index * 3) - 0.5) * 22
      nodePositions[index * 3 + 1] = (seeded(index * 3 + 1) - 0.5) * 13
      nodePositions[index * 3 + 2] = (seeded(index * 3 + 2) - 0.5) * 8 - 2
    }

    const edgePositions = new Float32Array(edgeCount * 6)
    const routeData = []
    for (let index = 0; index < edgeCount; index += 1) {
      const start = Math.floor(seeded(index + 800) * nodeCount)
      const offset = 1 + Math.floor(seeded(index + 1200) * Math.min(12, nodeCount - 1))
      const end = (start + offset) % nodeCount
      const a = [nodePositions[start * 3], nodePositions[start * 3 + 1], nodePositions[start * 3 + 2]]
      const b = [nodePositions[end * 3], nodePositions[end * 3 + 1], nodePositions[end * 3 + 2]]
      edgePositions.set([...a, ...b], index * 6)
      if (index < packetCount) routeData.push({ a, b, speed: 0.035 + seeded(index + 1600) * 0.055, phase: seeded(index + 1900) })
    }
    return { nodes: nodePositions, edges: edgePositions, routes: routeData }
  }, [edgeCount, nodeCount, packetCount])

  const packetPositions = useMemo(() => new Float32Array(packetCount * 3), [packetCount])

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mobile ? 0 : pointer.x * 0.055, 0.025)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mobile ? 0 : -pointer.y * 0.035, 0.025)
    group.current.rotation.z += delta * 0.004
    if (core.current) {
      core.current.rotation.x += delta * 0.025
      core.current.rotation.y -= delta * 0.04
    }
    if (orbit.current) orbit.current.rotation.z -= delta * 0.018
    routes.forEach((route, index) => {
      const progress = (state.clock.elapsedTime * route.speed + route.phase) % 1
      packetPositions[index * 3] = THREE.MathUtils.lerp(route.a[0], route.b[0], progress)
      packetPositions[index * 3 + 1] = THREE.MathUtils.lerp(route.a[1], route.b[1], progress)
      packetPositions[index * 3 + 2] = THREE.MathUtils.lerp(route.a[2], route.b[2], progress)
    })
    if (packets.current) packets.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <group ref={group}>
      <group ref={core} position={[mobile ? 2.3 : 4.8, mobile ? 2.1 : 1.15, -5]} rotation={[0.5, -0.35, 0.2]}>
        <mesh scale={mobile ? 2.15 : 3.5}>
          <icosahedronGeometry args={[1, mobile ? 1 : 2]} />
          <meshBasicMaterial color="#f43f75" wireframe transparent opacity={mobile ? 0.15 : 0.25} depthWrite={false} />
        </mesh>
        <mesh scale={mobile ? 1.25 : 2.05} rotation={[0.4, 0.8, 0]}>
          <torusKnotGeometry args={[1, 0.13, mobile ? 48 : 72, 8, 2, 3]} />
          <meshBasicMaterial color="#b56cff" wireframe transparent opacity={mobile ? 0.18 : 0.31} depthWrite={false} />
        </mesh>
      </group>
      <group ref={orbit} position={[-5.4, -2.1, -6]} rotation={[1.08, 0.2, -0.35]}>
        <mesh scale={mobile ? 1.8 : 3.4}>
          <torusGeometry args={[1.35, 0.012, 3, mobile ? 48 : 72]} />
          <meshBasicMaterial color="#ff6b96" transparent opacity={mobile ? 0.16 : 0.25} depthWrite={false} />
        </mesh>
      </group>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[nodes, 3]} /></bufferGeometry>
        <pointsMaterial color="#d8a4ff" size={mobile ? 0.035 : 0.045} transparent opacity={mobile ? 0.4 : 0.52} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[edges, 3]} /></bufferGeometry>
        <lineBasicMaterial color="#e13878" transparent opacity={mobile ? 0.1 : 0.18} depthWrite={false} />
      </lineSegments>
      <points ref={packets}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[packetPositions, 3]} /></bufferGeometry>
        <pointsMaterial color="#ff7aa2" size={mobile ? 0.055 : 0.075} transparent opacity={mobile ? 0.62 : 0.74} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  )
}
