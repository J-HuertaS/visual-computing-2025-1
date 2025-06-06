// App.jsx o App.tsx

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'
import { useControls } from 'leva'

function MovingBox({ start, end, curved }) {
  const ref = useRef()
  const quaternionStart = useRef(new THREE.Quaternion())
  const quaternionEnd = useRef(new THREE.Quaternion())

  const { t } = useControls({ t: { value: 0.0, min: 0, max: 1, step: 0.01 } })

  // Define control points for Bézier
  const control1 = start.clone().add(new THREE.Vector3(0, 2, 0))
  const control2 = end.clone().add(new THREE.Vector3(0, 2, 0))
  const bezier = new THREE.CubicBezierCurve3(start, control1, control2, end)

  useFrame(() => {
    const pos = new THREE.Vector3()

    if (curved) {
      pos.copy(bezier.getPoint(t))
    } else {
      pos.lerpVectors(start, end, t)
    }

    // Rotation: point in direction of motion (approximate)
    const dir = curved
      ? bezier.getTangent(t).normalize()
      : new THREE.Vector3().subVectors(end, start).normalize()

    const targetQuat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1), // forward axis
      dir
    )

    // Interpolate rotation
    ref.current.quaternion.slerp(targetQuat, 0.1)

    // Update position
    ref.current.position.copy(pos)
  })

  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color={curved ? 'orange' : 'blue'} />
    </mesh>
  )
}

function BezierLine({ start, end }) {
  const control1 = start.clone().add(new THREE.Vector3(0, 2, 0))
  const control2 = end.clone().add(new THREE.Vector3(0, 2, 0))
  const curve = new THREE.CubicBezierCurve3(start, control1, control2, end)
  const points = curve.getPoints(50)
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="red" />
    </line>
  )
}

export default function App() {
  const start = new THREE.Vector3(-3, 0, 0)
  const end = new THREE.Vector3(3, 0, 0)

  return (
    <Canvas camera={{ position: [0, 3, 8], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <OrbitControls />

      {/* Puntos visibles */}
      <mesh position={start}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="green" />
      </mesh>
      <mesh position={end}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="green" />
      </mesh>

      {/* Trayectorias */}
      <BezierLine start={start} end={end} />

      {/* Interpolaciones */}
      <MovingBox start={start} end={end} curved={false} />
      <MovingBox start={start} end={end} curved={true} />
    </Canvas>
  )
}
