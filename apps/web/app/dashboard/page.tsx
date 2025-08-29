"use client"

import * as React from "react"
import RGL, { WidthProvider } from "react-grid-layout"
import { Navigation } from "@/components/ui/Navigation"
import { Button } from "@/components/ui/Button"
import { ConversationModal } from "@/components/conversation/ConversationModal"
import { WidgetFactory } from "@/components/dashboard/WidgetFactory"

const ReactGridLayout = WidthProvider(RGL)

// Define the structure of the manifest we expect from the backend
interface WidgetConfig {
  id: string;
  type: string;
  grid: { x: number; y: number; w: number; h: number };
  config?: any;
}

interface DashboardManifest {
  id: string;
  name: string;
  widgets: WidgetConfig[];
}

export default function DashboardPage() {
  const [manifest, setManifest] = React.useState<DashboardManifest | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleCreateDashboard = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/v1/dashboards", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: "My New Dashboard", templateId: "default" })
      })
      if (!response.ok) {
        throw new Error("Failed to create dashboard")
      }
      const data: DashboardManifest = await response.json()
      setManifest(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const layout = manifest?.widgets.map(w => ({
    i: w.id,
    ...w.grid,
  })) || []

  return (
    <>
      <ConversationModal />
      <div className="flex min-h-screen w-full flex-col">
        <Navigation />
        <main className="flex-1 p-4 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold md:text-2xl">
              {manifest ? manifest.name : "Dashboard"}
            </h1>
          </div>

          {isLoading ? (
            <div className="w-full h-[500px] flex items-center justify-center bg-muted rounded-lg">
              <p>Loading...</p>
            </div>
          ) : manifest ? (
            <ReactGridLayout
              className="layout"
              layout={layout}
              cols={12}
              rowHeight={100}
              isDraggable
              isResizable
            >
              {manifest.widgets.map(widget => (
                <div key={widget.id} className="bg-card rounded-lg p-1 shadow-sm overflow-hidden">
                  <WidgetFactory widget={widget} />
                </div>
              ))}
            </ReactGridLayout>
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
              <div className="flex flex-col items-center gap-2 text-center">
                <h3 className="text-2xl font-bold tracking-tight">No Dashboard Found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get started by creating your first dashboard.
                </p>
                <Button onClick={handleCreateDashboard}>Create New Dashboard</Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
