"use client"

import { useRef } from "react"
import type { Mesh } from "three"

interface ArmSegmentProps {
  position: [number, number, number]
  rotation: number
  length: number
  index: number
}

export function ArmSegment({ position, rotation, length, index }: ArmSegmentProps) {
  const meshRef = useRef<Mesh>(null)

  // Color gradient for segments
  const colors = ["#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]
  const color = colors[index % colors.length]

  return (
    <group position={position} rotation={[0, 0, rotation]}>
      {/* Joint */}
      <mesh castShadow>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* Segment */}
      <mesh ref={meshRef} position={[length / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.3, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Segment label */}
      <mesh position={[length / 2, 0.5, 0]}>
        <planeGeometry args={[0.8, 0.3]} />
        <meshBasicMaterial color="#1f2937" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}
