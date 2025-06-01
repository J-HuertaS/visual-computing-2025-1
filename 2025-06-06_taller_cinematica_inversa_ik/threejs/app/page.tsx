"use client"

import { Canvas } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import { Suspense } from "react"
import { IKWorkshop } from "@/components/ik-workshop"

export default function HomePage() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="absolute top-4 left-4 z-10 text-white space-y-2">
        <h1 className="text-2xl font-bold">🧪 Taller - Cinemática Inversa</h1>
        <div className="text-sm space-y-1">
          <p>🎯 Arrastra la esfera roja para mover el objetivo</p>
          <p>🦾 El brazo usa algoritmo CCD para alcanzarlo</p>
          <p>📊 Observa las métricas en tiempo real</p>
        </div>
      </div>

      <Canvas camera={{ position: [8, 6, 8], fov: 50 }}>
        <Suspense fallback={null}>
          <Environment preset="warehouse" />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          <IKWorkshop />
        </Suspense>
      </Canvas>
    </div>
  )
}
