"use client"

import { useGLTF } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useRef, useMemo, useEffect } from "react"
import { type Group, LOD, Mesh, type Material, MeshStandardMaterial } from "three"

interface OptimizationProps {
  optimizations: {
    lod: boolean
    shadows: boolean
    lighting: boolean
    frustumCulling: boolean
    materials: boolean
  }
}

export function OptimizedKitchen({ optimizations }: OptimizationProps) {
  const groupRef = useRef<Group>(null)
  const { camera } = useThree()

  // Cargar el modelo GLB
  const { scene: kitchenScene } = useGLTF("/models/Kitchen.glb")

  // Clonar y optimizar el modelo
  const optimizedKitchen = useMemo(() => {
    const clonedScene = kitchenScene.clone()

    // Almacenar los materiales originales para reutilizarlos
    const originalMaterials = new Map<Mesh, Material | Material[]>()

    clonedScene.traverse((child) => {
      if (child instanceof Mesh) {
        // Guardar el material original
        originalMaterials.set(child, child.material)

        // Configurar sombras
        child.castShadow = optimizations.shadows
        child.receiveShadow = optimizations.shadows

        // Configurar frustum culling
        child.frustumCulled = optimizations.frustumCulling
      }
    })

    return { scene: clonedScene, originalMaterials }
  }, [kitchenScene, optimizations.shadows, optimizations.frustumCulling])

  // Sistema LOD (Level of Detail) mejorado
  const lodSystem = useMemo(() => {
    if (!optimizations.lod) return null

    const lod = new LOD()

    // Versión detallada (cerca) - Material completo con texturas originales
    const detailedKitchen = optimizedKitchen.scene.clone()
    lod.addLevel(detailedKitchen, 0)

    // Versión media distancia - Mantener estructura pero simplificar algunos materiales
    const mediumKitchen = optimizedKitchen.scene.clone()
    mediumKitchen.traverse((child) => {
      if (child instanceof Mesh) {
        // Reducir calidad de sombras en media distancia
        if (optimizations.shadows) {
          child.castShadow = false
          child.receiveShadow = true
        }
      }
    })
    lod.addLevel(mediumKitchen, 8)

    // Versión lejana - Mantener todos los objetos pero con materiales más simples
    const farKitchen = optimizedKitchen.scene.clone()
    farKitchen.traverse((child) => {
      if (child instanceof Mesh) {
        // Desactivar sombras completamente en la distancia
        child.castShadow = false
        child.receiveShadow = false

        // Simplificar material pero mantener color original
        if (child.material instanceof MeshStandardMaterial) {
          const originalColor = child.material.color.clone()
          const simpleMaterial = new MeshStandardMaterial({
            color: originalColor,
            roughness: 1,
            metalness: 0,
            flatShading: true,
          })
          child.material = simpleMaterial
        }
      }
    })
    lod.addLevel(farKitchen, 15)

    return lod
  }, [optimizedKitchen, optimizations.lod, optimizations.shadows])

  // Actualizar LOD basado en distancia de cámara
  useFrame(() => {
    if (lodSystem && groupRef.current) {
      lodSystem.update(camera)
    }
  })

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.clear()

      if (lodSystem && optimizations.lod) {
        groupRef.current.add(lodSystem)
      } else {
        groupRef.current.add(optimizedKitchen.scene)
      }
    }
  }, [lodSystem, optimizedKitchen.scene, optimizations.lod])

  return <group ref={groupRef} position={[0, 0, 0]} scale={[1, 1, 1]} />
}

// Precargar el modelo
useGLTF.preload("/models/Kitchen.glb")
