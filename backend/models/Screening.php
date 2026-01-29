<?php
// classe room est une ligne de la table rooms
class Room {
    public ?int $id = null;
    public int $movie_id;
    public int $room_id;
    public string $start_time;
    public string $end_time;
    public bool $active;
    public ?string $created_at = null;
    public ?string $updated_at = null;    
}