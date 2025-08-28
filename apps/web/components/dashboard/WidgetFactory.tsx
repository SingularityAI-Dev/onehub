"use client"

import * as React from "react"
import { MetabaseWidget } from "./MetabaseWidget"
import { ApolloLeadFinderWidget } from "./ApolloLeadFinderWidget"
import { HubSpotCampaignMonitorWidget } from "./HubSpotCampaignMonitorWidget"

// This component acts as a dynamic renderer for our widgets.
// It takes a widget configuration object and returns the corresponding React component.

// Define the shape of the widget config from the backend manifest
interface Widget {
  id: string;
  type: "Metabase" | "ApolloLeadFinder" | "HubSpotCampaignMonitor" | string; // Allow for future widget types
  config?: any;
}

export const WidgetFactory = ({ widget }: { widget: Widget }) => {
  switch (widget.type) {
    case "Metabase":
      return <MetabaseWidget url={widget.config?.url} />
    case "ApolloLeadFinder":
      return <ApolloLeadFinderWidget />
    case "HubSpotCampaignMonitor":
      return <HubSpotCampaignMonitorWidget />
    default:
      return (
        <div className="p-4">
          <p className="text-destructive">Error: Unknown widget type "{widget.type}"</p>
        </div>
      )
  }
}
