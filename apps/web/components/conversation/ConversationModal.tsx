"use client"

import * as React from "react"
import { useConversationStore } from "@/lib/store"
import { Modal } from "@/components/ui/Modal"
import { Transcript } from "./Transcript"
import { ConversationControls } from "./ConversationControls"
import { ParticleFace } from "./ParticleFace"
import { useAudioPipeline } from "@/hooks/useAudioPipeline"

// This component is the main container for the entire voice conversation experience.
// It assembles the Face, Transcript, and Controls, and activates the audio pipeline.

export const ConversationModal = () => {
  const { isModalOpen, closeModal } = useConversationStore()
  const { error } = useAudioPipeline() // Activate the hook when the modal is potentially visible

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      className="w-full max-w-4xl h-[90vh] flex flex-col p-6"
    >
      {/* The WebGL Particle Face */}
      <div className="flex-1">
        <ParticleFace />
      </div>

      {/* Transcript & Controls */}
      <div className="mt-4">
        <Transcript />
        <ConversationControls />
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute bottom-4 left-4 bg-destructive text-destructive-foreground p-2 rounded-md text-xs">
          {error}
        </div>
      )}
    </Modal>
  )
}
