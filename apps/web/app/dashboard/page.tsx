"use client"

import * as React from "react"
import RGL, { WidthProvider } from "react-grid-layout"
import { Navigation } from "@/components/ui/Navigation"
import { MetabaseWidget } from "@/components/dashboard/MetabaseWidget"
import { ConversationModal } from "@/components/conversation/ConversationModal"

const ReactGridLayout = WidthProvider(RGL)

export default function DashboardPage() {
  const [metabaseUrl, setMetabaseUrl] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchDashboardConfig = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/v1/dashboard/config")
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard configuration")
        }
        const data = await response.json()
        setMetabaseUrl(data.metabaseDashboardUrl)
      } catch (error) {
        console.error(error)
        // Handle error state in UI if necessary
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardConfig()
  }, [])


  const layout = [
    { i: "metabase-widget", x: 0, y: 0, w: 12, h: 5 },
  ]

  return (
    <>
      <ConversationModal />
      <div className="flex min-h-screen w-full flex-col">
        <Navigation />
        <main className="flex-1 p-4 md:p-8">
          <h1 className="text-lg font-semibold md:text-2xl mb-4">
            My Platform Analytics
          </h1>
          {isLoading ? (
            <div className="w-full h-[500px] flex items-center justify-center bg-muted rounded-lg">
              <p>Loading Dashboard...</p>
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
              <div key="metabase-widget" className="bg-card rounded-lg p-1 shadow-sm">
                <MetabaseWidget url={metabaseUrl} />
              </div>
            </ReactGridLayout>
          )}
        </main>
      </div>
    </>
  )
}
