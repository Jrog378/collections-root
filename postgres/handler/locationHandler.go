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

func decodeLocation(r *http.Request) (service.Repository, error) {
	var repository service.Repository
	if err := json.NewDecoder(r.Body).Decode(&repository); err != nil {
		return service.Repository{}, fmt.Errorf("invalid JSON: %v", err)
	}
	return repository, nil
}

// Encode encodes a Location struct (or error) as a JSON response
func encodeLocation(w http.ResponseWriter, status int, v interface{}) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		return fmt.Errorf("failed to encode response: %v", err)
	}
	return nil
}

func LocationGet(w http.ResponseWriter, r *http.Request) {
	artID := chi.URLParam(r, "*")
	strID, err := strconv.Atoi(artID)
	if err != nil {
		http.Error(w, "Invalid art ID: must be an integer", http.StatusBadRequest)
		return
	}

	repository := service.Repository{}
	if err := service.GetFullLocation(strID, &repository); err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Location not found", http.StatusNotFound)
		} else {
			http.Error(w, fmt.Sprintf("Database error: %v", err), http.StatusInternalServerError)
		}
		return
	}

	// Return Location as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(repository); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func AllLocationGet(w http.ResponseWriter, _ *http.Request) {
	repository := []service.Repository{}
	if err := service.GetAllLocation(&repository); err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Location not found", http.StatusNotFound)
		} else {
			http.Error(w, fmt.Sprintf("Database error: %v", err), http.StatusInternalServerError)
		}
		return
	}

	// Return Location as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(repository); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func LocationCreate(w http.ResponseWriter, r *http.Request) {
	// Decode request body
	repository, err := decodeLocation(r)
	if err != nil {
		encodeLocation(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	// Create Location in database
	if err := service.CreateLocation(&repository); err != nil {
		encodeLocation(w, http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Database error: %v", err)})
		return
	}

	// Encode successful response
	if err := encodeLocation(w, http.StatusCreated, repository); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func LocationUpdate(w http.ResponseWriter, r *http.Request) {
	artID := chi.URLParam(r, "*")
	strID, err := strconv.Atoi(artID)
	if err != nil {
		http.Error(w, "Invalid art ID: must be an integer", http.StatusBadRequest)
		return
	}
	// Decode request body
	repository, err := decodeLocation(r)
	if err != nil {
		encodeLocation(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	// Create Location in database
	if err := service.UpdateLocation(strID, &repository); err != nil {
		encodeLocation(w, http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Database error: %v", err)})
		return
	}

	// Encode successful response
	if err := encodeLocation(w, http.StatusCreated, repository); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func LocationDelete(w http.ResponseWriter, r *http.Request) {
	artID := chi.URLParam(r, "*")
	strID, err := strconv.Atoi(artID)
	if err != nil {
		http.Error(w, "Invalid art ID: must be an integer", http.StatusBadRequest)
		return
	}
	repository := service.Repository{}
	if err := service.DeleteLocation(strID, &repository); err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Location not found", http.StatusNotFound)
		} else {
			http.Error(w, fmt.Sprintf("Database error: %v", err), http.StatusInternalServerError)
		}
		return
	}

	// Return Location as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(repository); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}