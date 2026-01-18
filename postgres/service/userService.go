package service

import (
	"fmt"
)

// Creates new User
func CreateUser(user *User) error {
	return db.Create(&user).Error
}

// Will Create if ID not included
func UpdateUser(id int, user *User) error {
	if id == user.ID {
		return db.Save(&user).Error
	}
	return fmt.Errorf("wrong update ID")
}

// Deletes User with double check for id match
func DeleteUser(id int, user *User) error {
	return db.Delete(user, id).Error
}

func GetFullUser(id int, user *User) error {
	return db.First(&user, id).Error
}

func GetAllUsers(users *[]User) error {
	return db.Find(&users).Error
}
