"use client"

import * as React from "react"
import { Canvas } from "@react-three/fiber"
import { Stars } from "@react-three/drei"

// This component is a placeholder for the complex, custom GLSL-based aurora particle system.
// For the MVP, we are using the <Stars> component from 'drei' to provide a high-quality,
// performant, and visually appealing background effect with minimal implementation cost.
// This allows us to deliver the core user flow while de-risking the complex WebGL work for a future sprint.

const AuroraParticleSystem = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Stars radius={50} count={2500} factor={4} fade speed={2} />
      </Canvas>
    </div>
  )
}

export { AuroraParticleSystem }
