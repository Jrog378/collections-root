package service

import (
	"fmt"
)

// Creates new Artist
func CreateArtist(artist *Artist) error {
	artist.FullName = artist.FirstName + " " + artist.LastName
	return db.Create(&artist).Error
}

// Will Create if ID not included
func UpdateArtist(id int, artist *Artist) error {
	if id == artist.ID {
		return db.Save(&artist).Error
	}
	return fmt.Errorf("wrong update ID")
}

// Deletes Artist with double check for id match
func DeleteArtist(id int, artist *Artist) error {
	return db.Delete(artist, id).Error
}

func GetFullArtist(id int, artwork *Artist) error {
	return db.First(&artwork, id).Error
}

func GetAllArtist(artists *[]Artist) error {
	return db.Find(&artists).Error
}
