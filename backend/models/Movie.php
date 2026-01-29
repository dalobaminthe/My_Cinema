<?php
// classe movie est une ligne de la table movies
class Movie {
    public ?int $id = null;
    public string $title;
    public ?string $description = null;
    public int $duration;
    public int $release_year;
    public ?string $genre = null;
    public ?string $director = null;
    public ?string $created_at = null;
    public ?string $updated_at = null;
}