"use client"

import { useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { type Mesh, Vector3, Plane } from "three"

interface DraggableTargetProps {
  position: Vector3
  onPositionChange: (position: Vector3) => void
}

export function DraggableTarget({ position, onPositionChange }: DraggableTargetProps) {
  const meshRef = useRef<Mesh>(null)
  const { camera, gl, raycaster, pointer } = useThree()
  const [isDragging, setIsDragging] = useState(false)
  const [dragPlane] = useState(() => new Plane(new Vector3(0, 0, 1), 0))

  const handlePointerDown = (event: any) => {
    event.stopPropagation()
    setIsDragging(true)
    gl.domElement.style.cursor = "grabbing"
  }

  const handlePointerUp = () => {
    setIsDragging(false)
    gl.domElement.style.cursor = "auto"
  }

  useFrame(() => {
    if (isDragging) {
      raycaster.setFromCamera(pointer, camera)
      const intersection = new Vector3()
      raycaster.ray.intersectPlane(dragPlane, intersection)

      if (intersection) {
        // Constrain movement to reasonable bounds
        intersection.x = Math.max(-8, Math.min(8, intersection.x))
        intersection.y = Math.max(-2, Math.min(6, intersection.y))
        intersection.z = 0

        onPositionChange(intersection)
      }
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position.toArray()}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      castShadow
    >
      <sphereGeometry args={[0.25]} />
      <meshStandardMaterial color="#dc2626" emissive="#7f1d1d" emissiveIntensity={isDragging ? 0.3 : 0.1} />

      {/* Glow effect */}
      <mesh scale={1.2}>
        <sphereGeometry args={[0.25]} />
        <meshBasicMaterial color="#dc2626" transparent opacity={0.2} />
      </mesh>
    </mesh>
  )
}
