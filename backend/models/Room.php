<?php
// classe room est une ligne de la table rooms
class Room {
    public ?int $id = null;
    public string $name;
    public int $capacity;
    public ?string $room_type = null;
    public ?bool $active = null;
    public ?string $created_at = null;
    public ?string $updated_at = null;    
}