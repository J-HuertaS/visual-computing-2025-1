import { Canvas, useFrame } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { useRef } from 'react'
import * as THREE from 'three'

function ArticulatedArm() {
  const baseRef = useRef<THREE.Group>(null)
  const joint1Ref = useRef<THREE.Group>(null)
  const joint2Ref = useRef<THREE.Group>(null)
  const tipRef = useRef<THREE.Mesh>(null)
  const lineRef = useRef<THREE.Line>(null)
  const trail = useRef<THREE.Vector3[]>([])

  const { autoAnimation, angle1, angle2, angle3 } = useControls({
    autoAnimation: false,
    angle1: { value: 0, min: -Math.PI, max: Math.PI },
    angle2: { value: 0, min: -Math.PI, max: Math.PI },
    angle3: { value: 0, min: -Math.PI, max: Math.PI },
  })

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (baseRef.current && joint1Ref.current && joint2Ref.current && tipRef.current && lineRef.current) {
      // Rotaciones
      if (autoAnimation) {
        baseRef.current.rotation.z = Math.sin(t)
        joint1Ref.current.rotation.z = Math.sin(t * 1.5)
        joint2Ref.current.rotation.z = Math.sin(t * 2)
      } else {
        baseRef.current.rotation.z = angle1
        joint1Ref.current.rotation.z = angle2
        joint2Ref.current.rotation.z = angle3
      }

      // Posición del extremo
      tipRef.current.updateWorldMatrix(true, false)
      const tipWorldPos = new THREE.Vector3()
      tipRef.current.getWorldPosition(tipWorldPos)

      // Trazo
      trail.current.push(tipWorldPos.clone())
      if (trail.current.length > 100) trail.current.shift()

      const lineGeometry = new THREE.BufferGeometry().setFromPoints(trail.current)
      lineRef.current.geometry.dispose()
      lineRef.current.geometry = lineGeometry
    }
  })

  return (
    <>
      <group ref={baseRef} position={[0, 0, 0]}>
        <mesh position={[1, 0, 0]}>
          <boxGeometry args={[2, 0.3, 0.3]} />
          <meshStandardMaterial color="orange" />
        </mesh>

        <group ref={joint1Ref} position={[2, 0, 0]}>
          <mesh position={[1, 0, 0]}>
            <boxGeometry args={[2, 0.3, 0.3]} />
            <meshStandardMaterial color="green" />
          </mesh>

          <group ref={joint2Ref} position={[2, 0, 0]}>
            <mesh ref={tipRef} position={[1, 0, 0]}>
              <boxGeometry args={[2, 0.3, 0.3]} />
              <meshStandardMaterial color="skyblue" />
            </mesh>
          </group>
        </group>
      </group>

      <line ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color="red" />
      </line>
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <ArticulatedArm />
      </Canvas>
      <Leva collapsed />
    </div>
  )
}
