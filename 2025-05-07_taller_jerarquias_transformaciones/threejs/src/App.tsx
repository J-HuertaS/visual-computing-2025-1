import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useControls } from 'leva'
import { useRef } from 'react'
import * as THREE from 'three'

function ParentGroup() {
  const groupRef = useRef<THREE.Group>(null)
  
  const { rotation, position } = useControls({
    rotation: {
      value: 0,
      min: 0,
      max: Math.PI * 2,
      step: 0.1
    },
    position: {
      value: 0,
      min: -2,
      max: 2,
      step: 0.1
    }
  })

  return (
    <group 
      ref={groupRef}
      rotation={[0, rotation, 0]}
      position={[position, 0, 0]}
    >
      {/* Cubo padre */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>

      {/* Esfera hijo */}
      <mesh position={[2, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>

      {/* Dona nieta */}
      <group position={[2, 0, 0]}>
        <mesh position={[1, 0, 0]}>
          <torusGeometry args={[0.3, 0.1, 16, 32]} />
          <meshStandardMaterial color="lightgreen" />
        </mesh>
      </group>
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <ParentGroup />
      <OrbitControls />
    </>
  )
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 75 }}>
        <Scene />
      </Canvas>
    </div>
  )
}

export default App 