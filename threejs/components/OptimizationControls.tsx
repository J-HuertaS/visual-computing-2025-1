"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RotateCcw, Activity } from "lucide-react"

interface OptimizationControlsProps {
  optimizations: {
    lod: boolean
    shadows: boolean
    lighting: boolean
    frustumCulling: boolean
    materials: boolean
  }
  setOptimizations: (optimizations: any) => void
  showStats: boolean
  setShowStats: (show: boolean) => void
}

export function OptimizationControls({
  optimizations,
  setOptimizations,
  showStats,
  setShowStats,
}: OptimizationControlsProps) {
  const handleOptimizationChange = (key: string, value: boolean) => {
    setOptimizations((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetToDefault = () => {
    setOptimizations({
      lod: true,
      shadows: false,
      lighting: true,
      frustumCulling: true,
      materials: true,
    })
  }

  const enableAllOptimizations = () => {
    setOptimizations({
      lod: true,
      shadows: false,
      lighting: true,
      frustumCulling: true,
      materials: true,
    })
  }

  const disableAllOptimizations = () => {
    setOptimizations({
      lod: false,
      shadows: true,
      lighting: false,
      frustumCulling: false,
      materials: false,
    })
  }

  return (
    <Card className="w-80 bg-black/90 text-white border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">🔧 Controles de Optimización</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* LOD Control */}
        <div className="flex items-center justify-between">
          <Label htmlFor="lod" className="text-sm">
            🔍 LOD (Level of Detail)
          </Label>
          <Switch
            id="lod"
            checked={optimizations.lod}
            onCheckedChange={(checked) => handleOptimizationChange("lod", checked)}
          />
        </div>

        {/* Shadows Control */}
        <div className="flex items-center justify-between">
          <Label htmlFor="shadows" className="text-sm">
            🌑 Sombras Dinámicas
          </Label>
          <Switch
            id="shadows"
            checked={optimizations.shadows}
            onCheckedChange={(checked) => handleOptimizationChange("shadows", checked)}
          />
        </div>

        {/* Lighting Control */}
        <div className="flex items-center justify-between">
          <Label htmlFor="lighting" className="text-sm">
            💡 Iluminación Optimizada
          </Label>
          <Switch
            id="lighting"
            checked={optimizations.lighting}
            onCheckedChange={(checked) => handleOptimizationChange("lighting", checked)}
          />
        </div>

        {/* Frustum Culling Control */}
        <div className="flex items-center justify-between">
          <Label htmlFor="frustum" className="text-sm">
            🚫 Frustum Culling
          </Label>
          <Switch
            id="frustum"
            checked={optimizations.frustumCulling}
            onCheckedChange={(checked) => handleOptimizationChange("frustumCulling", checked)}
          />
        </div>

        {/* Materials Control */}
        <div className="flex items-center justify-between">
          <Label htmlFor="materials" className="text-sm">
            🎨 Materiales Reutilizados
          </Label>
          <Switch
            id="materials"
            checked={optimizations.materials}
            onCheckedChange={(checked) => handleOptimizationChange("materials", checked)}
          />
        </div>

        {/* Stats Control */}
        <div className="flex items-center justify-between">
          <Label htmlFor="stats" className="text-sm flex items-center gap-1">
            <Activity className="w-4 h-4" />
            Mostrar FPS Stats
          </Label>
          <Switch id="stats" checked={showStats} onCheckedChange={setShowStats} />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-gray-700">
          <Button onClick={enableAllOptimizations} className="w-full bg-green-600 hover:bg-green-700" size="sm">
            ✅ Máxima Optimización
          </Button>

          <Button onClick={disableAllOptimizations} className="w-full bg-red-600 hover:bg-red-700" size="sm">
            ❌ Sin Optimización
          </Button>

          <Button onClick={resetToDefault} variant="outline" className="w-full" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Restablecer
          </Button>
        </div>

        {/* Performance Tips */}
        <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
          <p className="font-semibold mb-1">💡 Tips de Rendimiento:</p>
          <ul className="space-y-1">
            <li>• LOD mejora FPS en escenas complejas</li>
            <li>• Desactivar sombras aumenta rendimiento</li>
            <li>• Materiales reutilizados reducen memoria</li>
            <li>• Frustum culling oculta objetos no visibles</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
