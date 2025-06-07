"use client"

import { useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF, useAnimations, Html } from "@react-three/drei"
import type { Group, AnimationAction } from "three"
import { useAnimationContext } from "@/contexts/animation-context"

// Usaremos un modelo simple para demostración
const MODEL_PATH = "/models/character.glb"

export default function AnimatedCharacter() {
  const group = useRef<Group>(null)
  const { scene, animations } = useGLTF(MODEL_PATH)
  const { actions, mixer, names } = useAnimations(animations, group)
  const { currentAnimation, setCurrentAnimation } = useAnimationContext()

  const [debugMode, setLocalDebugMode] = useState(false)
  const [availableAnimations, setAvailableAnimations] = useState<string[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const [isMoving, setIsMoving] = useState(false)

  // Mostrar las animaciones disponibles en el modelo
  useEffect(() => {
    if (names && names.length > 0) {
      setAvailableAnimations(names)
      console.log("Available animations:", names)
    } else {
      console.log("No animations found in the model")
      // Si no hay animaciones, usaremos el fallback
      setLocalDebugMode(true)
    }
  }, [names])

  // Inicializar animaciones
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      // Comenzar con animación idle o la primera disponible
      const idleAction = actions["idle"] || actions["Idle"] || actions[Object.keys(actions)[0]]
      if (idleAction) {
        idleAction.play()
        setCurrentAnimation("idle")
      }
    } else {
      console.log("No actions available")
      setLocalDebugMode(true)
    }
  }, [actions, setCurrentAnimation])

  // Manejar transiciones de animación
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return

    // Intentar encontrar la animación por nombre o variantes
    let newAction: AnimationAction | undefined

    // Buscar la animación con diferentes variantes de nombre
    const animationVariants = [
      currentAnimation,
      currentAnimation.toLowerCase(),
      currentAnimation.toUpperCase(),
      currentAnimation.charAt(0).toUpperCase() + currentAnimation.slice(1),
    ]

    for (const variant of animationVariants) {
      if (actions[variant]) {
        newAction = actions[variant]
        break
      }
    }

    // Si no encontramos la animación, usar la primera disponible
    if (!newAction && Object.keys(actions).length > 0) {
      console.log(`Animation "${currentAnimation}" not found, using fallback`)
      newAction = actions[Object.keys(actions)[0]]
    }

    if (!newAction) return

    // Fade out de animaciones actuales
    Object.values(actions).forEach((action) => {
      if (action !== newAction && action.isRunning()) {
        action.fadeOut(0.3)
      }
    })

    // Fade in de nueva animación
    newAction.reset().fadeIn(0.3).play()

    // Manejar finalización de animación
    const onFinished = () => {
      if (currentAnimation !== "idle" && !isMoving) {
        setCurrentAnimation("idle")
      }
    }

    if (currentAnimation === "wave" || currentAnimation === "jump") {
      // Configurar para reproducir una vez
      newAction.setLoop(2201, 1)
      newAction.clampWhenFinished = true
      mixer?.addEventListener("finished", onFinished)
    } else {
      // Configurar para reproducir en bucle
      newAction.setLoop(2200, Number.POSITIVE_INFINITY)
    }

    return () => {
      mixer?.removeEventListener("finished", onFinished)
    }
  }, [currentAnimation, actions, mixer, setCurrentAnimation, isMoving])

  // Controles de teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "Space":
          event.preventDefault()
          setCurrentAnimation("jump")
          break
        case "KeyW":
        case "KeyA":
        case "KeyS":
        case "KeyD":
          if (!isMoving) {
            setCurrentAnimation("run")
            setIsMoving(true)
          }
          break
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
        case "KeyA":
        case "KeyS":
        case "KeyD":
          setIsMoving(false)
          if (currentAnimation === "run") {
            setCurrentAnimation("idle")
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [isMoving, setCurrentAnimation, currentAnimation])

  // Manejar eventos de click
  const handleClick = () => {
    setCurrentAnimation("wave")
  }

  // Manejar eventos de hover
  const handlePointerOver = () => {
    setIsHovered(true)
    if (currentAnimation === "idle") {
      setCurrentAnimation("alert")
    }
  }

  const handlePointerOut = () => {
    setIsHovered(false)
    if (currentAnimation === "alert") {
      setCurrentAnimation("idle")
    }
  }

  // Actualizar animaciones en cada frame
  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta)
    }
  })

  // Forzar el uso del fallback para demostración
  useEffect(() => {
    console.log("Usando modelo de fallback con animaciones visibles")
    setLocalDebugMode(true)
  }, [])

  // Si estamos en modo debug o no hay animaciones, mostrar el modelo fallback
  if (debugMode || availableAnimations.length === 0) {
    return <FallbackCharacter />
  }

  return (
    <group ref={group} dispose={null}>
      <primitive
        object={scene}
        scale={1}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />

      {/* Feedback visual para interacciones */}
      {isHovered && (
        <mesh position={[0, 2.5, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#ff6b6b" />
        </mesh>
      )}

      {/* Panel de debug para mostrar animaciones disponibles */}
      {debugMode && (
        <Html position={[0, 3, 0]}>
          <div className="bg-black/80 text-white p-2 rounded text-xs">
            <p>Animations: {availableAnimations.join(", ")}</p>
            <p>Current: {currentAnimation}</p>
          </div>
        </Html>
      )}
    </group>
  )
}

// Componente de fallback con muñeco más realista
function FallbackCharacter() {
  const group = useRef<Group>(null)
  const bodyRef = useRef<Group>(null)
  const headRef = useRef<Group>(null)
  const leftArmRef = useRef<Group>(null)
  const rightArmRef = useRef<Group>(null)
  const leftForearmRef = useRef<Group>(null)
  const rightForearmRef = useRef<Group>(null)
  const leftLegRef = useRef<Group>(null)
  const rightLegRef = useRef<Group>(null)
  const leftCalfRef = useRef<Group>(null)
  const rightCalfRef = useRef<Group>(null)

  const { currentAnimation } = useAnimationContext()
  const [animationTime, setAnimationTime] = useState(0)

  useFrame((state, delta) => {
    if (!group.current) return

    setAnimationTime((prev) => prev + delta)
    const time = state.clock.elapsedTime

    // Reset all rotations first
    if (bodyRef.current) bodyRef.current.rotation.set(0, 0, 0)
    if (headRef.current) headRef.current.rotation.set(0, 0, 0)
    if (leftArmRef.current) leftArmRef.current.rotation.set(0, 0, 0)
    if (rightArmRef.current) rightArmRef.current.rotation.set(0, 0, 0)
    if (leftForearmRef.current) leftForearmRef.current.rotation.set(0, 0, 0)
    if (rightForearmRef.current) rightForearmRef.current.rotation.set(0, 0, 0)
    if (leftLegRef.current) leftLegRef.current.rotation.set(0, 0, 0)
    if (rightLegRef.current) rightLegRef.current.rotation.set(0, 0, 0)
    if (leftCalfRef.current) leftCalfRef.current.rotation.set(0, 0, 0)
    if (rightCalfRef.current) rightCalfRef.current.rotation.set(0, 0, 0)

    switch (currentAnimation) {
      case "wave":
        // Animación de saludo para parar bus - brazo completamente hacia arriba
        if (rightArmRef.current && rightForearmRef.current) {
          // Brazo derecho completamente hacia arriba (como parando un bus)
          rightArmRef.current.rotation.z = -Math.PI / 2 // Brazo horizontal hacia afuera
          rightArmRef.current.rotation.x = -Math.PI / 2 // Luego hacia arriba

          // Antebrazo también hacia arriba pero con movimiento de mano
          rightForearmRef.current.rotation.x = -Math.PI / 6 + Math.sin(time * 12) * 0.4 // Movimiento rápido de mano
          rightForearmRef.current.rotation.y = Math.sin(time * 8) * 0.6 // Movimiento lateral de mano
        }

        // Cuerpo se inclina ligeramente hacia el lado del brazo levantado
        if (bodyRef.current) {
          bodyRef.current.rotation.z = -0.1 + Math.sin(time * 4) * 0.05
        }

        // Cabeza mira hacia donde viene el "bus"
        if (headRef.current) {
          headRef.current.rotation.y = 0.3 + Math.sin(time * 6) * 0.2
          headRef.current.rotation.x = -0.1 // Mirando ligeramente hacia arriba
        }

        // Brazo izquierdo se mantiene relajado pero con ligero movimiento
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = Math.sin(time * 3) * 0.1
        }
        break

      case "jump":
        // Animación de salto dramática
        const jumpHeight = Math.abs(Math.sin(time * 4)) * 2.5
        group.current.position.y = jumpHeight

        // Brazos hacia arriba
        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.rotation.z = Math.PI / 2 + Math.sin(time * 4) * 0.2
          rightArmRef.current.rotation.z = -Math.PI / 2 - Math.sin(time * 4) * 0.2
        }

        // Antebrazos también hacia arriba
        if (leftForearmRef.current && rightForearmRef.current) {
          leftForearmRef.current.rotation.x = -Math.PI / 6
          rightForearmRef.current.rotation.x = -Math.PI / 6
        }

        // Piernas se flexionan
        if (leftLegRef.current && rightLegRef.current && leftCalfRef.current && rightCalfRef.current) {
          const legFlex = Math.sin(time * 4) * 0.6
          leftLegRef.current.rotation.x = legFlex
          rightLegRef.current.rotation.x = legFlex
          leftCalfRef.current.rotation.x = -legFlex * 1.5
          rightCalfRef.current.rotation.x = -legFlex * 1.5
        }
        break

      case "run":
        // Animación de carrera más realista
        const runSpeed = 12

        // Brazos alternados
        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.rotation.x = Math.sin(time * runSpeed) * 0.8
          rightArmRef.current.rotation.x = -Math.sin(time * runSpeed) * 0.8
        }

        // Antebrazos siguen el movimiento
        if (leftForearmRef.current && rightForearmRef.current) {
          leftForearmRef.current.rotation.x = -Math.abs(Math.sin(time * runSpeed)) * 0.5
          rightForearmRef.current.rotation.x = -Math.abs(Math.sin(time * runSpeed)) * 0.5
        }

        // Piernas alternadas
        if (leftLegRef.current && rightLegRef.current) {
          leftLegRef.current.rotation.x = -Math.sin(time * runSpeed) * 0.6
          rightLegRef.current.rotation.x = Math.sin(time * runSpeed) * 0.6
        }

        // Pantorrillas siguen el movimiento
        if (leftCalfRef.current && rightCalfRef.current) {
          leftCalfRef.current.rotation.x = -Math.abs(Math.sin(time * runSpeed + Math.PI)) * 0.8
          rightCalfRef.current.rotation.x = -Math.abs(Math.sin(time * runSpeed)) * 0.8
        }

        // Cuerpo inclinado hacia adelante
        if (bodyRef.current) {
          bodyRef.current.rotation.x = 0.2
        }

        // Movimiento vertical
        group.current.position.y = Math.abs(Math.sin(time * runSpeed)) * 0.15
        break

      case "alert":
        // POSTURA DE BOXEO - Guardia alta
        if (bodyRef.current) {
          // Cuerpo ligeramente inclinado y en tensión
          bodyRef.current.rotation.x = 0.1
          bodyRef.current.rotation.y = Math.sin(time * 3) * 0.1 // Ligero balanceo
          bodyRef.current.position.y = Math.sin(time * 8) * 0.02 // Tensión
        }

        // Cabeza en posición de boxeo - barbilla abajo, mirando al oponente
        if (headRef.current) {
          headRef.current.rotation.x = -0.2 // Barbilla hacia abajo
          headRef.current.rotation.y = Math.sin(time * 4) * 0.15 // Mirando alrededor
        }

        // BRAZOS EN GUARDIA ALTA DE BOXEO
        if (leftArmRef.current && rightArmRef.current) {
          // Brazo izquierdo - jab position
          leftArmRef.current.rotation.z = Math.PI / 3 + Math.sin(time * 6) * 0.05
          leftArmRef.current.rotation.x = -Math.PI / 6

          // Brazo derecho - guardia
          rightArmRef.current.rotation.z = -Math.PI / 3 - Math.sin(time * 6) * 0.05
          rightArmRef.current.rotation.x = -Math.PI / 6
        }

        // ANTEBRAZOS - puños cerca de la cara
        if (leftForearmRef.current && rightForearmRef.current) {
          leftForearmRef.current.rotation.x = -Math.PI / 2 + Math.sin(time * 8) * 0.1
          rightForearmRef.current.rotation.x = -Math.PI / 2 - Math.sin(time * 8) * 0.1
        }

        // PIERNAS - stance de boxeo
        if (leftLegRef.current && rightLegRef.current) {
          // Pierna izquierda adelante (orthodox stance)
          leftLegRef.current.rotation.x = 0.1
          // Pierna derecha atrás
          rightLegRef.current.rotation.x = -0.1
        }

        // Pantorrillas en tensión
        if (leftCalfRef.current && rightCalfRef.current) {
          leftCalfRef.current.rotation.x = -0.1
          rightCalfRef.current.rotation.x = 0.1
        }

        // Movimiento sutil de boxeador listo para pelear
        group.current.position.y = 0.05 + Math.sin(time * 10) * 0.02
        break

      default:
        // Idle: respiración natural
        group.current.position.y = Math.sin(time * 2) * 0.03
        if (bodyRef.current) {
          bodyRef.current.rotation.x = Math.sin(time * 1.5) * 0.02
        }
        // Brazos relajados
        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.rotation.x = Math.sin(time * 1.2) * 0.05
          rightArmRef.current.rotation.x = -Math.sin(time * 1.2) * 0.05
        }
    }
  })

  return (
    <group ref={group}>
      {/* TORSO - más realista */}
      <group ref={bodyRef}>
        {/* Pecho */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[0.8, 0.6, 0.4]} />
          <meshStandardMaterial color="#3498db" />
        </mesh>
        {/* Abdomen */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[0.7, 0.4, 0.35]} />
          <meshStandardMaterial color="#2980b9" />
        </mesh>
        {/* Pelvis */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.6, 0.3, 0.3]} />
          <meshStandardMaterial color="#2471a3" />
        </mesh>
      </group>

      {/* CABEZA más detallada */}
      <group ref={headRef}>
        {/* Cabeza principal */}
        <mesh position={[0, 2.1, 0]} castShadow>
          <boxGeometry args={[0.5, 0.6, 0.5]} />
          <meshStandardMaterial color="#f39c12" />
        </mesh>

        {/* Ojos */}
        <mesh position={[-0.15, 2.2, 0.26]} castShadow>
          <sphereGeometry args={[0.04]} />
          <meshStandardMaterial color="#000" />
        </mesh>
        <mesh position={[0.15, 2.2, 0.26]} castShadow>
          <sphereGeometry args={[0.04]} />
          <meshStandardMaterial color="#000" />
        </mesh>

        {/* Nariz */}
        <mesh position={[0, 2.1, 0.26]} castShadow>
          <boxGeometry args={[0.06, 0.08, 0.06]} />
          <meshStandardMaterial color="#e67e22" />
        </mesh>

        {/* Boca */}
        <mesh position={[0, 2.0, 0.26]} castShadow>
          <boxGeometry args={[0.12, 0.03, 0.02]} />
          <meshStandardMaterial color="#c0392b" />
        </mesh>
      </group>

      {/* BRAZO IZQUIERDO - articulado */}
      <group ref={leftArmRef} position={[-0.5, 1.4, 0]}>
        {/* Hombro */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.12]} />
          <meshStandardMaterial color="#e74c3c" />
        </mesh>
        {/* Brazo superior */}
        <mesh position={[-0.2, -0.2, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.4]} />
          <meshStandardMaterial color="#e74c3c" />
        </mesh>

        {/* Antebrazo */}
        <group ref={leftForearmRef} position={[-0.2, -0.5, 0]}>
          {/* Codo */}
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.08]} />
            <meshStandardMaterial color="#c0392b" />
          </mesh>
          {/* Antebrazo */}
          <mesh position={[0, -0.2, 0]} castShadow>
            <capsuleGeometry args={[0.07, 0.35]} />
            <meshStandardMaterial color="#e74c3c" />
          </mesh>
          {/* Puño */}
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.12, 0.12, 0.08]} />
            <meshStandardMaterial color="#f39c12" />
          </mesh>
        </group>
      </group>

      {/* BRAZO DERECHO - articulado */}
      <group ref={rightArmRef} position={[0.5, 1.4, 0]}>
        {/* Hombro */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.12]} />
          <meshStandardMaterial color="#e74c3c" />
        </mesh>
        {/* Brazo superior */}
        <mesh position={[0.2, -0.2, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.4]} />
          <meshStandardMaterial color="#e74c3c" />
        </mesh>

        {/* Antebrazo */}
        <group ref={rightForearmRef} position={[0.2, -0.5, 0]}>
          {/* Codo */}
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.08]} />
            <meshStandardMaterial color="#c0392b" />
          </mesh>
          {/* Antebrazo */}
          <mesh position={[0, -0.2, 0]} castShadow>
            <capsuleGeometry args={[0.07, 0.35]} />
            <meshStandardMaterial color="#e74c3c" />
          </mesh>
          {/* Puño */}
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.12, 0.12, 0.08]} />
            <meshStandardMaterial color="#f39c12" />
          </mesh>
        </group>
      </group>

      {/* PIERNA IZQUIERDA - articulada */}
      <group ref={leftLegRef} position={[-0.2, 0.2, 0]}>
        {/* Cadera */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>
        {/* Muslo */}
        <mesh position={[0, -0.25, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.5]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>

        {/* Pantorrilla */}
        <group ref={leftCalfRef} position={[0, -0.6, 0]}>
          {/* Rodilla */}
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.09]} />
            <meshStandardMaterial color="#1b2631" />
          </mesh>
          {/* Pantorrilla */}
          <mesh position={[0, -0.2, 0]} castShadow>
            <capsuleGeometry args={[0.1, 0.4]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>
          {/* Pie */}
          <mesh position={[0, -0.45, 0.1]} castShadow>
            <boxGeometry args={[0.15, 0.1, 0.3]} />
            <meshStandardMaterial color="#1b2631" />
          </mesh>
        </group>
      </group>

      {/* PIERNA DERECHA - articulada */}
      <group ref={rightLegRef} position={[0.2, 0.2, 0]}>
        {/* Cadera */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>
        {/* Muslo */}
        <mesh position={[0, -0.25, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.5]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>

        {/* Pantorrilla */}
        <group ref={rightCalfRef} position={[0, -0.6, 0]}>
          {/* Rodilla */}
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.09]} />
            <meshStandardMaterial color="#1b2631" />
          </mesh>
          {/* Pantorrilla */}
          <mesh position={[0, -0.2, 0]} castShadow>
            <capsuleGeometry args={[0.1, 0.4]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>
          {/* Pie */}
          <mesh position={[0, -0.45, 0.1]} castShadow>
            <boxGeometry args={[0.15, 0.1, 0.3]} />
            <meshStandardMaterial color="#1b2631" />
          </mesh>
        </group>
      </group>

      {/* Indicador de estado de animación */}
      <Html position={[0, 3, 0]}>
        <div
          className={`text-white p-3 rounded-lg text-sm font-bold whitespace-nowrap animate-pulse ${
            currentAnimation === "alert" ? "bg-red-600" : "bg-blue-600"
          }`}
        >
          {currentAnimation === "alert" ? "🥊 BOXING STANCE" : `🎭 ${currentAnimation.toUpperCase()}`}
        </div>
      </Html>

      {/* Efectos visuales especiales */}
      {currentAnimation === "jump" && (
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.1]} />
          <meshBasicMaterial color="#ffff00" transparent opacity={0.3} />
        </mesh>
      )}

      {currentAnimation === "alert" && (
        <>
          {/* Aura de combate */}
          <mesh position={[0, 1.5, 0]}>
            <sphereGeometry args={[1.2]} />
            <meshBasicMaterial color="#ff0000" transparent opacity={0.1} />
          </mesh>
          {/* Partículas de energía */}
          <mesh position={[-0.5, 2, 0.5]}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="#ff4444" />
          </mesh>
          <mesh position={[0.5, 1.8, -0.5]}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="#ff4444" />
          </mesh>
        </>
      )}
    </group>
  )
}

useGLTF.preload(MODEL_PATH)
