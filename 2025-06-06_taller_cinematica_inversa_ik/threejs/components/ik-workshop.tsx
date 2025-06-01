"use client"

import { useRef, useState, useCallback } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Text, OrbitControls } from "@react-three/drei"
import * as THREE from "three"

interface Joint {
  position: THREE.Vector3
  angle: number
}

// Componente para crear líneas usando geometría de caja
function SimpleLine({
  start,
  end,
  color = "#ffffff",
  thickness = 0.02,
  dashed = false,
  opacity = 1,
}: {
  start: THREE.Vector3
  end: THREE.Vector3
  color?: string
  thickness?: number
  dashed?: boolean
  opacity?: number
}) {
  // Validar que los puntos sean válidos
  if (
    !start ||
    !end ||
    isNaN(start.x) ||
    isNaN(start.y) ||
    isNaN(start.z) ||
    isNaN(end.x) ||
    isNaN(end.y) ||
    isNaN(end.z)
  ) {
    return null
  }

  const direction = end.clone().sub(start)
  const length = direction.length()

  // Si la línea es muy corta, no la renderizamos
  if (length < 0.01) {
    return null
  }

  const midPoint = start.clone().add(direction.clone().multiplyScalar(0.5))
  const angle = Math.atan2(direction.y, direction.x)

  if (dashed) {
    // Para líneas punteadas, crear múltiples segmentos pequeños
    const segments = Math.max(3, Math.floor(length / 0.3))
    const segmentLength = length / segments
    const gapLength = segmentLength * 0.4

    return (
      <group>
        {Array.from({ length: Math.floor(segments / 2) }, (_, i) => {
          const segmentStart = start.clone().add(direction.clone().multiplyScalar((i * 2 * segmentLength) / length))
          const segmentEnd = start.clone().add(direction.clone().multiplyScalar(((i * 2 + 1) * segmentLength) / length))
          const segmentMid = segmentStart.clone().add(segmentEnd.clone().sub(segmentStart).multiplyScalar(0.5))

          return (
            <mesh key={i} position={segmentMid.toArray()} rotation={[0, 0, angle]}>
              <boxGeometry args={[segmentLength - gapLength, thickness, thickness]} />
              <meshBasicMaterial color={color} transparent opacity={opacity} />
            </mesh>
          )
        })}
      </group>
    )
  }

  return (
    <mesh position={midPoint.toArray()} rotation={[0, 0, angle]}>
      <boxGeometry args={[length, thickness, thickness]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  )
}

// Componente para crear un círculo usando segmentos
function SimpleCircle({
  center,
  radius,
  color = "#ffffff",
  thickness = 0.02,
  segments = 32,
  opacity = 0.5,
}: {
  center: THREE.Vector3
  radius: number
  color?: string
  thickness?: number
  segments?: number
  opacity?: number
}) {
  if (!center || isNaN(center.x) || isNaN(center.y) || isNaN(center.z) || radius <= 0) {
    return null
  }

  return (
    <group>
      {Array.from({ length: segments }, (_, i) => {
        const angle1 = (i / segments) * Math.PI * 2
        const angle2 = ((i + 1) / segments) * Math.PI * 2

        const start = new THREE.Vector3(
          center.x + Math.cos(angle1) * radius,
          center.y + Math.sin(angle1) * radius,
          center.z,
        )

        const end = new THREE.Vector3(
          center.x + Math.cos(angle2) * radius,
          center.y + Math.sin(angle2) * radius,
          center.z,
        )

        return <SimpleLine key={i} start={start} end={end} color={color} thickness={thickness} opacity={opacity} />
      })}
    </group>
  )
}

export function IKWorkshop() {
  const { camera, raycaster, pointer, gl } = useThree()

  // Arm configuration
  const segmentLengths = [2.0, 1.8, 1.5, 1.2]
  const numSegments = segmentLengths.length

  // State
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(4, 2, 0))
  const [joints, setJoints] = useState<Joint[]>(() =>
    Array.from({ length: numSegments }, () => ({
      position: new THREE.Vector3(),
      angle: 0,
    })),
  )
  const [isDragging, setIsDragging] = useState(false)
  const [stats, setStats] = useState({ distance: 0, iterations: 0, reachable: true })

  const targetRef = useRef<THREE.Mesh>(null)
  const orbitControlsRef = useRef<any>(null)
  const basePosition = new THREE.Vector3(0, 0, 0)

  // Calculate forward kinematics
  const calculateFK = useCallback(
    (angles: number[]) => {
      const positions: THREE.Vector3[] = []
      let currentPos = basePosition.clone()
      let currentAngle = 0

      positions.push(currentPos.clone())

      for (let i = 0; i < numSegments; i++) {
        currentAngle += angles[i]
        const segmentEnd = new THREE.Vector3(
          currentPos.x + segmentLengths[i] * Math.cos(currentAngle),
          currentPos.y + segmentLengths[i] * Math.sin(currentAngle),
          currentPos.z,
        )
        positions.push(segmentEnd.clone())
        currentPos = segmentEnd
      }

      return positions
    },
    [segmentLengths, numSegments, basePosition],
  )

  // CCD IK Solver
  const solveCCD = useCallback(
    (target: THREE.Vector3, currentAngles: number[]) => {
      const angles = [...currentAngles]
      const tolerance = 0.1
      const maxIterations = 10
      let iterations = 0

      for (let iter = 0; iter < maxIterations; iter++) {
        iterations++

        const positions = calculateFK(angles)
        const endEffector = positions[positions.length - 1]
        const distance = endEffector.distanceTo(target)

        if (distance < tolerance) {
          setStats({ distance, iterations, reachable: true })
          return angles
        }

        // Work backwards through joints
        for (let i = numSegments - 1; i >= 0; i--) {
          const jointPos = positions[i]
          const currentEnd = calculateFK(angles)[numSegments]

          const toEnd = currentEnd.clone().sub(jointPos)
          const toTarget = target.clone().sub(jointPos)

          if (toEnd.length() < 0.001 || toTarget.length() < 0.001) continue

          const currentAngle = Math.atan2(toEnd.y, toEnd.x)
          const targetAngle = Math.atan2(toTarget.y, toTarget.x)

          let deltaAngle = targetAngle - currentAngle

          // Normalize angle
          while (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI
          while (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI

          // Limit rotation speed
          const maxDelta = Math.PI / 8
          deltaAngle = Math.max(-maxDelta, Math.min(maxDelta, deltaAngle))

          angles[i] += deltaAngle
        }
      }

      const finalPositions = calculateFK(angles)
      const finalDistance = finalPositions[finalPositions.length - 1].distanceTo(target)
      const totalReach = segmentLengths.reduce((sum, length) => sum + length, 0)
      const reachable = target.distanceTo(basePosition) <= totalReach

      setStats({ distance: finalDistance, iterations, reachable })
      return angles
    },
    [calculateFK, numSegments, segmentLengths, basePosition],
  )

  // Handle target dragging
  const handlePointerDown = useCallback(
    (event: any) => {
      if (event.object === targetRef.current) {
        setIsDragging(true)
        gl.domElement.style.cursor = "grabbing"
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = false
        }
        event.stopPropagation()
      }
    },
    [gl],
  )

  const handlePointerUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      gl.domElement.style.cursor = "auto"
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = true
      }
    }
  }, [isDragging, gl])

  const handlePointerLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      gl.domElement.style.cursor = "auto"
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = true
      }
    }
  }, [isDragging, gl])

  // Update IK every frame
  useFrame(() => {
    if (isDragging) {
      raycaster.setFromCamera(pointer, camera)
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
      const intersection = new THREE.Vector3()

      if (raycaster.ray.intersectPlane(plane, intersection)) {
        intersection.x = Math.max(-8, Math.min(8, intersection.x))
        intersection.y = Math.max(-2, Math.min(6, intersection.y))
        intersection.z = 0
        setTargetPosition(intersection.clone())
      }
    }

    const currentAngles = joints.map((joint) => joint.angle)
    const newAngles = solveCCD(targetPosition, currentAngles)
    const newPositions = calculateFK(newAngles)

    setJoints(
      newAngles.map((angle, i) => ({
        angle,
        position: newPositions[i],
      })),
    )
  })

  const positions = calculateFK(joints.map((j) => j.angle))
  const endEffectorPos = positions[positions.length - 1]
  const totalReach = segmentLengths.reduce((sum, length) => sum + length, 0)

  return (
    <group>
      {/* Controles de órbita */}
      <OrbitControls
        ref={orbitControlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        enabled={!isDragging}
        minDistance={3}
        maxDistance={15}
      />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Base */}
      <mesh position={basePosition.toArray()}>
        <cylinderGeometry args={[0.4, 0.4, 0.3]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>

      {/* Arm segments */}
      {positions.slice(0, -1).map((position, i) => {
        const nextPosition = positions[i + 1]
        const direction = nextPosition.clone().sub(position)
        const length = direction.length()
        const midPoint = position.clone().add(direction.clone().multiplyScalar(0.5))
        const angle = Math.atan2(direction.y, direction.x)

        const colors = ["#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

        return (
          <group key={i}>
            {/* Joint */}
            <mesh position={position.toArray()}>
              <sphereGeometry args={[0.15]} />
              <meshStandardMaterial color="#374151" />
            </mesh>

            {/* Segment */}
            <mesh position={midPoint.toArray()} rotation={[0, 0, angle]}>
              <boxGeometry args={[length, 0.2, 0.2]} />
              <meshStandardMaterial color={colors[i % colors.length]} />
            </mesh>
          </group>
        )
      })}

      {/* End effector */}
      <mesh position={endEffectorPos.toArray()}>
        <sphereGeometry args={[0.12]} />
        <meshStandardMaterial
          color={stats.reachable ? "#10b981" : "#ef4444"}
          emissive={stats.reachable ? "#065f46" : "#7f1d1d"}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Target */}
      <mesh
        ref={targetRef}
        position={targetPosition.toArray()}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerEnter={() => {
          if (!isDragging) {
            gl.domElement.style.cursor = "grab"
          }
        }}
        onPointerOut={() => {
          if (!isDragging) {
            gl.domElement.style.cursor = "auto"
          }
        }}
      >
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial
          color={isDragging ? "#ff6b6b" : "#dc2626"}
          emissive={isDragging ? "#ff2f2f" : "#7f1d1d"}
          emissiveIntensity={isDragging ? 0.6 : 0.2}
        />

        {isDragging && (
          <mesh scale={1.3}>
            <ringGeometry args={[0.22, 0.26, 16]} />
            <meshBasicMaterial color="#ffff00" transparent opacity={0.8} />
          </mesh>
        )}
      </mesh>

      {/* LÍNEAS USANDO COMPONENTES SIMPLES */}

      {/* 1. Línea desde la base hasta el objetivo (línea directa) */}
      <SimpleLine start={basePosition} end={targetPosition} color="#ffff00" thickness={0.03} dashed={true} />

      {/* 2. Cadena del brazo (líneas conectando cada segmento) */}
      {positions.slice(0, -1).map((position, i) => {
        const nextPosition = positions[i + 1]
        return (
          <SimpleLine
            key={`arm-${i}`}
            start={position}
            end={nextPosition}
            color="#60a5fa"
            thickness={0.04}
            opacity={0.8}
          />
        )
      })}

      {/* 3. Línea desde el end effector hasta el objetivo */}
      <SimpleLine
        start={endEffectorPos}
        end={targetPosition}
        color={stats.reachable ? "#10b981" : "#ef4444"}
        thickness={0.02}
        dashed={true}
        opacity={0.7}
      />

      {/* 4. Círculo de alcance máximo */}
      <SimpleCircle center={basePosition} radius={totalReach} color="#94a3b8" thickness={0.01} opacity={0.3} />

      {/* Stats display */}
      <Text
        position={[targetPosition.x, targetPosition.y + 1, targetPosition.z]}
        fontSize={0.3}
        color={stats.reachable ? "#10b981" : "#ef4444"}
        anchorX="center"
        anchorY="middle"
      >
        {`Distancia: ${stats.distance.toFixed(2)}m`}
      </Text>

      <Text
        position={[targetPosition.x, targetPosition.y + 0.6, targetPosition.z]}
        fontSize={0.2}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        {`Iteraciones: ${stats.iterations}`}
      </Text>

      <Text
        position={[0, 5, 0]}
        fontSize={0.4}
        color={stats.reachable ? "#10b981" : "#ef4444"}
        anchorX="center"
        anchorY="middle"
      >
        {stats.reachable ? "✅ OBJETIVO ALCANZABLE" : "❌ FUERA DE ALCANCE"}
      </Text>

      {/* Instructions */}
      <Text position={[-6, 4, 0]} fontSize={0.25} color="#e2e8f0" anchorX="left" anchorY="middle">
        {
          "🎯 Arrastra la esfera roja\n🦾 Algoritmo: CCD (Cyclic Coordinate Descent)\n📊 Métricas en tiempo real\n🖱️ Los controles se pausan al arrastrar"
        }
      </Text>

      {/* Leyenda de líneas */}
      <Text position={[6, 3, 0]} fontSize={0.2} color="#e2e8f0" anchorX="left" anchorY="top">
        {"📏 LÍNEAS:\n" +
          "🟡 Base → Objetivo (directa)\n" +
          "🔵 Cadena del brazo\n" +
          "🟢/🔴 End effector → Objetivo\n" +
          "⚪ Alcance máximo (círculo)"}
      </Text>

      {/* Drag status indicator */}
      {isDragging && (
        <Text position={[0, -2, 0]} fontSize={0.3} color="#ffff00" anchorX="center" anchorY="middle">
          {"🔒 MODO ARRASTRE ACTIVO"}
        </Text>
      )}
    </group>
  )
}
