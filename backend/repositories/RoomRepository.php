<?php

require_once __DIR__ . '/../models/Room.php';

class RoomRepository {
    private PDO $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function getAll(): array {
        $stmt = $this->pdo->query("SELECT * FROM rooms WHERE active = TRUE");
    return $stmt->fetchAll(PDO::FETCH_CLASS, 'Room');
    }

    public function getById(int $id): ?Room {
        $stmt = $this->pdo->prepare("SELECT * FROM rooms WHERE id = :id AND active = TRUE");
        $stmt->execute(['id' => $id]);
        
        $result = $stmt->fetchObject('Room');
        return $result ?: null;
    }   
    
    public function add(Room $room): bool {
        $stmt = $this->pdo->prepare("INSERT INTO rooms (name, capacity, room_type)
        VALUES (:name, :capacity, :room_type)");
    
    return $stmt->execute([
        'name' => $room->name,
        'capacity' => $room->capacity,
        'room_type' => $room->room_type,
    ]);
    }
    
    public function update(Room $room): bool {
        $stmt = $this->pdo->prepare("UPDATE rooms 
        SET name = :name, capacity = :capacity, room_type = :room_type WHERE id = :id");
    
    return $stmt->execute([
        'id' => $room->id,
        'name' => $room->name,
        'capacity' => $room->capacity,
        'room_type' => $room->room_type,
    ]);
    }

    public function softDelete(int $id): bool {
        $stmt = $this->pdo->prepare("UPDATE rooms SET active = FALSE WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}