package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// --- Data Structures ---
type CreateDashboardRequest struct {
	Name       string `json:"name"`
	TemplateID string `json:"templateId"`
}

type WidgetConfig struct {
	ID     string `json:"id"`
	Type   string `json:"type"`
	Grid   Grid   `json:"grid"`
	Config any    `json:"config,omitempty"`
}

type Grid struct { X, Y, W, H int }

type DashboardManifest struct {
	ID      string         `json:"id"`
	Name    string         `json:"name"`
	Widgets []WidgetConfig `json:"widgets"`
}

// --- Main Application ---
func main() {
	dbpool := connectDB()
	defer dbpool.Close()

	app := fiber.New()
	app.Get("/health", func(c *fiber.Ctx) error { return c.JSON(fiber.Map{"status": "ok"}) })

	// The new endpoint to create a dashboard
	app.Post("/api/v1/dashboards", func(c *fiber.Ctx) error {
		return handleCreateDashboard(c, dbpool)
	})

	port := getEnv("PORT", "8002")
	log.Printf("Dashboard Generator service starting on port %s", port)
	if err := app.Listen(":" + port); err != nil { log.Fatalf("Failed to start server: %v", err) }
}

// --- API Handler ---
func handleCreateDashboard(c *fiber.Ctx, db *pgxpool.Pool) error {
	// 1. Parse request
	req := new(CreateDashboardRequest)
	if err := c.BodyParser(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse request"})
	}

	// In a real app, User ID would come from JWT middleware
	userID := "a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1" // Placeholder

	// 2. Create dashboard record in DB
	var dashboardID, dashboardName string
	err := db.QueryRow(context.Background(),
		`INSERT INTO dashboards (user_id, name, template_id) VALUES ($1, $2, $3) RETURNING id, name`,
		userID, req.Name, req.TemplateID,
	).Scan(&dashboardID, &dashboardName)
	if err != nil {
		log.Printf("DB Error creating dashboard: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not create dashboard"})
	}

	// 3. For this sprint, we'll hardcode the creation of two widgets.
	// A real implementation would use the templateId to look up which widgets to create.

	// 3a. Create Metabase widget
	metabaseURL, err := generateMetabaseEmbeddingURL()
	if err != nil { return err }
	metabaseWidget := WidgetConfig{
		ID: "metabase-widget", Type: "Metabase", Grid: Grid{X: 0, Y: 0, W: 8, H: 4},
		Config: fiber.Map{"url": metabaseURL},
	}

	// 3b. Create HubSpot widget (by calling the adapter)
	// NOTE: The adapter call is currently fire-and-forget, as we use mock data on the frontend.
	// A real implementation would fetch data here and pass it to the widget config.
	go func() {
		hubspotAdapterURL := getEnv("HUBSPOT_ADAPTER_URL", "http://localhost:8004")
		http.Post(fmt.Sprintf("%s/adapter/hubspot/query", hubspotAdapterURL), "application/json", nil)
	}()
	hubspotWidget := WidgetConfig{
		ID: "hubspot-widget", Type: "HubSpotCampaignMonitor", Grid: Grid{X: 8, Y: 0, W: 4, H: 4},
	}

	// 4. Construct the final manifest
	manifest := DashboardManifest{
		ID:      dashboardID,
		Name:    dashboardName,
		Widgets: []WidgetConfig{metabaseWidget, hubspotWidget},
	}

	return c.JSON(manifest)
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
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func mustParseInt(s string) int {
	i, err := strconv.Atoi(s)
	if err != nil {
		panic(fmt.Sprintf("Failed to parse integer from string '%s': %v", s, err))
	}
	return i
}

func connectDB() *pgxpool.Pool {
	dbpool, err := pgxpool.New(context.Background(), getEnv("DATABASE_URL", "postgres://user:pass@host:port/db?sslmode=disable"))
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	return dbpool
}
