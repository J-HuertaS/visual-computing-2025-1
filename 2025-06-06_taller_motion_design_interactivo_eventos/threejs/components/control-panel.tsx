"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAnimationContext } from "@/contexts/animation-context"
import { Play, Hand, Zap, Activity, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

export default function ControlPanel() {
  const { currentAnimation, setCurrentAnimation } = useAnimationContext()
  const [activeAnimation, setActiveAnimation] = useState(currentAnimation)

  // Sincronizar el estado local con el contexto
  useEffect(() => {
    setActiveAnimation(currentAnimation)
  }, [currentAnimation])

  const animationButtons = [
    {
      id: "idle",
      label: "Idle",
      icon: <Activity className="w-4 h-4" />,
      color: "bg-blue-500 hover:bg-blue-600",
      description: "Estado de reposo",
    },
    {
      id: "wave",
      label: "Wave",
      icon: <Hand className="w-4 h-4" />,
      color: "bg-green-500 hover:bg-green-600",
      description: "Saludo con la mano",
    },
    {
      id: "run",
      label: "Run",
      icon: <Play className="w-4 h-4" />,
      color: "bg-orange-500 hover:bg-orange-600",
      description: "Correr en el lugar",
    },
    {
      id: "jump",
      label: "Jump",
      icon: <Zap className="w-4 h-4" />,
      color: "bg-purple-500 hover:bg-purple-600",
      description: "Salto vertical",
    },
    {
      id: "alert",
      label: "Alert",
      icon: <AlertTriangle className="w-4 h-4" />,
      color: "bg-red-500 hover:bg-red-600",
      description: "Estado de alerta",
    },
  ]

  return (
    <div className="absolute bottom-4 right-4">
      <Card className="bg-black/80 border-gray-700 text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">🎭 Animation Controls</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Current:</span>
            <span className="font-bold text-blue-400 bg-blue-900/50 px-2 py-1 rounded text-xs">{currentAnimation}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {animationButtons.map((button) => (
              <Button
                key={button.id}
                onClick={() => setCurrentAnimation(button.id)}
                className={`${button.color} text-white border-0 transition-all duration-200 ${
                  activeAnimation === button.id ? "ring-2 ring-white scale-105" : ""
                }`}
                size="sm"
                title={button.description}
              >
                {button.icon}
                <span className="ml-2">{button.label}</span>
              </Button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-600">
            <p className="text-xs text-gray-400 mb-2">⏱️ Duraciones:</p>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>
                • <span className="text-green-400">Wave</span>: 3 segundos
              </li>
              <li>
                • <span className="text-purple-400">Jump</span>: 3 segundos
              </li>
              <li>
                • <span className="text-orange-400">Run</span>: Continuo (mantener tecla)
              </li>
              <li>
                • <span className="text-red-400">Alert</span>: Mientras hover
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-600">
            <p className="text-xs text-gray-400 mb-2">💡 Controles:</p>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>
                • <kbd className="bg-gray-700 px-1 rounded">Click</kbd> en personaje para saludar
              </li>
              <li>
                • <kbd className="bg-gray-700 px-1 rounded">Espacio</kbd> para saltar
              </li>
              <li>
                • <kbd className="bg-gray-700 px-1 rounded">W/A/S/D</kbd> para correr
              </li>
              <li>
                • <kbd className="bg-gray-700 px-1 rounded">Hover</kbd> para alerta
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
