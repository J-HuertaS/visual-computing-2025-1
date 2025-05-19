"use client"

import type React from "react"

import { Canvas } from "@react-three/fiber"
import {
  PerspectiveCamera,
  OrthographicCamera,
  Grid,
  CameraControls as DreiCameraControls,
  useHelper,
  Text,
} from "@react-three/drei"
import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { useProjection } from "./projection-context"

function Scene() {
  const { projectionType, fov, zoom, showHelpers, showGrid } = useProjection()

  const perspectiveCamRef = useRef<THREE.PerspectiveCamera>(null)
  const orthographicCamRef = useRef<THREE.OrthographicCamera>(null)
  const cameraControlsRef = useRef<any>(null)

  // Camera frustum helpers
  useHelper(showHelpers && projectionType === "perspective" ? perspectiveCamRef : null, THREE.CameraHelper)
  useHelper(showHelpers && projectionType === "orthographic" ? orthographicCamRef : null, THREE.CameraHelper)

  // Reset camera position when switching projection types
  useEffect(() => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.setPosition(0, 3, 10)
      cameraControlsRef.current.setTarget(0, 0, 0)
    }
  }, [projectionType])

  return (
    <>
      {/* Cameras */}
      <PerspectiveCamera
        ref={perspectiveCamRef}
        makeDefault={projectionType === "perspective"}
        fov={fov}
        position={[0, 3, 10]}
        near={0.1}
        far={100}
      />
      <OrthographicCamera
        ref={orthographicCamRef}
        makeDefault={projectionType === "orthographic"}
        zoom={zoom}
        position={[0, 3, 10]}
        near={0.1}
        far={100}
      />

      {/* Environment and Lighting */}
      {/* Simple gradient background instead of HDR environment */}
      <color attach="background" args={["#111827"]} />
      <fog attach="fog" args={["#111827", 15, 30]} />
      <hemisphereLight intensity={0.5} color="#88ccff" groundColor="#8844aa" />
      <spotLight position={[5, 10, 5]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />

      {/* Grid */}
      {showGrid && (
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.6}
          cellColor="#6f6f6f"
          sectionSize={5}
          sectionThickness={1.2}
          sectionColor="#9d4b4b"
          fadeDistance={30}
          position={[0, -0.01, 0]}
        />
      )}

      {/* Objects at different depths */}
      <mesh position={[-4, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#ff5555" roughness={0.2} metalness={0.8} />
      </mesh>

      <mesh position={[0, 0.5, -3]} castShadow receiveShadow>
        <tetrahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color="#55ff88" roughness={0.4} metalness={0.6} />
      </mesh>

      <mesh position={[4, 1, -6]} castShadow receiveShadow>
        <torusKnotGeometry args={[0.8, 0.3, 128, 32]} />
        <meshStandardMaterial color="#5588ff" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Position labels */}
      <Text position={[-4, 3, 0]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
        z = 0
      </Text>

      <Text position={[0, 2.5, -3]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
        z = -3
      </Text>

      <Text position={[4, 3, -6]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
        z = -6
      </Text>

      {/* Camera Controls */}
      <DreiCameraControls ref={cameraControlsRef} />
    </>
  )
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleContextLost = () => {
      console.warn("WebGL context lost detected")
      setHasError(true)
    }

    window.addEventListener("webglcontextlost", handleContextLost)

    return () => {
      window.removeEventListener("webglcontextlost", handleContextLost)
    }
  }, [])

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900 text-white p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Error de renderizado 3D</h2>
          <p className="mb-4">Se ha perdido el contexto WebGL. Esto puede ocurrir por varias razones:</p>
          <ul className="list-disc text-left ml-8 mb-4">
            <li>Tu navegador tiene WebGL desactivado</li>
            <li>Tu tarjeta gráfica no soporta WebGL o tiene drivers desactualizados</li>
            <li>Hay demasiados recursos gráficos en uso</li>
          </ul>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Recargar página
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default function ProjectiveSpaceDemo() {
  return (
    <ErrorBoundary>
      <Canvas shadows>
        <Scene />
      </Canvas>
    </ErrorBoundary>
  )
}
