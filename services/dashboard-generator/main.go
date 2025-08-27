package main

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// --- Configuration ---
type Config struct {
	Port                   string
	MetabaseSiteURL        string
	MetabaseEmbeddingSecret string
	MetabaseDashboardID    string
}

// --- Main Application ---
func main() {
	cfg := loadConfig()

	app := fiber.New()

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	// NOTE: In a real-world scenario, this endpoint would be authenticated.
	// It would validate the user's JWT from the auth service to get a user ID.
	// For this sprint, we are just returning a generic, signed URL.
	app.Get("/api/v1/dashboard/config", func(c *fiber.Ctx) error {
		// In a real app, you would pass the user's ID here for row-level security.
		// For now, we'll pass a placeholder.
		signedURL, err := generateMetabaseEmbeddingURL(cfg, "placeholder-user-id")
		if err != nil {
			log.Printf("Error generating Metabase URL: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to generate dashboard URL",
			})
		}

		return c.JSON(fiber.Map{
			"metabaseDashboardUrl": signedURL,
		})
	})

	log.Printf("Dashboard Generator service starting on port %s", cfg.Port)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// --- Metabase Embedding Logic ---
func generateMetabaseEmbeddingURL(cfg Config, userID string) (string, error) {
	// Create the JWT claims for Metabase embedding
	claims := jwt.MapClaims{
		"resource": jwt.MapClaims{
			"dashboard": mustParseInt(cfg.MetabaseDashboardID),
		},
		"params": jwt.MapClaims{
			// "user_id": userID, // Example of a locked parameter for row-level security
		},
		"exp": time.Now().Add(time.Minute * 10).Unix(), // Expiration time
	}

	// Create and sign the token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(cfg.MetabaseEmbeddingSecret))
	if err != nil {
		return "", err
	}

	// Construct the final URL
	url := fmt.Sprintf(
		"%s/embed/dashboard/%s#bordered=true&titled=true",
		cfg.MetabaseSiteURL,
		signedToken,
	)
	return url, nil
}


// --- Helpers ---
func loadConfig() Config {
	return Config{
		Port:                   getEnv("PORT", "8002"),
		MetabaseSiteURL:        getEnv("METABASE_SITE_URL", "http://localhost:3000"),
		MetabaseEmbeddingSecret: getEnv("METABASE_EMBEDDING_SECRET", "my-super-secret-key-that-should-be-long-and-random"),
		MetabaseDashboardID:    getEnv("METABASE_DASHBOARD_ID", "1"), // Default to dashboard ID 1
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

// Helper to parse string to int, panics on error.
// Should only be used with values that are known to be valid integers.
func mustParseInt(s string) int {
	i, err := strconv.Atoi(s)
	if err != nil {
		panic(fmt.Sprintf("Failed to parse integer from string '%s': %v", s, err))
	}
	return i
}
