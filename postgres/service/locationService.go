package service

import (
	"fmt"
)

// Creates new Location
func CreateLocation(repository *Repository) error {
	return db.Create(&repository).Error
}

// Will Create if ID not included
func UpdateLocation(id int, repository *Repository) error {
	if id == repository.ID {
		return db.Save(&repository).Error
	}
	return fmt.Errorf("wrong update ID")
}

// Deletes Location with double check for id match
func DeleteLocation(id int, repository *Repository) error {
	return db.Delete(repository, id).Error
}

func GetFullLocation(id int, repository *Repository) error {
	return db.First(&repository, id).Error
}

func GetAllLocation(repository *[]Repository) error {
	return db.Find(&repository).Error
}
