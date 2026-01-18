package service

import (
	"time"

	"gorm.io/gorm"
	// "gorm.io/gorm"
)

type Base struct { // size=88 (0x58)
	ID        int            `gorm:"primarykey" json:"id,omitempty"`
	CreatedAt time.Time      `json:"created_at,omitempty"`
	UpdatedAt time.Time      `json:"updated_at,omitempty"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

type User struct {
	Base      `json:"base,omitempty"`
	FirstName string `json:"first_name,omitempty"`
	LastName  string `json:"last_name,omitempty"`
	Role      string `json:"role,omitempty"`
}
type Artwork struct {
	Base         `json:"base,omitempty"`
	Catalog      string     `json:"catalog,omitempty"`
	Title        string     `json:"title,omitempty"`
	Medium       string     `json:"medium,omitempty"`
	ArtWidth     string     `json:"art_width,omitempty"`
	ArtHeight    string     `json:"art_height,omitempty"`
	ArtDepth     string     `json:"art_depth,omitempty"`
	Year         string     `json:"year,omitempty"`
	Cataloged    string     `json:"cataloged,omitempty"`
	Quantity     string     `json:"quantity,omitempty"`
	Url          string     `json:"url,omitempty"`
	ArtistId     *int       `json:"artist_id,omitempty"`
	DonorId      *int       `json:"donor_id,omitempty"`
	RepositoryId *int       `json:"repository_id,omitempty"`
	Artist       Artist     `gorm:"foreignKey:ArtistId;embeddedPrefix:a_" json:"artist,omitempty"`
	Donor        Donor      `gorm:"foreignKey:DonorId;embeddedPrefix:d_" json:"donor,omitempty"`
	Repository   Repository `gorm:"foreignKey:RepositoryId;embeddedPrefix:l_" json:"repository,omitempty"`
}
type Artist struct {
	Base      `json:"base,omitempty"`
	FirstName string `json:"first_name,omitempty"`
	LastName  string `json:"last_name,omitempty"`
	FullName  string `json:"full_name,omitempty"`
	BirthYear string `json:"birth_year,omitempty"`
	DeathYear string `json:"death_year,omitempty"`
	Bio       string `json:"bio,omitempty"`
}
type Donor struct {
	Base      `json:"base,omitempty"`
	FirstName string `json:"first_name,omitempty"`
	LastName  string `json:"last_name,omitempty"`
	FullName  string `json:"full_name,omitempty"`
	BirthYear string `json:"birth_year,omitempty"`
	DeathYear string `json:"death_year,omitempty"`
	Bio       string
}

type Repository struct {
	Base         `json:"base,omitempty"`
	BuildingName string `json:"building_name,omitempty"`
	RoomNumber   string `json:"room_number,omitempty"`
	Campus       string `json:"campus,omitempty"`
	Details      string `json:"details,omitempty"`
}
