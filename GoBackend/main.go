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

// const (
// 	host     = "localhost"
// 	port     = 5432
// 	user     = "postgres"
// 	password = "rashmith123"
// 	dbname   = "testDB"
// )

type Place struct {
	ID        int    `json:"id"`
	Name      string `json:"place_name,omitempty"`
	Category  string `json:"category,omitempty"`
	Isvisited bool   `json:"is_visited"`
}

func main() {
	_ = godotenv.Load()
	req := gin.Default()
	req.Use(cors.Default())
	connStr := os.Getenv("DATABASE_URL")
	log.Println("DATABASE_URL from .env:", connStr)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to connect DB:", err)
	}
	if err2 := db.Ping(); err2 != nil {
		log.Fatalf("Database ping failed: %v", err2)
	} else {
		log.Println("Database connected successfully")
	}
	//for local
	// psqlcon := fmt.Sprintf("host=%s port=%d user=%s password=%s sslmode=disable", host, port, user, password)
	defer db.Close()
	// showAll := `SELECT * FROM places`

	req.GET("/places", func(c *gin.Context) {
		rows, err := db.Query("SELECT * FROM places")
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var places []Place
		for rows.Next() {
			var place Place
			err := rows.Scan(&place.ID, &place.Name, &place.Category, &place.Isvisited)
			if err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}
			places = append(places, place)
		}

		c.JSON(200, places)
	})
	req.PATCH("/places/:id", func(c *gin.Context) {
		idStr := c.Param("id")

		id, err1 := strconv.Atoi(idStr)
		if err1 != nil {
			c.JSON(400, gin.H{"error": "Invalid ID"})
			return
		}
		query := `
		UPDATE places
		SET is_visited = NOT is_visited
		WHERE id = $1
	`

		_, err := db.Exec(query, id)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		c.JSON(200, gin.H{"message": "updated"})
	})

	if err := req.Run(); err != nil {
		log.Fatalf("Failed to run server : %v", err)
	}

}
