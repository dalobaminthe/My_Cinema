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

    public function getById(int $id): ?Screening {
        $stmt = $this->pdo->prepare("SELECT * FROM screenings WHERE id = :id AND active = TRUE");
        $stmt->execute(['id' => $id]);
        
        $result = $stmt->fetchObject('Screening');
        return $result ?: null;
    }   
    
    public function add(Screening $screening): bool {
        $stmt = $this->pdo->prepare("INSERT INTO screenings (movie_id, room_id, start_time, end_time)
        VALUES (:movie_id, :room_id, :start_time, :end_time)");
        
        return $stmt->execute([
        'movie_id' => $screening->movie_id,
        'room_id' => $screening->room_id,
        'start_time' => $screening->start_time,
        'end_time' => $screening->end_time,
    ]);
    }
    
    public function update(Screening $screening): bool {
        $stmt = $this->pdo->prepare("UPDATE screenings 
        SET movie_id = :movie_id, room_id = :room_id, start_time = :start_time, end_time = :end_time WHERE id = :id");
        
        return $stmt->execute([
        'id' => $screening->id,
        'movie_id' => $screening->movie_id,
        'room_id' => $screening->room_id,
        'start_time' => $screening->start_time,
        'end_time' => $screening->end_time,
        ]);
    }

    public function softDelete(int $id): bool {
        $stmt = $this->pdo->prepare("UPDATE screenings SET active = FALSE WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
    
    public function Conflict(int $room_id, string $start_time, string $end_time, ?int $screening_id = null): bool {
        $sql = "SELECT COUNT(*) FROM screenings 
            WHERE room_id = :room_id 
            AND active = TRUE
            AND ((start_time < :end_time AND end_time > :start_time))";
            
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