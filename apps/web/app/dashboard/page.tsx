import { Navigation } from "@/components/ui/Navigation"

// This is a placeholder page for the main user dashboard.
// It establishes the authenticated layout of the application.

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navigation />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
        </div>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Welcome to OneHub!
            </h3>
            <p className="text-sm text-muted-foreground">
              Your provisioned dashboard and widgets will appear here.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
