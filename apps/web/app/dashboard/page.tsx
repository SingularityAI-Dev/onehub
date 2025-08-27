"use client"

import { Navigation } from "@/components/ui/Navigation"
import { Button } from "@/components/ui/Button"
import { useConversationStore } from "@/lib/store"
import { ConversationModal } from "@/components/conversation/ConversationModal"

export default function DashboardPage() {
  const { openModal } = useConversationStore()

  return (
    <>
      <ConversationModal />
      <div className="flex min-h-screen w-full flex-col">
        <Navigation />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
          </div>
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                Welcome to OneHub!
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                You're all set. Let's start your onboarding conversation.
              </p>
              <Button onClick={openModal}>Begin Onboarding</Button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
