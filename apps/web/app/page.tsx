"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { AuroraParticleSystem } from "@/components/landing/AuroraParticleSystem"

export default function Home() {
  const router = useRouter()

  const handleLogin = () => {
    // In a real app, we might have a dedicated login page or a modal.
    // For the MVP, we'll redirect directly to the backend's Google OAuth endpoint.
    // This endpoint will be handled by our Go `auth` service.
    router.push("/api/auth/login/google") // This will be proxied to the auth service
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <AuroraParticleSystem />
      <div className="container flex flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Your Business, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Unified.</span>
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Connect your tools. See your metrics. Command your growth. Instantly.
        </p>
        <Button size="lg" onClick={handleLogin}>
          Begin Onboarding
        </Button>
      </div>
    </main>
  )
}
