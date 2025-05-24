"use client"

import dynamic from "next/dynamic"

// Disable SSR for the 3D component
const CreativeTexturing = dynamic(() => import("@/components/creative-texturing"), { ssr: false })

export default function Home() {
  return (
    <main className="w-full h-screen">
      <CreativeTexturing />
    </main>
  )
}
