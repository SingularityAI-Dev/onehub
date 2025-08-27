"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface MetabaseWidgetProps {
  url: string | null
}

export const MetabaseWidget = ({ url }: MetabaseWidgetProps) => {
  const [isLoading, setIsLoading] = React.useState(true)

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className="w-full h-full bg-muted rounded-lg relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground">Loading Dashboard...</p>
        </div>
      )}
      {url ? (
        <iframe
          src={url}
          className={cn(
            "w-full h-full rounded-lg border-0",
            isLoading && "opacity-0"
          )}
          onLoad={handleLoad}
          title="Metabase Dashboard"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-destructive">Dashboard URL not available.</p>
        </div>
      )}
    </div>
  )
}
