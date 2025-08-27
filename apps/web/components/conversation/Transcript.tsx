"use client"

import * as React from "react"
import { useConversationStore } from "@/lib/store"
import { cn } from "@/lib/utils"

// This component renders the history of the conversation.

export const Transcript = () => {
  const { transcript } = useConversationStore()

  return (
    <div className="w-full h-48 p-4 overflow-y-auto bg-muted/50 rounded-lg">
      <ul className="space-y-4">
        {transcript.map((message) => (
          <li
            key={message.id}
            className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg",
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
