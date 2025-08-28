package main

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// --- Data Structures for widgetManifestV2 ---

type WidgetConfig struct {
	ID     string `json:"id"`
	Type   string `json:"type"`
	Grid   Grid   `json:"grid"`
	Config any    `json:"config,omitempty"`
}

type Grid struct {
	X int `json:"x"`
	Y int `json:"y"`
	W int `json:"w"`
	H int `json:"h"`
}

type DashboardManifest struct {
	Widgets []WidgetConfig `json:"widgets"`
}

// --- Main Application ---
func main() {
	app := fiber.New()
	app.Get("/health", func(c *fiber.Ctx) error { return c.JSON(fiber.Map{"status": "ok"}) })
	app.Get("/api/v1/dashboard/config", handleGetDashboardConfig)

	port := getEnv("PORT", "8002")
	log.Printf("Dashboard Generator service starting on port %s", port)
	if err := app.Listen(":" + port); err != nil { log.Fatalf("Failed to start server: %v", err) }
}

// --- API Handler ---
func handleGetDashboardConfig(c *fiber.Ctx) error {
	// In a real app, the user's entitlements would be derived from their JWT.
	// Here, we simulate it by reading a query param.
	servicesQuery := c.Query("services", "business_intelligence")
	requestedServices := strings.Split(servicesQuery, ",")

	manifest, err := generateDashboardManifest(requestedServices)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(manifest)
}

// --- Manifest Generation ---
func generateDashboardManifest(services []string) (*DashboardManifest, error) {
	manifest := &DashboardManifest{Widgets: []WidgetConfig{}}

	// Use a map for efficient lookup
	serviceSet := make(map[string]bool)
	for _, s := range services {
		serviceSet[s] = true
	}

	// Dynamically add widgets based on requested services
	if serviceSet["business_intelligence"] {
		signedURL, err := generateMetabaseEmbeddingURL()
		if err != nil { return nil, err }
		manifest.Widgets = append(manifest.Widgets, WidgetConfig{
			ID: "metabase-widget", Type: "Metabase", Grid: Grid{X: 0, Y: 0, W: 8, H: 4},
			Config: fiber.Map{"url": signedURL},
		})
	}
	if serviceSet["lead_generation"] {
		manifest.Widgets = append(manifest.Widgets, WidgetConfig{
			ID: "apollo-widget", Type: "ApolloLeadFinder", Grid: Grid{X: 8, Y: 0, W: 4, H: 4},
		})
	}
	if serviceSet["marketing_automation"] {
		manifest.Widgets = append(manifest.Widgets, WidgetConfig{
			ID: "hubspot-widget", Type: "HubSpotCampaignMonitor", Grid: Grid{X: 0, Y: 4, W: 12, H: 2},
		})
	}

	return manifest, nil
}

// --- Metabase Embedding Logic ---
func generateMetabaseEmbeddingURL() (string, error) {
	cfg := loadMetabaseConfig()
	claims := jwt.MapClaims{
		"resource": jwt.MapClaims{"dashboard": mustParseInt(cfg.DashboardID)},
		"params":   jwt.MapClaims{},
		"exp":      time.Now().Add(time.Minute * 10).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(cfg.EmbeddingSecret))
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s/embed/dashboard/%s#bordered=false&titled=false", cfg.SiteURL, signedToken), nil
}

// --- Config & Helpers ---
type MetabaseConfig struct {
	SiteURL        string
	EmbeddingSecret string
	DashboardID    string
}

func loadMetabaseConfig() MetabaseConfig {
	return MetabaseConfig{
		SiteURL:        getEnv("METABASE_SITE_URL", "http://localhost:3000"),
		EmbeddingSecret: getEnv("METABASE_EMBEDDING_SECRET", "my-super-secret-key-that-should-be-long-and-random"),
		DashboardID:    getEnv("METABASE_DASHBOARD_ID", "1"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok { return value }
	return fallback
}

func mustParseInt(s string) int {
	i, err := strconv.Atoi(s)
	if err != nil { panic(fmt.Sprintf("Failed to parse integer from string '%s': %v", s, err)) }
	return i
}
