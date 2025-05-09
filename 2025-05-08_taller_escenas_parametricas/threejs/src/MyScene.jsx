import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useControls } from 'leva'

//Se crea una función box, ya que se van a imprimir cubos o paralelepipedos
function Box({ position, scale, color, rotation }) {
  return (
    //Los parámtros que se pasan a la malla se definen cómo variables para poder ser modificados
    <mesh position={position} scale={scale} rotation={rotation}>
      <boxGeometry />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

//La función Scene es dónde va a estar toda la escena
export default function Scene() {
  /*Este hook se activa cada vez que se usan controles en la escena, 
  se definen tres controladores, que se configuran según los parámetros,
  el primero es un selector de color con un color predeterminado, y 
  los otros dos son sliders, uno para la escala y otro para la rotación,
  aquí también se definen sus límites */
  const { baseColor, baseScale, rotateX } = useControls({
    baseColor: '#ff6347',
    baseScale: { value: 1, min: 0.1, max: 3 },
    rotateX: { value: 0, min: 0, max: Math.PI * 2 },
  })

  //Aquí se definen los centros de cada una de las cajas
  const data = [
    { id: 1, type: 'A', offset: [0, 0, 0] },
    { id: 2, type: 'B', offset: [2, 0, 0] },
    { id: 3, type: 'C', offset: [-2, 0, 0] },
  ]

  return (
    /*Se configuran los parámetros de la cámara, que son su posición 
    y ángulo de apertura, además de ods tipos de luces*/
    <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <OrbitControls />

      {data.map((item, index) => {
        /*Se hace un mapeo de cada item, haciendo que los cambios varíen
        según la caja, por ejemplo, la escala cambia en X para A, en Y para B
        y en Z para C, el color sólo cambia para A, y todos rotan en X*/
        const scale = item.type === 'A' ? [baseScale, 1, 1] :
                      item.type === 'B' ? [1, baseScale, 1] :
                                          [1, 1, baseScale]

        const color = item.type === 'A' ? baseColor :
                      item.type === 'B' ? 'skyblue' :
                                          'limegreen'

        const rotation = [rotateX, 0, 0]

        //Se retorna la caja con sus datos
        return (
          <Box
            key={item.id}
            position={item.offset}
            scale={scale}
            color={color}
            rotation={rotation}
          />
        )
      })}
    </Canvas>
  )
}