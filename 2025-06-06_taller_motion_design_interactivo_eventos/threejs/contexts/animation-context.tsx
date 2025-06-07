"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

interface AnimationContextType {
  currentAnimation: string
  setCurrentAnimation: (animation: string) => void
  isTransitioning: boolean
  setIsTransitioning: (transitioning: boolean) => void
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined)

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [currentAnimation, setCurrentAnimation] = useState("idle")
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Auto-return to idle after certain animations
  useEffect(() => {
    if (currentAnimation === "wave" || currentAnimation === "jump") {
      const timer = setTimeout(() => {
        setCurrentAnimation("idle")
      }, 3000) // 3 segundos de animación

      return () => clearTimeout(timer)
    }
  }, [currentAnimation])

  return (
    <AnimationContext.Provider
      value={{
        currentAnimation,
        setCurrentAnimation,
        isTransitioning,
        setIsTransitioning,
      }}
    >
      {children}
    </AnimationContext.Provider>
  )
}

export function useAnimationContext() {
  const context = useContext(AnimationContext)
  if (context === undefined) {
    throw new Error("useAnimationContext must be used within an AnimationProvider")
  }
  return context
}
