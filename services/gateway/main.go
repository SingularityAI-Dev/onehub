package main

import (
	"log"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/proxy"
)

// --- Configuration ---
type Config struct {
	Port                   string
	AuthServiceURL         string
	VoiceServiceURL        string
	DashboardGeneratorURL string
	NLUServiceURL          string
	HubSpotAdapterURL      string
}

// --- Main Application ---
func main() {
	cfg := loadConfig()

	app := fiber.New()

	// Health check endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	// --- Reverse Proxy Routing ---
	app.Use(func(c *fiber.Ctx) error {
		path := c.Path()

		// Route to Auth Service
		if strings.HasPrefix(path, "/api/auth") {
			log.Printf("Proxying request to Auth Service: %s", path)
			return proxy.Forward(cfg.AuthServiceURL)(c)
		}

		// Route to Voice Service
		if strings.HasPrefix(path, "/api/v1/voice") {
			log.Printf("Proxying request to Voice Service: %s", path)
			return proxy.Forward(cfg.VoiceServiceURL)(c)
		}

		// Route to Dashboard Generator Service
		if strings.HasPrefix(path, "/api/v1/dashboard") {
			log.Printf("Proxying request to Dashboard Generator Service: %s", path)
			return proxy.Forward(cfg.DashboardGeneratorURL)(c)
		}

		// Route to NLU Service
		if strings.HasPrefix(path, "/nlu/parse") {
			log.Printf("Proxying request to NLU Service: %s", path)
			return proxy.Forward(cfg.NLUServiceURL)(c)
		}

		// Route to HubSpot Adapter
		if strings.HasPrefix(path, "/adapter/hubspot") {
			log.Printf("Proxying request to HubSpot Adapter: %s", path)
			return proxy.Forward(cfg.HubSpotAdapterURL)(c)
		}

		log.Printf("No route matched for path: %s", path)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Not Found",
		})
	})

	log.Printf("API Gateway starting on port %s", cfg.Port)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// --- Helpers ---
func loadConfig() Config {
	return Config{
		Port:                   getEnv("PORT", "8000"),
		AuthServiceURL:         getEnv("AUTH_SERVICE_URL", "http://localhost:8080"),         // Default for local dev
		VoiceServiceURL:        getEnv("VOICE_SERVICE_URL", "http://localhost:8001"),        // Default for local dev
		DashboardGeneratorURL: getEnv("DASHBOARD_GENERATOR_URL", "http://localhost:8002"), // Default for local dev
		NLUServiceURL:          getEnv("NLU_SERVICE_URL", "http://localhost:8003"),          // Default for local dev
		HubSpotAdapterURL:      getEnv("HUBSPOT_ADAPTER_URL", "http://localhost:8004"),      // Default for local dev
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
