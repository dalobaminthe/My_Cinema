<?php

require_once __DIR__ . '/../models/Movie.php';

class MovieRepository {
    private PDO $pdo;  // Connexion à la base
    
    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }
    
    //récup tous les films
    public function getAll(): array {
        $stmt = $this->pdo->query("SELECT * FROM movies");
        return $stmt->fetchAll(PDO::FETCH_CLASS, "Movie");
    }

    //recup un film avec son id
    public function getById(int $id): ?Movie {
        $stmt = $this->pdo->prepare("SELECT * FROM movies WHERE id = :id");
        $stmt->execute(['id' => $id]);
        
        $result = $stmt->fetchObject('Movie');
        return $result ?: null;
    }
    
    //ajoute un nouveau film
    public function add(Movie $movie): bool {
    $stmt = $this->pdo->prepare("INSERT INTO movies (title, description, duration, release_year, genre, director)
    VALUES (:title, :description, :duration, :release_year, :genre, :director)");
    
    return $stmt->execute([
        'title' => $movie->title,
        'description' => $movie->description,
        'duration' => $movie->duration,
        'release_year' => $movie->release_year,
        'genre' => $movie->genre,
        'director' => $movie->director
    ]);
    }

    //modifie un film qui existe déja dans la base
    public function update(Movie $movie): bool {
    $stmt = $this->pdo->prepare("UPDATE movies 
    SET title = :title, description = :description, duration = :duration, release_year = :release_year, genre = :genre, director = :director
    WHERE id = :id");
    
    return $stmt->execute([
        'id' => $movie->id,
        'title' => $movie->title,
        'description' => $movie->description,
        'duration' => $movie->duration,
        'release_year' => $movie->release_year,
        'genre' => $movie->genre,
        'director' => $movie->director
    ]);
    }
    
    //supp si pas de séance
    public function delete(int $id): bool {
        try {
            $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM screenings WHERE movie_id = :id AND active = TRUE");
            $stmt->execute(['id' => $id]);
            $count = $stmt->fetchColumn();
        
        if ($count > 0) {
            return false;
        }
        
        $stmt = $this->pdo->prepare("DELETE FROM movies WHERE id = :id");
        return $stmt->execute(['id' => $id]);
        } catch (PDOException $e) {
        return false;
        }
    }

    // Récupérer les films avec pagination
    public function getAllPaginated(int $page = 1, int $perPage = 3): array {
    $offset = ($page - 1) * $perPage;
    
    $stmt = $this->pdo->prepare("
        SELECT * FROM movies 
        ORDER BY id DESC
        LIMIT :limit OFFSET :offset
    ");
    $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    
    return $stmt->fetchAll(PDO::FETCH_CLASS, 'Movie');
}

// Compter le nombre total de films
public function count(): int {
    $stmt = $this->pdo->query("SELECT COUNT(*) FROM movies");
    return (int)$stmt->fetchColumn();
}
}