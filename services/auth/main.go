package main

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

// --- Configuration ---
type Config struct {
	Port                string
	DatabaseURL         string
	GoogleClientID      string
	GoogleClientSecret  string
	GoogleRedirectURL   string
	JWTSecret           string
	FrontendDashboardURL string
}

var googleOauthConfig *oauth2.Config

// --- Main Application ---
func main() {
	cfg := loadConfig()
	dbpool := connectDB(cfg)
	defer dbpool.Close()

	repo := NewUserRepository(dbpool)

	googleOauthConfig = &oauth2.Config{
		ClientID:     cfg.GoogleClientID,
		ClientSecret: cfg.GoogleClientSecret,
		RedirectURL:  cfg.GoogleRedirectURL,
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
		Endpoint:     google.Endpoint,
	}

	app := fiber.New()

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	app.Get("/api/auth/login/google", handleGoogleLogin)
	app.Get("/api/auth/callback/google", handleGoogleCallback(repo, cfg))

	log.Printf("Auth service starting on port %s", cfg.Port)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// --- Handlers ---
func handleGoogleLogin(c *fiber.Ctx) error {
	state := generateStateOauthCookie(c)
	url := googleOauthConfig.AuthCodeURL(state)
	return c.Redirect(url, http.StatusTemporaryRedirect)
}

func handleGoogleCallback(repo *UserRepository, cfg Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Verify state cookie
		if c.Query("state") != c.Cookies("oauthstate") {
			return c.Status(fiber.StatusUnauthorized).SendString("Invalid oauth state")
		}

		// Exchange code for token
		token, err := googleOauthConfig.Exchange(context.Background(), c.Query("code"))
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(fmt.Sprintf("Code exchange failed: %s", err.Error()))
		}

		// Get user info from Google
		response, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(fmt.Sprintf("Failed getting user info: %s", err.Error()))
		}
		defer response.Body.Close()

		contents, err := io.ReadAll(response.Body)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(fmt.Sprintf("Failed reading user info response: %s", err.Error()))
		}

		var userInfo struct {
			ID      string `json:"id"`
			Email   string `json:"email"`
			Name    string `json:"name"`
			Picture string `json:"picture"`
		}
		if err := json.Unmarshal(contents, &userInfo); err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Failed to unmarshal user info")
		}

		// Upsert user in the database
		user, err := repo.UpsertUser(context.Background(), userInfo.Email, userInfo.Name, userInfo.Picture, "google", userInfo.ID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(fmt.Sprintf("Failed to save user: %v", err))
		}

		// Generate JWT
		jwtToken, err := generateJWT(user.ID, cfg.JWTSecret)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Failed to generate JWT")
		}

		// Set JWT in a secure cookie
		c.Cookie(&fiber.Cookie{
			Name:     "onehub_jwt",
			Value:    jwtToken,
			Expires:  time.Now().Add(24 * time.Hour),
			HTTPOnly: true,
			Secure:   true, // Set to true in production
			SameSite: "Lax",
		})

		return c.Redirect(cfg.FrontendDashboardURL, http.StatusTemporaryRedirect)
	}
}

// --- Database ---
type User struct {
	ID         string
	Email      string
	Name       sql.NullString
	AvatarURL  sql.NullString
	Provider   string
	ProviderID string
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) UpsertUser(ctx context.Context, email, name, avatarURL, provider, providerID string) (*User, error) {
	query := `
		INSERT INTO users (email, name, avatar_url, provider, provider_id)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (provider, provider_id)
		DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name, avatar_url = EXCLUDED.avatar_url, updated_at = NOW()
		RETURNING id, email, name, avatar_url, provider, provider_id, created_at, updated_at
	`
	var user User
	err := r.db.QueryRow(ctx, query, email, name, avatarURL, provider, providerID).Scan(
		&user.ID, &user.Email, &user.Name, &user.AvatarURL, &user.Provider, &user.ProviderID, &user.CreatedAt, &user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// --- Helpers ---
func loadConfig() Config {
	return Config{
		Port:                getEnv("PORT", "8080"),
		DatabaseURL:         getEnv("DATABASE_URL", "postgres://user:pass@host:port/db?sslmode=disable"),
		GoogleClientID:      getEnv("GOOGLE_CLIENT_ID", ""),
		GoogleClientSecret:  getEnv("GOOGLE_CLIENT_SECRET", ""),
		GoogleRedirectURL:   getEnv("GOOGLE_REDIRECT_URL", "http://localhost:8080/api/auth/callback/google"),
		JWTSecret:           getEnv("JWT_SECRET", "a-very-secret-key-that-should-be-long-and-random"),
		FrontendDashboardURL: getEnv("FRONTEND_URL", "http://localhost:3000") + "/dashboard",
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func connectDB(cfg Config) *pgxpool.Pool {
	log.Println("Connecting to database...")
	dbpool, err := pgxpool.New(context.Background(), cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	log.Println("Database connection successful.")
	return dbpool
}

func generateStateOauthCookie(c *fiber.Ctx) string {
	b := make([]byte, 16)
	rand.Read(b)
	state := base64.URLEncoding.EncodeToString(b)
	c.Cookie(&fiber.Cookie{
		Name:     "oauthstate",
		Value:    state,
		Expires:  time.Now().Add(10 * time.Minute),
		HTTPOnly: true,
	})
	return state
}

func generateJWT(userID string, secret string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
		"iat":     time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}
