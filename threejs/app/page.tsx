"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stats, Environment } from "@react-three/drei"
import { Suspense, useState } from "react"
import { OptimizedKitchen } from "@/components/OptimizedKitchen"
import { OptimizationControls } from "@/components/OptimizationControls"
import { LoadingFallback } from "@/components/LoadingFallback"

export default function OptimizationWorkshop() {
  const [optimizations, setOptimizations] = useState({
    lod: true,
    shadows: false,
    lighting: true,
    frustumCulling: true,
    materials: true,
  })

  const [showStats, setShowStats] = useState(true)

  return (
    <div className="w-full h-screen relative bg-gray-900">
      {/* Controls Panel */}
      <div className="absolute top-4 left-4 z-10">
        <OptimizationControls
          optimizations={optimizations}
          setOptimizations={setOptimizations}
          showStats={showStats}
          setShowStats={setShowStats}
        />
      </div>

      {/* Info Panel */}
      <div className="absolute top-4 right-4 z-10 bg-black/80 text-white p-4 rounded-lg max-w-sm">
        <h3 className="font-bold mb-2">🚀 Taller 59 - Optimización Visual</h3>
        <p className="text-sm mb-2">Técnicas aplicadas:</p>
        <ul className="text-xs space-y-1">
          {optimizations.lod && <li>✅ LOD (Level of Detail)</li>}
          {optimizations.lighting && <li>✅ Iluminación optimizada</li>}
          {optimizations.materials && <li>✅ Materiales preservados</li>}
          {optimizations.frustumCulling && <li>✅ Frustum Culling</li>}
          {!optimizations.shadows && <li>✅ Sombras desactivadas</li>}
        </ul>
      </div>

      {/* 3D Scene */}
      <Canvas
        camera={{ position: [5, 3, 5], fov: 60 }}
        shadows={optimizations.shadows}
        gl={{
          antialias: true, // Mantener antialiasing para mejor calidad visual
          powerPreference: "high-performance",
        }}
      >
        {showStats && <Stats />}

        <Suspense fallback={<LoadingFallback />}>
          {/* Environment optimizado */}
          <Environment preset="apartment" />

          {/* Iluminación optimizada */}
          {optimizations.lighting ? (
            <>
              <ambientLight intensity={0.5} />
              <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow={optimizations.shadows}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
            </>
          ) : (
            <>
              <ambientLight intensity={0.2} />
              <pointLight position={[2, 4, 2]} intensity={0.8} castShadow={optimizations.shadows} />
              <pointLight position={[-2, 4, -2]} intensity={0.6} castShadow={optimizations.shadows} />
              <spotLight position={[0, 6, 0]} intensity={1} castShadow={optimizations.shadows} />
            </>
          )}

          {/* Modelo de cocina optimizado */}
          <OptimizedKitchen optimizations={optimizations} />

          {/* Suelo para recibir sombras */}
          {optimizations.shadows && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#444444" />
            </mesh>
          )}
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={2}
          maxDistance={15}
        />
      </Canvas>
    </div>
  )
}
