"use client"

import { Html, useProgress } from "@react-three/drei"

export function LoadingFallback() {
  const { progress } = useProgress()

  return (
    <Html center>
      <div className="bg-black/80 text-white p-6 rounded-lg text-center">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
        <h3 className="text-lg font-bold mb-2">🏠 Cargando Cocina...</h3>
        <p className="text-sm text-gray-300">Optimizando modelo 3D: {Math.round(progress)}%</p>
        <div className="w-48 bg-gray-700 rounded-full h-2 mt-3">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </Html>
  )
}
