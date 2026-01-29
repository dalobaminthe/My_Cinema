<?php
// classe screening est une ligne de la table screenings
class Screening {
    public ?int $id = null;
    public int $movie_id;
    public int $room_id;
    public ?string $start_time = null;
    public ?string $end_time = null;
    public ?bool $active = null;
    public ?string $created_at = null;
    public ?string $updated_at = null;    
}