-- verif database
DROP DATABASE IF EXISTS mon_cinema;
-- creation de base de donnée: 
CREATE DATABASE mon_cinema CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mon_cinema;

-- verif utilisateur
DROP USER IF EXISTS 'cine_admin'@'localhost';
-- creation d'un utilisateur pour l'appli
CREATE USER 'cine_admin'@'localhost' IDENTIFIED BY 'cinema0904';
GRANT ALL PRIVILEGES ON mon_cinema.* TO 'cine_admin'@'localhost';
FLUSH PRIVILEGES;

-- Table des films
CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    description TEXT,
    duration INT NOT NULL,
    release_year INT NOT NULL,
    genre VARCHAR(100),
    director VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des salles
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    room_type VARCHAR(30),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table de planning des séances
CREATE TABLE screenings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    room_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE RESTRICT,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT
);
