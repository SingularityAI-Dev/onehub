"use client"

import { useEffect, useRef, useState } from "react"
import { useConversationStore, Message } from "@/lib/store"

// --- Web Speech API Typings ---
// The Web Speech API is not yet fully standardized, so we need to add some types manually.
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
  const { agentStatus, setAgentStatus, addMessage, openModal, isModalOpen } = useConversationStore()
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // --- Text-to-Speech (TTS) ---
  const playAudio = async (text: string) => {
    setAgentStatus("thinking") // Thinking while we fetch the audio

    // --- ElevenLabs API Call (Placeholder) ---
    // In a real app, you would fetch the audio from ElevenLabs here.
    // const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
    // if (ELEVENLABS_API_KEY) {
    //   try {
    //     const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/...`, {
    //       method: 'POST',
    //       headers: { 'xi-api-key': ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: { ... } })
    //     });
    //     const audioBlob = await response.blob();
    //     const audioUrl = URL.createObjectURL(audioBlob);
    //     const audio = new Audio(audioUrl);
    //     // Here you would use the Web Audio API to play the audio
    //     // ...
    //     return;
    //   } catch (err) {
    //     console.error("Error fetching from ElevenLabs, falling back to browser TTS.", err);
    //   }
    // }

    // --- Fallback: Browser's built-in Speech Synthesis ---
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onstart = () => setAgentStatus("speaking")
      utterance.onend = () => {
        setAgentStatus("idle")
        // After speaking, automatically start listening again for a natural conversation flow
        if (recognitionRef.current) {
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

      await playAudio(data.response_text)

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
  }, [isModalOpen]) // Re-run effect when modal opens/closes

  return { error }
}
