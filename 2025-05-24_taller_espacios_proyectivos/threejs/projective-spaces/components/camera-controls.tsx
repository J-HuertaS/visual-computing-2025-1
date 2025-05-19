"use client"

import { useProjection } from "./projection-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { CameraIcon, Grid3X3Icon, Eye, EyeOff } from "lucide-react"

export default function CameraControls() {
  const {
    projectionType,
    setProjectionType,
    fov,
    setFov,
    zoom,
    setZoom,
    showHelpers,
    setShowHelpers,
    showGrid,
    setShowGrid,
  } = useProjection()

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <CameraIcon className="h-5 w-5" />
            Tipo de Proyección
          </CardTitle>
          <CardDescription>Cambia entre proyección perspectiva y ortográfica</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={projectionType === "perspective" ? "default" : "outline"}
              onClick={() => setProjectionType("perspective")}
              className={projectionType === "perspective" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              Perspectiva
            </Button>
            <Button
              variant={projectionType === "orthographic" ? "default" : "outline"}
              onClick={() => setProjectionType("orthographic")}
              className={projectionType === "orthographic" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              Ortográfica
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Parámetros de Cámara</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={projectionType} value={projectionType}>
            <TabsContent value="perspective" className="mt-0">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="fov">Campo de Visión (FOV)</Label>
                    <span className="text-sm text-slate-400">{fov}°</span>
                  </div>
                  <Slider
                    id="fov"
                    min={10}
                    max={120}
                    step={1}
                    value={[fov]}
                    onValueChange={(value) => setFov(value[0])}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Estrecho</span>
                    <span>Amplio</span>
                  </div>
                </div>
                <div className="bg-slate-700 p-3 rounded-md mt-4">
                  <p className="text-sm text-slate-300">
                    La proyección perspectiva simula la visión humana, donde los objetos más lejanos aparecen más
                    pequeños.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orthographic" className="mt-0">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="zoom">Zoom Ortográfico</Label>
                    <span className="text-sm text-slate-400">{zoom}</span>
                  </div>
                  <Slider
                    id="zoom"
                    min={10}
                    max={100}
                    step={1}
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Alejado</span>
                    <span>Cercano</span>
                  </div>
                </div>
                <div className="bg-slate-700 p-3 rounded-md mt-4">
                  <p className="text-sm text-slate-300">
                    La proyección ortográfica mantiene el tamaño de los objetos independientemente de su distancia.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Visualización</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Grid3X3Icon className="h-4 w-4 text-slate-400" />
                <Label htmlFor="grid-toggle">Mostrar Cuadrícula</Label>
              </div>
              <Switch id="grid-toggle" checked={showGrid} onCheckedChange={setShowGrid} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {showHelpers ? (
                  <Eye className="h-4 w-4 text-slate-400" />
                ) : (
                  <EyeOff className="h-4 w-4 text-slate-400" />
                )}
                <Label htmlFor="helpers-toggle">Mostrar Frustum</Label>
              </div>
              <Switch id="helpers-toggle" checked={showHelpers} onCheckedChange={setShowHelpers} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-slate-700 rounded-lg text-sm">
        <p className="mb-2 font-medium">Instrucciones:</p>
        <ul className="list-disc pl-5 space-y-1 text-slate-300">
          <li>Usa el ratón para rotar la vista</li>
          <li>Rueda del ratón para zoom</li>
          <li>Botón derecho para mover</li>
          <li>Cambia entre cámaras para ver la diferencia</li>
        </ul>
      </div>
    </div>
  )
}
