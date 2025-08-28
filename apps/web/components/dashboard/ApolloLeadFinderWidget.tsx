"use client"

import * as React from "react"
import { Button } from "@/components/ui/Button"

export const ApolloLeadFinderWidget = () => {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSearch = async () => {
    if (!query) return
    setIsLoading(true)
    // In a real app, this would call our gateway:
    // await fetch(`/api/v1/apollo/search?q=${query}`)
    // For now, we simulate a delay and return mock data.
    setTimeout(() => {
      setResults([
        `Lead for "${query}" 1`,
        `Lead for "${query}" 2`,
        `Lead for "${query}" 3`,
      ])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <h3 className="font-bold mb-2">Apollo Lead Finder</h3>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., 'CTOs in San Francisco'"
          className="flex-1 px-4 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>
      <div className="flex-1 bg-muted/50 rounded-lg p-2 overflow-y-auto">
        {results.length > 0 ? (
          <ul className="space-y-1">
            {results.map((r) => (
              <li key={r} className="text-sm p-2 bg-background rounded-md">{r}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-center text-muted-foreground mt-4">
            No leads found.
          </p>
        )}
      </div>
    </div>
  )
}
