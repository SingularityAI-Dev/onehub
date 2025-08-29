package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
)

// --- Main Application ---
func main() {
	app := fiber.New()

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	// This is the main endpoint for the adapter.
	// It's a POST endpoint because it would receive a complex query object.
	app.Post("/adapter/hubspot/query", handleHubSpotQuery)

	port := getEnv("PORT", "8004") // Assigning a new default port
	log.Printf("HubSpot Adapter service starting on port %s", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// --- API Handler ---
func handleHubSpotQuery(c *fiber.Ctx) error {
	// In a real implementation, this handler would:
	// 1. Parse the query from the request body.
	// 2. Authenticate with the HubSpot API using stored credentials.
	// 3. Make the actual API call to HubSpot.
	// 4. Transform the response into a standardized format.
	// 5. Handle errors, rate limiting, and caching.

	// For this sprint, we just return a mock response.
	log.Println("Received query for HubSpot Adapter. Returning mock data.")

	mockResponse := fiber.Map{
		"data": []fiber.Map{
			{"id": "c1", "name": "Q2 Product Launch", "status": "Completed", "performance": "120%"},
			{"id": "c2", "name": "Summer Sale", "status": "Active", "performance": "95%"},
			{"id": "c3", "name": "New Feature Webinar", "status": "Planned", "performance": "N/A"},
		},
		"source": "hubspot_mock",
	}

	return c.JSON(mockResponse)
}

// --- Helpers ---
func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
