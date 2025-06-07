"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Text, Html } from "@react-three/drei"
import { Suspense, useState } from "react"
import AnimatedCharacter from "@/components/animated-character"
import ControlPanel from "@/components/control-panel"
import { AnimationProvider } from "@/contexts/animation-context"
import { Button } from "@/components/ui/button"
import { Bug } from "lucide-react"

export default function MotionDesignTaller() {
  const [debugMode, setDebugMode] = useState(false)

  return (
    <div className="w-full h-screen relative bg-gradient-to-b from-gray-900 to-black">
      <AnimationProvider>
        <Canvas camera={{ position: [0, 2, 5], fov: 50 }} shadows>
          <Suspense
            fallback={
              <Html center>
                <div className="text-white text-xl bg-black/50 p-4 rounded">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  Cargando modelo 3D...
                </div>
              </Html>
            }
          >
            {/* Iluminación */}
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <pointLight position={[-5, 3, -5]} intensity={0.5} color="#ff6b6b" />

            {/* Entorno */}
            <Environment preset="sunset" />

            {/* Plano del suelo */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#2c3e50" />
            </mesh>

            {/* Personaje animado */}
            <AnimatedCharacter />

            {/* Título de la escena */}
            <Text position={[0, 4, -2]} fontSize={0.5} color="#ecf0f1" anchorX="center" anchorY="middle">
              Motion Design Interactive Workshop
            </Text>

            {/* Controles de cámara */}
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={3} maxDistance={10} />
          </Suspense>
        </Canvas>

        {/* Panel de control */}
        <ControlPanel />

        {/* Instrucciones */}
        <div className="absolute top-4 left-4 bg-black/70 text-white p-4 rounded-lg max-w-sm">
          <h3 className="font-bold mb-2">🎮 Controles</h3>
          <ul className="text-sm space-y-1">
            <li>
              <kbd className="bg-gray-700 px-2 py-1 rounded">Click</kbd> - Animación de saludo
            </li>
            <li>
              <kbd className="bg-gray-700 px-2 py-1 rounded">Espacio</kbd> - Animación de salto
            </li>
            <li>
              <kbd className="bg-gray-700 px-2 py-1 rounded">W/A/S/D</kbd> - Animación de carrera
            </li>
            <li>
              <kbd className="bg-gray-700 px-2 py-1 rounded">Hover</kbd> - Estado de alerta
            </li>
          </ul>
        </div>

        {/* Botón de modo debug */}
        <Button
          className="absolute top-4 right-4 bg-red-600 hover:bg-red-700"
          size="sm"
          onClick={() => setDebugMode(!debugMode)}
        >
          <Bug className="w-4 h-4 mr-2" />
          {debugMode ? "Ocultar Debug" : "Mostrar Debug"}
        </Button>

        {/* Panel de debug */}
        {debugMode && (
          <div className="absolute bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg max-w-sm text-xs font-mono">
            <h4 className="font-bold mb-2">🐞 Debug Info</h4>
            <p>Si el modelo no muestra animaciones, es posible que:</p>
            <ul className="list-disc pl-4 mt-2 space-y-1">
              <li>El modelo no tenga las animaciones con los nombres esperados</li>
              <li>El formato del modelo no sea compatible</li>
              <li>Las animaciones no estén correctamente exportadas</li>
            </ul>
            <p className="mt-2">En estos casos, el sistema mostrará un modelo de fallback con animaciones simuladas.</p>
          </div>
        )}
      </AnimationProvider>
    </div>
  )
}
