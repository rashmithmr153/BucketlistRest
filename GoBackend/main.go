package main

import (
	"database/sql"
	"log"
	"os"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type Place struct {
	ID        int    `json:"id"`
	Name      string `json:"place_name,omitempty"`
	Category  string `json:"category,omitempty"`
	Isvisited bool   `json:"is_visited"`
}

func main() {
	// Load .env with error checking
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}

	// Get database URL
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		log.Fatal("DATABASE_URL environment variable not set")
	}
	log.Println("DATABASE_URL loaded successfully")

	// Connect to database
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to open DB connection:", err)
	}
	defer db.Close()
	_, err = db.Exec(`
CREATE TABLE IF NOT EXISTS places (
	id SERIAL PRIMARY KEY,
	place_name TEXT,
	category TEXT,
	is_visited BOOLEAN DEFAULT FALSE
)
`)
	if err != nil {
		log.Fatal("Failed to create table:", err)
	}
	// Test database connection
	if err := db.Ping(); err != nil {
		log.Fatal("Database ping failed:", err)
	}
	log.Println("✅ Database connected successfully")

	// Initialize Gin
	req := gin.Default()
	req.Use(cors.Default())

	// Health check endpoint (no database required)
	req.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "message": "Server is running"})
	})

	// Get all places
	req.GET("/places", func(c *gin.Context) {
		rows, err := db.Query("SELECT id, place_name, category, is_visited FROM places")
		if err != nil {
			log.Println("Query error:", err)
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var places []Place
		for rows.Next() {
			var place Place
			err := rows.Scan(&place.ID, &place.Name, &place.Category, &place.Isvisited)
			if err != nil {
				log.Println("Scan error:", err)
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}
			places = append(places, place)
		}

		// Check for errors during iteration
		if err := rows.Err(); err != nil {
			log.Println("Rows error:", err)
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		c.JSON(200, places)
	})

	// Update place visited status
	req.PATCH("/places/:id", func(c *gin.Context) {
		idStr := c.Param("id")

		id, err := strconv.Atoi(idStr)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid ID"})
			return
		}

		query := `UPDATE places SET is_visited = NOT is_visited WHERE id = $1`

		result, err := db.Exec(query, id)
		if err != nil {
			log.Println("Update error:", err)
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		rowsAffected, _ := result.RowsAffected()
		if rowsAffected == 0 {
			c.JSON(404, gin.H{"error": "Place not found"})
			return
		}

		c.JSON(200, gin.H{"message": "Place updated successfully"})
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Starting server on port %s", port)
	log.Printf("📍 Health check: http://localhost:%s/health", port)
	log.Printf("📍 Get places: http://localhost:%s/places", port)

	if err := req.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
