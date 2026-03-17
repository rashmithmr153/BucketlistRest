package main

import (
	"database/sql"
	"fmt"
	"log"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "rashmith123"
	dbname   = "testDB"
)

type Place struct {
	ID        int    `json:"id"`
	Name      string `json:"place_name,omitempty"`
	Category  string `json:"category,omitempty"`
	Isvisited bool   `json:"is_visited"`
}

func main() {
	r := gin.Default()
	r.Use(cors.Default())
	psqlcon := fmt.Sprintf("host=%s port=%d user=%s password=%s sslmode=disable", host, port, user, password)
	db, err := sql.Open("postgres", psqlcon)
	if err != nil {
		log.Fatal("Failed to open db:", err)
	}
	defer db.Close()
	// showAll := `SELECT * FROM places`

	r.GET("/places", func(c *gin.Context) {
		rows, err := db.Query("SELECT * FROM places")
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var places []Place
		for rows.Next() {
			var place Place
			rows.Scan(&place.ID, &place.Name, &place.Category, &place.Isvisited)
			places = append(places, place)
		}

		c.JSON(200, places)
	})
	r.PATCH("/places/:id", func(c *gin.Context) {
		idStr := c.Param("id")

		id, err1 := strconv.Atoi(idStr)
		if err1 != nil {
			c.JSON(400, gin.H{"error": "Invalid ID"})
			return
		}
		query := `
		UPDATE places
		SET isvisited = NOT isvisited
		WHERE id = $1
	`

		_, err := db.Exec(query, id)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		c.JSON(200, gin.H{"message": "updated"})
	})

	if err := r.Run(); err != nil {
		log.Fatalf("Failed to run server : %v", err)
	}

}
