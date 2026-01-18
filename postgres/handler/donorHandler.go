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

func decodeDonor(r *http.Request) (service.Donor, error) {
	var donor service.Donor
	if err := json.NewDecoder(r.Body).Decode(&donor); err != nil {
		return service.Donor{}, fmt.Errorf("invalid JSON: %v", err)
	}
	return donor, nil
}

// Encode encodes a Donor struct (or error) as a JSON response
func encodeDonor(w http.ResponseWriter, status int, v interface{}) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		return fmt.Errorf("failed to encode response: %v", err)
	}
	return nil
}

func DonorGet(w http.ResponseWriter, r *http.Request) {
	artID := chi.URLParam(r, "*")
	strID, err := strconv.Atoi(artID)
	if err != nil {
		http.Error(w, "Invalid art ID: must be an integer", http.StatusBadRequest)
		return
	}
	donor := service.Donor{}
	if err := service.GetFullDonor(strID, &donor); err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Donor not found", http.StatusNotFound)
		} else {
			http.Error(w, fmt.Sprintf("Database error: %v", err), http.StatusInternalServerError)
		}
		return
	}

	// Return Donor as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(donor); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func AllDonorGet(w http.ResponseWriter, _ *http.Request) {
	donor := []service.Donor{}
	if err := service.GetAllDonor(&donor); err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Donor not found", http.StatusNotFound)
		} else {
			http.Error(w, fmt.Sprintf("Database error: %v", err), http.StatusInternalServerError)
		}
		return
	}

	// Return Donor as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(donor); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func DonorCreate(w http.ResponseWriter, r *http.Request) {
	// Decode request body
	donor, err := decodeDonor(r)
	if err != nil {
		encodeDonor(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	// Create Donor in database
	if err := service.CreateDonor(&donor); err != nil {
		encodeDonor(w, http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Database error: %v", err)})
		return
	}

	// Encode successful response
	if err := encodeDonor(w, http.StatusCreated, donor); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func DonorUpdate(w http.ResponseWriter, r *http.Request) {
	artID := chi.URLParam(r, "*")
	strID, err := strconv.Atoi(artID)
	if err != nil {
		http.Error(w, "Invalid art ID: must be an integer", http.StatusBadRequest)
		return
	}
	// Decode request body
	donor, err := decodeDonor(r)
	if err != nil {
		encodeDonor(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	// Create Donor in database
	if err := service.UpdateDonor(strID, &donor); err != nil {
		encodeDonor(w, http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Database error: %v", err)})
		return
	}

	// Encode successful response
	if err := encodeDonor(w, http.StatusCreated, donor); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func DonorDelete(w http.ResponseWriter, r *http.Request) {
	artID := chi.URLParam(r, "*")
	strID, err := strconv.Atoi(artID)
	if err != nil {
		http.Error(w, "Invalid art ID: must be an integer", http.StatusBadRequest)
		return
	}
	donor := service.Donor{}
	if err := service.DeleteDonor(strID, &donor); err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Donor not found", http.StatusNotFound)
		} else {
			http.Error(w, fmt.Sprintf("Database error: %v", err), http.StatusInternalServerError)
		}
		return
	}

	// Return Donor as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(donor); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}