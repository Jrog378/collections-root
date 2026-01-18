package service

import (
	"fmt"
	"strings"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func (a *Artwork) BeforeCreate(tx *gorm.DB) (err error) {
	if strings.TrimSpace(a.Cataloged) == "" {
		a.Cataloged = fmt.Sprintf("%d", time.Now().Year())
	}

	var count int64
	if err := tx.Model(&Artwork{}).
		Where("catalog LIKE ?", fmt.Sprintf("ME-%s.%%", a.Cataloged)).
		Count(&count).Error; err != nil {
		return err
	}

	if strings.TrimSpace(a.Catalog) == "" {
		a.Catalog = fmt.Sprintf("ME-%s.%03d", a.Cataloged, count+1)
	}
	
	return nil
}

func CreateArtwork(artwork *Artwork) error {
	return db.Create(artwork).Error
}

func CreateChunkArtwork(artworks *[]Artwork) error {
	return db.Create(&artworks).Error
}
// Will Create if ID not included
func UpdateArtwork(id int, artwork *Artwork) error {
	result := db.Model(&Artwork{}).Where("id = ?", id).Updates(artwork)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return fmt.Errorf("no artwork with id %d", id)
	}
	return nil
}

// Deletes Artwork with double check for id match
func DeleteArtwork(id int, artwork *Artwork) error {
	return db.Delete(artwork, id).Error
}

func GetFullArtwork(id int, artwork *Artwork) error {
	return db.First(&artwork, id).Error
}

func GetAllArtwork(artworks *[]Artwork) error {
	return db.Preload(clause.Associations).Find(&artworks).Error
}
