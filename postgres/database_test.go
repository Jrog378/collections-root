package main

import (
	"encoding/csv"
	"os"
	"testing"

	"example.com/service"
	"gorm.io/gorm"
)

var db *gorm.DB

// --------------- USERS ------------------
func TestDatabaseConnection(t *testing.T) {
	db = service.InitDatabase()
	if db == nil {
		t.Fatal("Failed to initialize database connection")
	}

	// Test connection by pinging the database
	sqlDB, err := db.DB()
	if err != nil {
		t.Fatalf("Failed to get sql.DB: %v", err)
	}
	if err := sqlDB.Ping(); err != nil {
		t.Fatalf("Failed to ping database: %v", err)
	}
}

func TestAddSpreadsheet(t *testing.T) {
	f, err := os.Open("Database Outline - Main (5).csv")
	if err != nil {
		t.Fatalf("Failed to open CSV: %v", err)
	}
	defer f.Close()

	r := csv.NewReader(f)
	records, err := r.ReadAll()
	if err != nil {
		t.Fatalf("Failed to read CSV: %v", err)
	}

	for i, row := range records[1:] { // skip header
		artwork := service.Artwork{
			Title:     row[1],
			Medium:    row[2],
			ArtWidth:  row[3],
			ArtHeight: row[4],
			Url:       row[5],
			// Add the rest as needed
		}
		if err := service.CreateArtwork(&artwork); err != nil {
			t.Errorf("Row %d: failed to insert: %v", i+2, err)
		}
	}
}

func TestCreateUser(t *testing.T) {
	user := service.User{
		// Base:      Base{ID: 1},
		FirstName: "Justin",
		LastName:  "Rogers",
		Role:      "Admin",
	}
	err := service.CreateUser(&user)
	if err != nil {
		t.Error(err)
	}
}

func TestUpdateUser(t *testing.T) {
	user := service.User{
		Base:      service.Base{ID: 2},
		FirstName: "Justin",
		LastName:  "Rog",
		Role:      "Admin",
	}
	err := service.UpdateUser(user.ID, &user)
	if err != nil {
		t.Error(err)
	}
}

func TestDeleteUser(t *testing.T) {
	user := service.User{
		Base:      service.Base{ID: 9},
		FirstName: "Justin",
		LastName:  "Rogers",
		Role:      "Admin",
	}
	err := service.DeleteUser(user.ID, &user)
	if err != nil {
		t.Error(err)
	}
}

// --------------- USERS ------------------

// --------------- ARTWORK ------------------
func TestCreateArtwork(t *testing.T) {
	artwork := service.Artwork{
		// Base:      Base{ID: 1},
		Title:  "Artwork 1",
		Medium: "Paint",
	}
	err := service.CreateArtwork(&artwork)
	if err != nil {
		t.Error(err)
	}
}

func TestUpdateArtwork(t *testing.T) {
	artwork := service.Artwork{
		Base:   service.Base{ID: 5},
		Artist: service.Artist{Base: service.Base{ID: 2}, FirstName: "Justin", LastName: "Rogers"},
		Medium: "Watercolor",
	}
	err := service.UpdateArtwork(artwork.ID, &artwork)
	if err != nil {
		t.Error(err)
	}
}

func TestDeleteArtwork(t *testing.T) {
	artwork := service.Artwork{
		Base: service.Base{ID: 1},
	}
	err := service.DeleteArtwork(artwork.ID, &service.Artwork{})
	if err != nil {
		t.Error(err)
	}
}

// --------------- ARTWORK ------------------

// --------------- ARTIST ------------------
func TestCreateArtist(t *testing.T) {
	artist := service.Artist{
		// Base:      Base{ID: 1},
		FirstName: "Justin",
		LastName:  "Rogers",
	}
	err := service.CreateArtist(&artist)
	if err != nil {
		t.Error(err)
	}
}

func TestUpdateArtist(t *testing.T) {
	artist := service.Artist{
		Base:      service.Base{ID: 1},
		FirstName: "Jus",
		LastName:  "Rogers",
	}
	err := service.UpdateArtist(artist.ID, &artist)
	if err != nil {
		t.Error(err)
	}
}

func TestDeleteArtist(t *testing.T) {
	artist := service.Artist{
		Base: service.Base{ID: 1},
	}
	err := service.DeleteArtist(artist.ID, &service.Artist{})
	if err != nil {
		t.Error(err)
	}
}

// --------------- ARTIST ------------------

// --------------- DONOR ------------------
func TestCreateDonor(t *testing.T) {
	donor := service.Donor{
		// Base:      Base{ID: 1},
		FirstName: "Jus",
		LastName:  "Rogers",
	}
	err := service.CreateDonor(&donor)
	if err != nil {
		t.Error(err)
	}
}

func TestUpdateDonor(t *testing.T) {
	donor := service.Donor{
		Base:      service.Base{ID: 1},
		FirstName: "Justin",
		LastName:  "Rogers",
	}
	err := service.UpdateDonor(donor.ID, &donor)
	if err != nil {
		t.Error(err)
	}
}

func TestDeleteDonor(t *testing.T) {
	donor := service.Donor{
		Base: service.Base{ID: 1},
	}
	err := service.DeleteDonor(donor.ID, &service.Donor{})
	if err != nil {
		t.Error(err)
	}
}

// --------------- DONOR ------------------

// --------------- LOCATION ------------------
func TestCreateLocation(t *testing.T) {
	location := service.Repository{
		// Base:      Base{ID: 1},
		BuildingName: "Writing Center",
		Campus:       "Fairfax",
		Details:      "Installation",
	}
	err := service.CreateLocation(&location)
	if err != nil {
		t.Error(err)
	}
}

func TestUpdateLocation(t *testing.T) {
	location := service.Repository{
		Base:         service.Base{ID: 1},
		BuildingName: "JC",
		Details:      "Installation by hand",
	}
	err := service.UpdateLocation(location.ID, &location)
	if err != nil {
		t.Error(err)
	}
}

func TestDeleteLocation(t *testing.T) {
	location := service.Repository{
		Base: service.Base{ID: 1},
	}
	err := service.DeleteLocation(location.ID, &service.Repository{})
	if err != nil {
		t.Error(err)
	}
}

// --------------- LOCATION ------------------
