<?php

require_once __DIR__ . '/../models/Screening.php';

class ScreeningRepository {
    private PDO $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function getAll(): array {
        $stmt = $this->pdo->query("SELECT * FROM screenings WHERE active = TRUE");
    return $stmt->fetchAll(PDO::FETCH_CLASS, 'Screening');
    }

    public function getById(int $id): ?Screenings {
        $stmt = $this->pdo->prepare("SELECT * FROM screenings WHERE id = :id AND active = 1");
        $stmt->execute(['id' => $id]);
        
        $result = $stmt->fetchObject("Screenings");
        return $result ?: null;
    }   
    
    public function add(Screenings $Screenings): bool {
    $stmt = $this->pdo->prepare("INSERT INTO screenings (movie_id, room_id, start_time, end_time, active)
    VALUES (:movie_id, :room_id, :start_time, :end_time, :active)");
    
    return $stmt->execute([
        'movie_id' => $screenings->movie_id,
        'room_id' => $screenings->room_id,
        'start_time' => $screenings->start_time,
        'end_time' => $screenings->end_time,
        'active' => $screenings->active
    ]);
    }
    
    public function update(Screenings $Screenings): bool {
    $stmt = $this->pdo->prepare("UPDATE screenings 
    SET name = :name, capacity = :capacity, room_type = :room_type, active = :active WHERE id = :id");
    
    return $stmt->execute([
        'movie_id' => $screenings->movie_id,
        'room_id' => $screenings->room_id,
        'start_time' => $screenings->start_time,
        'end_time' => $screenings->end_time,
        'active' => $screenings->active
    ]);
    }

    public function softDelete(int $id): bool {
        $stmt = $this->pdo->prepare("UPDATE screenings SET active = FALSE WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
    
    public function hasConflict(int $room_id, string $start_time, string $end_time, ?int $screening_id = null): bool {
    $sql = "SELECT COUNT(*) FROM screenings 
            WHERE room_id = :room_id 
            AND active = TRUE
            AND (
                (start_time < :end_time AND end_time > :start_time)
            )";
    
    // Si on modifie une séance, exclure cette séance de la vérification
    if ($screening_id !== null) {
        $sql .= " AND id != :screening_id";
    }
    
    $stmt = $this->pdo->prepare($sql);
    $params = [
        'room_id' => $room_id,
        'start_time' => $start_time,
        'end_time' => $end_time
    ];
    
    if ($screening_id !== null) {
        $params['screening_id'] = $screening_id;
    }
    
    $stmt->execute($params);
    return $stmt->fetchColumn() > 0;
}
}