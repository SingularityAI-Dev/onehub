"use client"

import * as React from "react"
import RGL, { WidthProvider } from "react-grid-layout"
import { Navigation } from "@/components/ui/Navigation"
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
  widgets: WidgetConfig[];
}

export default function DashboardPage() {
  const [manifest, setManifest] = React.useState<DashboardManifest | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchDashboardConfig = async () => {
      try {
        setIsLoading(true)
        // For the demo, we'll request all available widgets
        const response = await fetch("/api/v1/dashboard/config?services=business_intelligence,lead_generation,marketing_automation")
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard configuration")
        }
        const data: DashboardManifest = await response.json()
        setManifest(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardConfig()
  }, [])

  // Convert our manifest's grid config to the format react-grid-layout expects
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
          <h1 className="text-lg font-semibold md:text-2xl mb-4">
            My Dynamic Dashboard
          </h1>
          {isLoading ? (
            <div className="w-full h-[500px] flex items-center justify-center bg-muted rounded-lg">
              <p>Generating your personalized dashboard...</p>
            </div>
          ) : (
            <ReactGridLayout
              className="layout"
              layout={layout}
              cols={12}
              rowHeight={100}
              isDraggable
              isResizable
            >
              {manifest?.widgets.map(widget => (
                <div key={widget.id} className="bg-card rounded-lg p-1 shadow-sm overflow-hidden">
                  <WidgetFactory widget={widget} />
                </div>
              ))}
            </ReactGridLayout>
          )}
        </main>
      </div>
    </>
  )
}
