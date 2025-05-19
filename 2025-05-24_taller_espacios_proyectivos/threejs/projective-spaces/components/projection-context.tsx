"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type ProjectionType = "perspective" | "orthographic"

interface ProjectionContextType {
  projectionType: ProjectionType
  setProjectionType: (type: ProjectionType) => void
  fov: number
  setFov: (value: number) => void
  zoom: number
  setZoom: (value: number) => void
  showHelpers: boolean
  setShowHelpers: (value: boolean) => void
  showGrid: boolean
  setShowGrid: (value: boolean) => void
}

const ProjectionContext = createContext<ProjectionContextType | undefined>(undefined)

export function ProjectionProvider({ children }: { children: ReactNode }) {
  const [projectionType, setProjectionType] = useState<ProjectionType>("perspective")
  const [fov, setFov] = useState(75)
  const [zoom, setZoom] = useState(50)
  const [showHelpers, setShowHelpers] = useState(true)
  const [showGrid, setShowGrid] = useState(true)

  return (
    <ProjectionContext.Provider
      value={{
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
      }}
    >
      {children}
    </ProjectionContext.Provider>
  )
}

export function useProjection() {
  const context = useContext(ProjectionContext)
  if (context === undefined) {
    throw new Error("useProjection must be used within a ProjectionProvider")
  }
  return context
}
