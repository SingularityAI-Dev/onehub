"use client"

import * as React from "react"

// Mock data simulating a response from the HubSpot API
const MOCK_CAMPAIGNS = [
  { id: "c1", name: "Q2 Product Launch", status: "Completed", performance: "120%" },
  { id: "c2", name: "Summer Sale", status: "Active", performance: "95%" },
  { id: "c3", name: "New Feature Webinar", status: "Planned", performance: "N/A" },
]

export const HubSpotCampaignMonitorWidget = () => {
  const [campaigns, setCampaigns] = React.useState<typeof MOCK_CAMPAIGNS>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // In a real app, this would call our gateway:
    // await fetch(`/api/v1/hubspot/campaigns`)
    // For now, we simulate a delay and return mock data.
    setTimeout(() => {
      setCampaigns(MOCK_CAMPAIGNS)
      setIsLoading(false)
    }, 1500)
  }, [])

  return (
    <div className="p-4 h-full flex flex-col">
      <h3 className="font-bold mb-2">HubSpot Campaign Monitor</h3>
      <div className="flex-1 bg-muted/50 rounded-lg p-2 overflow-y-auto">
        {isLoading ? (
          <p className="text-sm text-center text-muted-foreground mt-4">
            Loading campaigns...
          </p>
        ) : (
          <ul className="space-y-2">
            {campaigns.map((campaign) => (
              <li key={campaign.id} className="text-sm p-3 bg-background rounded-md flex justify-between items-center">
                <span>{campaign.name}</span>
                <span className="text-xs font-mono px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{campaign.status}</span>
                <span className="font-bold">{campaign.performance}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
