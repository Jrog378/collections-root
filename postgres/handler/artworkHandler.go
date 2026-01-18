package handler

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"example.com/service"
	"github.com/go-chi/chi"
	"gorm.io/gorm"
)

func decodeArtwork(r *http.Request) (service.Artwork, error) {
	var artwork service.Artwork
	if err := json.NewDecoder(r.Body).Decode(&artwork); err != nil {
		return service.Artwork{}, fmt.Errorf("invalid JSON: %v", err)
	}
	return artwork, nil
}

// Encode encodes a Artwork struct (or error) as a JSON response
func encodeArtwork(w http.ResponseWriter, status int, v interface{}) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		return fmt.Errorf("failed to encode response: %v", err)
	}
	return nil
}

func ArtworkGet(w http.ResponseWriter, r *http.Request) {
	artID := chi.URLParam(r, "*")
	strID, err := strconv.Atoi(artID)
	if err != nil {
		http.Error(w, "Invalid art ID: must be an integer", http.StatusBadRequest)
		return
	}
	artwork := service.Artwork{}
	if err := service.GetFullArtwork(strID, &artwork); err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Artwork not found", http.StatusNotFound)
		} else {
			http.Error(w, fmt.Sprintf("Database error: %v", err), http.StatusInternalServerError)
		}
		return
	}

	// Return artwork as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(artwork); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func AllArtworkGet(w http.ResponseWriter, _ *http.Request) {
	artwork := []service.Artwork{}
	if err := service.GetAllArtwork(&artwork); err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Artwork not found", http.StatusNotFound)
		} else {
			http.Error(w, fmt.Sprintf("Database error: %v", err), http.StatusInternalServerError)
		}
		return
	}

	// Return artwork as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(artwork); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func ArtworkCreate(w http.ResponseWriter, r *http.Request) {
	// Decode request body
	artwork, err := decodeArtwork(r)
	if err != nil {
		encodeArtwork(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	// Create artwork in database
	if err := service.CreateArtwork(&artwork); err != nil {
		encodeArtwork(w, http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Database error: %v", err)})
		return
	}

	// Encode successful response
	if err := encodeArtwork(w, http.StatusCreated, artwork); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func ArtworkUpdate(w http.ResponseWriter, r *http.Request) {
	artID := chi.URLParam(r, "*")
	strID, err := strconv.Atoi(artID)
	if err != nil {
		http.Error(w, "Invalid art ID: must be an integer", http.StatusBadRequest)
		return
	}
	// Decode request body
	artwork, err := decodeArtwork(r)
	if err != nil {
		encodeArtwork(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	// Create artwork in database
	if err := service.UpdateArtwork(strID, &artwork); err != nil {
		encodeArtwork(w, http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Database error: %v", err)})
		return
	}

	// Encode successful response
	if err := encodeArtwork(w, http.StatusCreated, artwork); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func ArtworkDelete(w http.ResponseWriter, r *http.Request) {
	artID := chi.URLParam(r, "*")
	strID, err := strconv.Atoi(artID)
	if err != nil {
		http.Error(w, "Invalid art ID: must be an integer", http.StatusBadRequest)
		return
	}
	artwork := service.Artwork{}
	if err := service.DeleteArtwork(strID, &artwork); err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Artwork not found", http.StatusNotFound)
		} else {
			http.Error(w, fmt.Sprintf("Database error: %v", err), http.StatusInternalServerError)
		}
		return
	}

	// Return artwork as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(artwork); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func ArtworkChunkCreate(w http.ResponseWriter, r *http.Request) {
	// Parse multipart form
	err := r.ParseMultipartForm(10 << 20) // 10MB max
	if err != nil {
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}

	// Get the file from form data
	file, _, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "File required", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Parse CSV
	reader := csv.NewReader(file)
	_, err = reader.Read() // skip header
	if err != nil {
		http.Error(w, "Invalid CSV", http.StatusBadRequest)
		return
	}

	// var artworks []service.Artwork
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil || len(record) < 6 {
			continue
		}

		// id, _ := strconv.Atoi(record[0])

		artwork := service.Artwork{
			// Base:      service.Base{ID: id},
			// Catalog:   record[0],
			Title:     record[0],
			Medium:    record[1],
			ArtHeight: record[2],
			ArtWidth:  record[3],
			ArtDepth:  record[4],
			Year:      record[5],
			Cataloged: record[6],
			Quantity: record[7],
			// Url:       record[7],
		}

		// artworks = append(artworks, artwork)

		if err != nil {
			encodeArtwork(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
			return
		}

		// Create artwork in database
		if err := service.CreateArtwork(&artwork); err != nil {
			encodeArtwork(w, http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Database error: %v", err)})
			return
		}

		// Encode successful response
		if err := encodeArtwork(w, http.StatusCreated, artwork); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		}
	}
	// Save to DB
	// if err := service.CreateChunkArtwork(&artworks); err != nil {
	// 	http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
	// 	return
	// }

	// if err := encodeArtwork(w, http.StatusCreated, artworks); err != nil {
	// 	http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	// }
}
