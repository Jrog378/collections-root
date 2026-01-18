package main

import (
	"fmt"
	"net/http"

	"example.com/handler"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
)

func main() {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Heartbeat("/"))
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	})

	r.Use(c.Handler)
	r.Get("/healthcheck", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World!"))
	})

	r.Get("/api/user/*", handler.UserGet)
	r.Get("/api/users", handler.AllUsersGet)
	r.Post("/api/user", handler.UserCreate)
	r.Put("/api/user/*", handler.UserUpdate)
	r.Delete("/api/user/*", handler.UserDelete)

	r.Get("/api/artwork/*", handler.ArtworkGet)
	r.Get("/api/allartwork", handler.AllArtworkGet)
	r.Post("/api/artwork", handler.ArtworkCreate)
	r.Put("/api/artwork/*", handler.ArtworkUpdate)
	r.Delete("/api/artwork/*", handler.ArtworkDelete)

	r.Get("/api/artist/*", handler.AllArtistGet)
	r.Get("/api/allartist", handler.AllArtistGet)
	r.Post("/api/artist", handler.ArtistCreate)
	r.Put("/api/artist/*", handler.ArtistUpdate)
	r.Delete("/api/artist/*", handler.ArtistDelete)

	r.Get("/api/donor/*", handler.AllDonorGet)
	r.Get("/api/alldonor", handler.AllDonorGet)
	r.Post("/api/donor", handler.DonorCreate)
	r.Put("/api/donor/*", handler.DonorUpdate)
	r.Delete("/api/donor/*", handler.DonorDelete)

	r.Get("/api/location/*", handler.AllLocationGet)
	r.Get("/api/alllocation", handler.AllLocationGet)
	r.Post("/api/location", handler.LocationCreate)
	r.Put("/api/location/*", handler.LocationUpdate)
	r.Delete("/api/location/*", handler.LocationDelete)

	r.Post("/api/file-create", handler.ArtworkChunkCreate)

	fmt.Println("ListenAndServe Initialed on localhost:8080")
	http.ListenAndServe(":8080", r)
}
