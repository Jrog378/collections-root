package service

import (
	// "gorm.io/driver/postgres"
	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
	_ "github.com/microsoft/go-mssqldb"
	"log"
	"fmt"
)

var db *gorm.DB = InitDatabase()
var server = "collection.database.windows.net"
var port = 1433
var user = "Exhibitions"
var password = "Mason378"
var database = "collection-server"

func InitDatabase() *gorm.DB {
	var db *gorm.DB

	dsn := fmt.Sprintf(
        "sqlserver://%s:%s@%s:%d?database=%s",
        user,
        password,
        server,
        port,
        database,
    )

	db, err := gorm.Open(sqlserver.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect")
	} else {
		log.Println("Connected to Azure SQL!")
	}

	// db.Migrator().DropTable(&Artwork{}, &Artist{}, &Donor{}, &Repository{}, &User{})
	err = db.AutoMigrate(&User{}, &Artwork{}, &Artist{}, &Donor{}, &Repository{})
	if err != nil {
		panic("failed to migrate")
	}
	return db
}

// var db *gorm.DB = InitDatabase()

// func InitDatabase() *gorm.DB {
// 	dsn := "host=localhost user=postgres password=PostgresQuads378 dbname=postgres port=5432 sslmode=disable"
// 	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
// 	if err != nil {
// 		panic("failed to connect")
// 	}
// 	err = db.AutoMigrate(&User{}, &Artwork{}, &Artist{}, &Donor{})
// 	if err != nil {
// 		panic("failed to migrate")
// 	}
// 	return db
// }