package handler

import (
	"encoding/json"
	"fmt"

	// "log"
	"net/http"
	"strconv"

	"example.com/service"
	"github.com/go-chi/chi"
	"gorm.io/gorm"
)

func decodeUser(r *http.Request) (service.User, error) {
	var user service.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		return service.User{}, fmt.Errorf("invalid JSON: %v", err)
	}
	return user, nil
}

// Encode encodes a User struct (or error) as a JSON response
func encodeUser(w http.ResponseWriter, status int, v interface{}) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		return fmt.Errorf("failed to encode response: %v", err)
	}
	return nil
}

func UserGet(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "*")
	strID, err := strconv.Atoi(userID)
	if err != nil {
		http.Error(w, "Invalid user ID: must be an integer", http.StatusBadRequest)
		return
	}
	user := service.User{}
	if err := service.GetFullUser(strID, &user); err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, fmt.Sprintf("Database error: %v", err), http.StatusInternalServerError)
		}
		return
	}

	// Return user as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(user); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func AllUsersGet(w http.ResponseWriter, _ *http.Request) {
	users := []service.User{}
	if err := service.GetAllUsers(&users); err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, fmt.Sprintf("Database error: %v", err), http.StatusInternalServerError)
		}
		return
	}

	// Return user as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(users); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func UserCreate(w http.ResponseWriter, r *http.Request) {
	// Decode request body
	user, err := decodeUser(r)
	if err != nil {
		encodeUser(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	// Create user in database
	if err := service.CreateUser(&user); err != nil {
		encodeUser(w, http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Database error: %v", err)})
		return
	}

	// Encode successful response
	if err := encodeUser(w, http.StatusCreated, user); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func UserUpdate(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "*")
	strID, err := strconv.Atoi(userID)
	if err != nil {
		http.Error(w, "Invalid user ID: must be an integer", http.StatusBadRequest)
		return
	}
	// Decode request body
	user, err := decodeUser(r)
	if err != nil {
		encodeUser(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	// Create user in database
	if err := service.UpdateUser(strID, &user); err != nil {
		encodeUser(w, http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Database error: %v", err)})
		return
	}

	// Encode successful response
	if err := encodeUser(w, http.StatusCreated, user); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func UserDelete(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "*")
	strID, err := strconv.Atoi(userID)
	if err != nil {
		http.Error(w, "Invalid user ID: must be an integer", http.StatusBadRequest)
		return
	}
	user := service.User{}
	if err := service.DeleteUser(strID, &user); err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, fmt.Sprintf("Database error: %v", err), http.StatusInternalServerError)
		}
		return
	}

	// Return user as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(user); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

