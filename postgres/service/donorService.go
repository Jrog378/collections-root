package service

import (
	"fmt"
)

// Creates new Donor
func CreateDonor(donor *Donor) error {
	donor.FullName = donor.FirstName + " " + donor.LastName
	return db.Create(&donor).Error
}

// Will Create if ID not included
func UpdateDonor(id int, donor *Donor) error {
	if id == donor.ID {
		return db.Save(&donor).Error
	}
	return fmt.Errorf("wrong update ID")
}

// Deletes Donor with double check for id match
func DeleteDonor(id int, donor *Donor) error {
	return db.Delete(donor, id).Error
}

func GetFullDonor(id int, donor *Donor) error {
	return db.First(&donor, id).Error
}

func GetAllDonor(donor *[]Donor) error {
	return db.Find(&donor).Error
}
