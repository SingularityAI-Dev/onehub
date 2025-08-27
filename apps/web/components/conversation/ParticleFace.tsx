"use client"

import * as React from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"
import { useConversationStore } from "@/lib/store"

// This component renders the main WebGL "face" of the agent.
// It's a sphere of particles with morph targets for different expressions.

const ParticleSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { agentStatus } = useConversationStore()

  // Create the base geometry and the morph targets
  const { geometry, morphTargets } = useMemo(() => {
    const geometry = new THREE.SphereGeometry(2, 64, 64)
    const positionAttribute = geometry.attributes.position;

    // Morph Target: Thinking (a slow, noisy pulse)
    const thinkingPositions = []
    const noise = new THREE.Vector3()
    for (let i = 0; i < positionAttribute.count; i++) {
      const p = new THREE.Vector3().fromBufferAttribute(positionAttribute, i);
      noise.set(Math.random(), Math.random(), Math.random()).multiplyScalar(0.1);
      thinkingPositions.push(p.x + noise.x, p.y + noise.y, p.z + noise.z);
    }

    // Morph Target: Speaking (vertices pushed outwards)
    const speakingPositions = [];
    for (let i = 0; i < positionAttribute.count; i++) {
        const p = new THREE.Vector3().fromBufferAttribute(positionAttribute, i);
        const outwards = p.clone().normalize().multiplyScalar(0.2);
        speakingPositions.push(p.x + outwards.x, p.y + outwards.y, p.z + outwards.z);
    }

    geometry.morphAttributes.position = [
        new THREE.Float32BufferAttribute(thinkingPositions, 3),
        new THREE.Float32BufferAttribute(speakingPositions, 3)
    ];

    const morphTargets = {
        thinking: 0,
        speaking: 1,
    };

    return { geometry, morphTargets }
  }, [])

  // Animation loop to smoothly interpolate morph target influences
  useFrame((state) => {
    if (!meshRef.current || !meshRef.current.morphTargetInfluences) return;

    const influences = meshRef.current.morphTargetInfluences;
    const { clock } = state;

    // Determine target influences based on agent status
    let targetThinking = 0;
    let targetSpeaking = 0;

    if (agentStatus === "thinking") {
        // Use a sine wave to create a pulsing effect
        targetThinking = (Math.sin(clock.getElapsedTime() * 2) + 1) / 2;
    } else if (agentStatus === "speaking") {
        // Use a sine wave for a more dynamic speaking animation
        targetSpeaking = (Math.sin(clock.getElapsedTime() * 10) + 1) / 2 * 0.8;
    }

    // Smoothly interpolate towards the target values (lerp)
    influences[morphTargets.thinking] = THREE.MathUtils.lerp(influences[morphTargets.thinking], targetThinking, 0.1);
    influences[morphTargets.speaking] = THREE.MathUtils.lerp(influences[morphTargets.speaking], targetSpeaking, 0.1);
  })

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <pointsMaterial
        color="#ffffff"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.7}
      />
    </mesh>
  )
}

export const ParticleFace = () => {
  return (
    <div className="w-full h-full bg-black rounded-lg">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <ParticleSphere />
      </Canvas>
    </div>
  )
}
