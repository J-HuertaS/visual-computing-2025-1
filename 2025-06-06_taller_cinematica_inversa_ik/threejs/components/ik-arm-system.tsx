"use client"

import { useRef, useState, useCallback } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Text, Line } from "@react-three/drei"
import * as THREE from "three"
import { ArmSegment } from "./arm-segment"
import { DraggableTarget } from "./draggable-target"
import { IKSolver } from "@/lib/ik-solver"

interface SegmentData {
  position: THREE.Vector3
  rotation: number
  length: number
}

export function IKArmSystem() {
  const { camera, raycaster, pointer } = useThree()

  // Arm configuration
  const segmentLengths = [2, 1.8, 1.5, 1.2] // 4 segments
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(4, 2, 0))
  const [segments, setSegments] = useState<SegmentData[]>(() =>
    segmentLengths.map((length, index) => ({
      position: new THREE.Vector3(index * length, 0, 0),
      rotation: 0,
      length,
    })),
  )

  // IK solver instance
  const ikSolver = useRef(new IKSolver())
  const [ikStats, setIkStats] = useState({ distance: 0, iterations: 0 })
  const [isReachable, setIsReachable] = useState(true)

  // Base position
  const basePosition = new THREE.Vector3(0, 0, 0)

  // Calculate end effector position
  const getEndEffectorPosition = useCallback(
    (segmentData: SegmentData[]) => {
      const position = basePosition.clone()
      let currentAngle = 0

      for (const segment of segmentData) {
        currentAngle += segment.rotation
        position.add(
          new THREE.Vector3(Math.cos(currentAngle) * segment.length, Math.sin(currentAngle) * segment.length, 0),
        )
      }

      return position
    },
    [basePosition],
  )

  // Update IK every frame
  useFrame(() => {
    const result = ikSolver.current.solveCCD(
      segments,
      basePosition,
      targetPosition,
      0.1, // tolerance
      10, // max iterations
    )

    if (result) {
      setSegments(result.segments)
      setIkStats({
        distance: result.distance,
        iterations: result.iterations,
      })
      setIsReachable(result.distance < 0.2)
    }
  })

  // Calculate positions for rendering
  const segmentPositions = segments.map((_, index) => {
    const position = basePosition.clone()
    let currentAngle = 0

    for (let i = 0; i <= index; i++) {
      if (i > 0) {
        currentAngle += segments[i - 1].rotation
        position.add(
          new THREE.Vector3(
            Math.cos(currentAngle) * segments[i - 1].length,
            Math.sin(currentAngle) * segments[i - 1].length,
            0,
          ),
        )
      }
    }

    return position
  })

  const endEffectorPos = getEndEffectorPosition(segments)

  // Create line points for visualization
  const linePoints = [basePosition, ...segmentPositions, endEffectorPos]

  // Ensure we have valid points for the line
  const validLinePoints = linePoints.filter((point) => point && !isNaN(point.x) && !isNaN(point.y) && !isNaN(point.z))

  return (
    <group>
      {/* Base */}
      <mesh position={basePosition.toArray()} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>

      {/* Arm segments */}
      {segments.map((segment, index) => {
        const position = segmentPositions[index]
        let totalRotation = 0
        for (let i = 0; i <= index; i++) {
          totalRotation += segments[i].rotation
        }

        return (
          <ArmSegment
            key={index}
            position={position.toArray()}
            rotation={totalRotation}
            length={segment.length}
            index={index}
          />
        )
      })}

      {/* End effector */}
      <mesh position={endEffectorPos.toArray()} castShadow>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color={isReachable ? "#10b981" : "#ef4444"} />
      </mesh>

      {/* Connection line */}
      {validLinePoints.length > 1 && <Line points={validLinePoints} color="#60a5fa" lineWidth={3} />}

      {/* Target line */}
      <Line
        points={[endEffectorPos, targetPosition]}
        color={isReachable ? "#10b981" : "#ef4444"}
        lineWidth={2}
        dashed={true}
        dashSize={0.1}
        gapSize={0.05}
      />

      {/* Draggable target */}
      <DraggableTarget position={targetPosition} onPositionChange={setTargetPosition} />

      {/* Info display */}
      <Text
        position={[targetPosition.x, targetPosition.y + 1, targetPosition.z]}
        fontSize={0.3}
        color={isReachable ? "#10b981" : "#ef4444"}
        anchorX="center"
        anchorY="middle"
      >
        {`Distancia: ${ikStats.distance.toFixed(2)}m`}
      </Text>

      <Text
        position={[targetPosition.x, targetPosition.y + 0.6, targetPosition.z]}
        fontSize={0.2}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        {`Iteraciones: ${ikStats.iterations}`}
      </Text>

      {/* Status indicator */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.4}
        color={isReachable ? "#10b981" : "#ef4444"}
        anchorX="center"
        anchorY="middle"
      >
        {isReachable ? "✅ OBJETIVO ALCANZABLE" : "❌ OBJETIVO FUERA DE ALCANCE"}
      </Text>
    </group>
  )
}
