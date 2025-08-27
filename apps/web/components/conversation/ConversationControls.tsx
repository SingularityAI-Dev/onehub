"use client"

import * as React from "react"
import { useConversationStore } from "@/lib/store"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

// This component provides the user controls for the conversation,
// including the status indicator and a fallback text input.

const StatusIndicator = () => {
  const { agentStatus } = useConversationStore()

  const statusConfig = {
    idle: { text: "Idle", color: "bg-gray-500" },
    listening: { text: "Listening...", color: "bg-blue-500 animate-pulse" },
    thinking: { text: "Thinking...", color: "bg-yellow-500 animate-pulse" },
    speaking: { text: "Speaking...", color: "bg-green-500" },
  }

  const currentStatus = statusConfig[agentStatus]

  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-3 h-3 rounded-full", currentStatus.color)} />
      <span className="text-sm text-muted-foreground">{currentStatus.text}</span>
    </div>
  )
}

export const ConversationControls = () => {
  const [text, setText] = React.useState("")
  const { addMessage } = useConversationStore()

  const handleSend = () => {
    if (!text.trim()) return
    addMessage({ id: crypto.randomUUID(), sender: "user", text })
    // In a real implementation, this would also trigger the call to the backend API.
    setText("")
  }

  return (
    <div className="w-full mt-4 space-y-4">
      <StatusIndicator />
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message here..."
          className="flex-1 px-4 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
       <p className="text-xs text-center text-muted-foreground">
        Or, just start speaking when the status is 'Listening'.
      </p>
    </div>
  )
}
