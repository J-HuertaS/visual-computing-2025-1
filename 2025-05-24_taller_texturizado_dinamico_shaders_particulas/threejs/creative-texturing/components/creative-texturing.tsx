"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { useControls } from "leva"

// para simular líquido o energía
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uIntensity;
  uniform float uSpeed;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  // Función de ruido simplex
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    // Calcular distancia al mouse
    vec2 mouseDirection = uMouse - vUv;
    float mouseDistance = length(mouseDirection);
    
    // Crear patrones de ruido animados
    float noise1 = snoise(vUv * 3.0 + uTime * uSpeed * 0.1);
    float noise2 = snoise(vUv * 5.0 - uTime * uSpeed * 0.15);
    float noise3 = snoise(vUv * 8.0 + uTime * uSpeed * 0.2);
    
    // Combinar ruidos para crear un patrón complejo
    float combinedNoise = (noise1 + noise2 * 0.5 + noise3 * 0.25) * 0.5 + 0.5;
    
    // Añadir influencia del mouse
    float mouseInfluence = smoothstep(0.5, 0.0, mouseDistance) * 2.0;
    combinedNoise = mix(combinedNoise, 1.0, mouseInfluence * 0.5);
    
    // Mezclar colores basados en el ruido
    vec3 finalColor = mix(uColor1, uColor2, combinedNoise);
    
    // Añadir brillo basado en el ángulo de la normal
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
    finalColor += vec3(1.0, 1.0, 1.0) * fresnel * uIntensity;
    
    // Añadir efecto de pulso
    float pulse = sin(uTime * uSpeed) * 0.5 + 0.5;
    finalColor *= 1.0 + pulse * 0.2 * uIntensity;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

// Componente principal
export default function CreativeTexturing() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <color attach="background" args={["#050505"]} />
      <Scene />
      <OrbitControls enableDamping dampingFactor={0.05} />
    </Canvas>
  )
}

// Escena con controles
function Scene() {
  const [exploding, setExploding] = useState(false)
  const mousePos = useRef(new THREE.Vector2(0.5, 0.5))
  const { size } = useThree()

  // Controles para ajustar parámetros en tiempo real
  const controls = useControls({
    // Controles para la esfera (removed color controls)
    intensity: { value: 1.5, min: 0, max: 3, step: 0.1 },
    speed: { value: 1.0, min: 0.1, max: 3, step: 0.1 },

    // Controles para las partículas
    particleCount: { value: 500, min: 100, max: 2000, step: 100 },
    particleSize: { value: 0.02, min: 0.01, max: 0.1, step: 0.01 },
    particleColor: "#ffffff",
  })

  // Colores fijos para la esfera
  const fixedColor1 = "#00aaff"
  const fixedColor2 = "#ff00aa"

  // Convertir colores hexadecimales a vectores RGB
  const color1Vec = useMemo(() => {
    const c = new THREE.Color(fixedColor1)
    return new THREE.Vector3(c.r, c.g, c.b)
  }, [])

  const color2Vec = useMemo(() => {
    const c = new THREE.Color(fixedColor2)
    return new THREE.Vector3(c.r, c.g, c.b)
  }, [])

  // Actualizar posición del mouse
  const handlePointerMove = (e) => {
    mousePos.current.x = e.clientX / size.width
    mousePos.current.y = 1 - e.clientY / size.height
  }

  // Activar explosión al hacer clic
  const handleClick = () => {
    setExploding(true)
    setTimeout(() => setExploding(false), 2000)
  }

  // Efecto para registrar eventos
  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("click", handleClick)
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("click", handleClick)
    }
  }, [])

  return (
    <>
      <DynamicSphere
        mousePos={mousePos}
        color1={color1Vec}
        color2={color2Vec}
        intensity={controls.intensity}
        speed={controls.speed}
        onClick={handleClick}
      />
      <ParticleSystem
        exploding={exploding}
        count={controls.particleCount}
        size={controls.particleSize}
        color={controls.particleColor}
      />
    </>
  )
}

// Esfera con shader personalizado
function DynamicSphere({ mousePos, color1, color2, intensity, speed, onClick }) {
  const meshRef = useRef()
  const materialRef = useRef()

  // Crear uniforms para el shader
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColor1: { value: color1 },
      uColor2: { value: color2 },
      uIntensity: { value: intensity },
      uSpeed: { value: speed },
    }),
    [color1, color2, intensity, speed],
  )

  // Actualizar uniforms del shader en cada frame
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
      materialRef.current.uniforms.uMouse.value = mousePos.current
    }
  })

  return (
    <mesh ref={meshRef} onClick={onClick}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

// Sistema de partículas mejorado con controles dinámicos
function ParticleSystem({ exploding, count = 500, size = 0.02, color = "#ffffff" }) {
  const groupRef = useRef()
  const particlesRef = useRef([])
  const prevCountRef = useRef(count)

  // Crear o actualizar partículas cuando cambian los controles
  useEffect(() => {
    if (!groupRef.current) return

    const group = groupRef.current
    const currentCount = particlesRef.current.length

    // Si la cantidad de partículas ha cambiado
    if (currentCount !== count) {
      // Eliminar partículas si hay demasiadas
      if (currentCount > count) {
        for (let i = currentCount - 1; i >= count; i--) {
          group.remove(particlesRef.current[i])
        }
        particlesRef.current = particlesRef.current.slice(0, count)
      }
      // Añadir más partículas si hacen falta
      else if (currentCount < count) {
        for (let i = currentCount; i < count; i++) {
          // Posición en esfera
          const phi = Math.acos(2 * Math.random() - 1)
          const theta = Math.random() * Math.PI * 2
          const radius = 1.2

          const x = radius * Math.sin(phi) * Math.cos(theta)
          const y = radius * Math.sin(phi) * Math.sin(theta)
          const z = radius * Math.cos(phi)

          // Crear geometría para la partícula
          const geometry = new THREE.SphereGeometry(size, 4, 4)
          const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(color),
            transparent: true,
            opacity: 0.7,
          })

          // Crear la malla
          const particle = new THREE.Mesh(geometry, material)
          particle.position.set(x, y, z)

          // Guardar velocidad como propiedad personalizada
          particle.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05,
          )

          // Guardar posición original
          particle.userData.originalPosition = new THREE.Vector3(x, y, z)

          // Añadir a la escena
          group.add(particle)
          particlesRef.current.push(particle)
        }
      }
    }

    // Actualizar tamaño de partículas si ha cambiado
    particlesRef.current.forEach((particle) => {
      if (particle.geometry.parameters.radius !== size) {
        // Reemplazar geometría con nueva de tamaño actualizado
        particle.geometry.dispose()
        particle.geometry = new THREE.SphereGeometry(size, 4, 4)
      }

      // Actualizar color si ha cambiado
      if (particle.material.color.getHexString() !== new THREE.Color(color).getHexString()) {
        particle.material.color.set(color)
      }
    })

    prevCountRef.current = count
  }, [count, size, color])

  // Animar partículas
  useFrame(({ clock }) => {
    if (!groupRef.current || !particlesRef.current.length) return

    const time = clock.getElapsedTime()

    particlesRef.current.forEach((particle, index) => {
      if (exploding) {
        // Alejar partículas del centro
        particle.position.x += particle.userData.velocity.x
        particle.position.y += particle.userData.velocity.y
        particle.position.z += particle.userData.velocity.z
      } else {
        // Volver a posición original con movimiento ondulante
        const origPos = particle.userData.originalPosition

        const xOffset = Math.sin(time * 0.5 + index * 0.01) * 0.01
        const yOffset = Math.cos(time * 0.6 + index * 0.01) * 0.01
        const zOffset = Math.sin(time * 0.7 + index * 0.01) * 0.01

        particle.position.x += (origPos.x + xOffset - particle.position.x) * 0.05
        particle.position.y += (origPos.y + yOffset - particle.position.y) * 0.05
        particle.position.z += (origPos.z + zOffset - particle.position.z) * 0.05
      }
    })
  })

  return <group ref={groupRef} />
}
