





DROP TABLE IF EXISTS Locate;
DROP TABLE IF EXISTS BusinessHours;
DROP TABLE IF EXISTS Likes;
DROP TABLE IF EXISTS Writes;
DROP TABLE IF EXISTS Contain;
DROP TABLE IF EXISTS OfferFood;
DROP TABLE IF EXISTS Location;
DROP TABLE IF EXISTS Restaurant;
DROP TABLE IF EXISTS Schedule;
DROP TABLE IF EXISTS Reviewer;
DROP TABLE IF EXISTS Review;
DROP TABLE IF EXISTS User;




-- entities
CREATE TABLE Location (
	LocationID int Primary Key,
	Address VARCHAR(255),
	Street VARCHAR(255),
	City VARCHAR(255),
	State VARCHAR(30),
	Zipcode int
);

CREATE TABLE Schedule(
	ScheduleID int Primary key,
    DayOfWeek VARCHAR(10),
    OpenTime time,
    OpeningDuration int
);


CREATE TABLE Restaurant (
	RestaurantID int Primary key,
	Name VARCHAR(255),
	PhoneNumber int,
	AveragePrice real,
	AverageRating real,
	Cuisine VARCHAR(255),
    Delivery bool,
    Dine_In bool
);

CREATE TABLE User (
	UserID INT Primary key,
	UserName VARCHAR(40) NOT NULL,
	Password VARCHAR(30) NOT NULL,
	Email VARCHAR(50)
);


CREATE TABLE Reviewer (
	ReviewerID int primary key,
	Name VARCHAR(255)
);

CREATE TABLE Review (
	ReviewID int,
	Rating int NOT NULL,
  Comment text,
  ReviewDate timestamp,
	PRIMARY KEY (ReviewID)
);


-- Weak entities  
CREATE TABLE OfferFood (
	FoodID int NOT NULL,
	FoodName VARCHAR(255) NOT NULL,
	RestaurantId int NOT NULL,
	Price real,
	PRIMARY KEY (FoodID, RestaurantId),
	FOREIGN KEY (RestaurantId) REFERENCES Restaurant(RestaurantId) ON DELETE CASCADE ON UPDATE CASCADE
);



-- relationships
CREATE TABLE Locate (
		RestaurantID int,
    LocationID int,
    PRIMARY KEY (RestaurantID),
    FOREIGN KEY (RestaurantID) REFERENCES Restaurant(RestaurantID),
    FOREIGN KEY (LocationID) REFERENCES Location(LocationID)
);

CREATE TABLE BusinessHours(
	RestaurantID int NOT NULL,
    ScheduleID int,
    PRIMARY KEY (RestaurantID, ScheduleID),
    FOREIGN KEY (RestaurantID) REFERENCES Restaurant(RestaurantID),
    FOREIGN KEY (ScheduleID) REFERENCES Schedule(ScheduleID)
);

CREATE TABLE Likes(
	UserID int,
    RestaurantID int,
    LikeTime date,
    Notes text,
    PRIMARY KEY (UserID, RestaurantID),
    FOREIGN KEY (RestaurantID) REFERENCES Restaurant(RestaurantID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)

);

CREATE TABLE Writes(
	ReviewerID int NOT NULL,
    ReviewID int,
    PRIMARY KEY(ReviewID),
    FOREIGN KEY (ReviewerID) REFERENCES Reviewer(ReviewerID),
	FOREIGN KEY (ReviewID) REFERENCES Review(ReviewID)
);

CREATE TABLE Contain(
	RestaurantID int NOT NULL,
    ReviewID int,
    PRIMARY KEY(ReviewID),
	FOREIGN KEY (ReviewID) REFERENCES Review(ReviewID),
	FOREIGN KEY (RestaurantID) REFERENCES Restaurant(RestaurantID)
);

