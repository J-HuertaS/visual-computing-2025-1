"use client"
import ProjectiveSpaceDemo from "@/components/projective-space-demo"
import CameraControls from "@/components/camera-controls"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectionProvider } from "@/components/projection-context"

export default function Home() {
  return (
    <ProjectionProvider>
      <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-center mb-2">Espacios Proyectivos y Matrices de Proyección</h1>
            <p className="text-xl text-center text-slate-300">
              Visualización interactiva de proyecciones ortográficas y perspectivas
            </p>
          </header>

          <Tabs defaultValue="demo" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="demo">Demostración 3D</TabsTrigger>
              <TabsTrigger value="info">Información Técnica</TabsTrigger>
            </TabsList>

            <TabsContent value="demo" className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 bg-slate-800 rounded-lg overflow-hidden shadow-xl border border-slate-700 h-[600px]">
                  <ProjectiveSpaceDemo />
                </div>
                <div className="lg:col-span-1">
                  <CameraControls />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="info">
              <div className="bg-slate-800 p-6 rounded-lg shadow-xl border border-slate-700">
                <h2 className="text-2xl font-bold mb-4">Proyecciones en Gráficos 3D</h2>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-2 text-emerald-400">Proyección Perspectiva</h3>
                  <p className="mb-4 text-slate-300">
                    La proyección perspectiva simula la visión humana, donde los objetos más lejanos aparecen más
                    pequeños. Utiliza un frustum (pirámide truncada) como volumen de visualización y crea una sensación
                    de profundidad realista.
                  </p>
                  <div className="bg-slate-700 p-4 rounded-md">
                    <pre className="text-sm text-slate-300">
                      {`// Matriz de proyección perspectiva
P = [
  f/aspect   0       0              0
  0          f       0              0
  0          0       (n+f)/(n-f)   2nf/(n-f)
  0          0       -1             0
]

donde:
f = cot(fov/2)
n = near plane
f = far plane
aspect = relación de aspecto`}
                    </pre>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-2 text-blue-400">Proyección Ortográfica</h3>
                  <p className="mb-4 text-slate-300">
                    La proyección ortográfica mantiene el tamaño de los objetos independientemente de su distancia.
                    Utiliza un paralelepípedo como volumen de visualización y es útil para vistas técnicas donde la
                    escala precisa es importante.
                  </p>
                  <div className="bg-slate-700 p-4 rounded-md">
                    <pre className="text-sm text-slate-300">
                      {`// Matriz de proyección ortográfica
P = [
  2/(r-l)    0         0           -(r+l)/(r-l)
  0          2/(t-b)   0           -(t+b)/(t-b)
  0          0         -2/(f-n)    -(f+n)/(f-n)
  0          0         0           1
]

donde:
l, r = planos izquierdo y derecho
b, t = planos inferior y superior
n, f = planos cercano y lejano`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-purple-400">Diferencias Clave</h3>
                  <ul className="list-disc pl-6 text-slate-300 space-y-2">
                    <li>
                      La proyección perspectiva crea una sensación de profundidad realista, mientras que la ortográfica
                      mantiene las proporciones exactas.
                    </li>
                    <li>
                      En perspectiva, las líneas paralelas convergen en puntos de fuga; en ortográfica, permanecen
                      paralelas.
                    </li>
                    <li>
                      La perspectiva es ideal para visualizaciones realistas, mientras que la ortográfica es mejor para
                      dibujos técnicos y arquitectónicos.
                    </li>
                    <li>
                      La distorsión perspectiva afecta a las mediciones, mientras que la ortográfica preserva las
                      dimensiones reales.
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </ProjectionProvider>
  )
}
