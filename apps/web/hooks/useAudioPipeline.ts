"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useConversationStore, Message } from "@/lib/store"

// --- Web Speech API Typings ---
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
}
declare var SpeechRecognition: { new(): SpeechRecognition }
declare var webkitSpeechRecognition: { new(): SpeechRecognition }


export const useAudioPipeline = () => {
  const { agentStatus, setAgentStatus, addMessage, closeModal, isModalOpen } = useConversationStore()
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const router = useRouter()

  // --- Text-to-Speech (TTS) ---
  const playAudio = async (text: string, isFinal: boolean) => {
    setAgentStatus("thinking")

    // --- Fallback: Browser's built-in Speech Synthesis ---
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onstart = () => setAgentStatus("speaking")
      utterance.onend = () => {
        setAgentStatus("idle")
        // If the conversation is not over, start listening again.
        if (!isFinal && recognitionRef.current) {
          recognitionRef.current.start()
        }
      }
      window.speechSynthesis.speak(utterance)
    } else {
      setError("Sorry, your browser does not support text-to-speech.")
    }
  }

  // --- Backend API Call ---
  const sendToBackend = async (transcript: string) => {
    setAgentStatus("thinking")
    try {
      const response = await fetch("/api/v1/voice/converse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      })
      const data = await response.json()

      const auraMessage: Message = { id: crypto.randomUUID(), sender: "aura", text: data.response_text }
      addMessage(auraMessage)

      // Play the audio response
      await playAudio(data.response_text, data.is_final)

      // If the conversation is finished, close the modal and redirect
      if (data.is_final) {
        setTimeout(() => {
          closeModal()
          router.push("/dashboard")
        }, 2000) // Add a small delay so the user hears the final message
      }

    } catch (err) {
      setError("Failed to communicate with the voice service.")
      setAgentStatus("idle")
    }
  }

  // --- Speech-to-Text (STT) ---
  useEffect(() => {
    if (typeof window === "undefined" || !isModalOpen) return

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionAPI) {
      setError("Sorry, your browser does not support speech recognition.")
      return
    }

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognitionRef.current = recognition

    recognition.onstart = () => setAgentStatus("listening")
    recognition.onerror = (event: any) => setError(`Speech recognition error: ${event.error}`)

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript
      const userMessage: Message = { id: crypto.randomUUID(), sender: "user", text: transcript }
      addMessage(userMessage)
      await sendToBackend(transcript)
    }

    // Automatically start listening when the modal opens
    recognition.start()

    return () => {
      recognition.stop()
    }
  }, [isModalOpen])

  return { error }
}
