package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"example.com/service"
	"github.com/go-chi/chi"
	"gorm.io/gorm"
)

func decodeArtist(r *http.Request) (service.Artist, error) {
	var artist service.Artist
	if err := json.NewDecoder(r.Body).Decode(&artist); err != nil {
		return service.Artist{}, fmt.Errorf("invalid JSON: %v", err)
	}
	return artist, nil
}

// Encode encodes a Artist struct (or error) as a JSON response
func encodeArtist(w http.ResponseWriter, status int, v interface{}) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		return fmt.Errorf("failed to encode response: %v", err)
	}
	return nil
}

func ArtistGet(w http.ResponseWriter, r *http.Request) {
	artID := chi.URLParam(r, "*")
	strID, err := strconv.Atoi(artID)
	if err != nil {
		http.Error(w, "Invalid art ID: must be an integer", http.StatusBadRequest)
		return
	}
	artist := service.Artist{}
	if err := service.GetFullArtist(strID, &artist); err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Artist not found", http.StatusNotFound)
		} else {
			http.Error(w, fmt.Sprintf("Database error: %v", err), http.StatusInternalServerError)
		}
		return
	}

	// Return artist as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(artist); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func AllArtistGet(w http.ResponseWriter, _ *http.Request) {
	artist := []service.Artist{}
	if err := service.GetAllArtist(&artist); err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Artist not found", http.StatusNotFound)
		} else {
			http.Error(w, fmt.Sprintf("Database error: %v", err), http.StatusInternalServerError)
		}
		return
	}

	// Return artist as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(artist); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func ArtistCreate(w http.ResponseWriter, r *http.Request) {
	// Decode request body
	artist, err := decodeArtist(r)
	if err != nil {
		encodeArtist(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	// Create artist in database
	if err := service.CreateArtist(&artist); err != nil {
		encodeArtist(w, http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Database error: %v", err)})
		return
	}

	// Encode successful response
	if err := encodeArtist(w, http.StatusCreated, artist); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func ArtistUpdate(w http.ResponseWriter, r *http.Request) {
	artID := chi.URLParam(r, "*")
	strID, err := strconv.Atoi(artID)
	if err != nil {
		http.Error(w, "Invalid art ID: must be an integer", http.StatusBadRequest)
		return
	}
	// Decode request body
	artist, err := decodeArtist(r)
	if err != nil {
		encodeArtist(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	// Create artist in database
	if err := service.UpdateArtist(strID, &artist); err != nil {
		encodeArtist(w, http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Database error: %v", err)})
		return
	}

	// Encode successful response
	if err := encodeArtist(w, http.StatusCreated, artist); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func ArtistDelete(w http.ResponseWriter, r *http.Request) {
	artID := chi.URLParam(r, "*")
	strID, err := strconv.Atoi(artID)
	if err != nil {
		http.Error(w, "Invalid art ID: must be an integer", http.StatusBadRequest)
		return
	}
	artist := service.Artist{}
	if err := service.DeleteArtist(strID, &artist); err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Artist not found", http.StatusNotFound)
		} else {
			http.Error(w, fmt.Sprintf("Database error: %v", err), http.StatusInternalServerError)
		}
		return
	}

	// Return artist as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(artist); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}