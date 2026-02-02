<?php
require_once __DIR__ . '/../repositories/MovieRepository.php';

class MovieController {
    private MovieRepository $repository;
    
    public function __construct() {
        $this->repository = new MovieRepository();
    }
    
    // liste tous les films
    public function list() {
        $movies = $this->repository->getAll();
        echo json_encode($movies);
    }
    
    // recup film par id
    public function getOne() {
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            echo json_encode(['error' => 'ID manquant']);
            return;
        }
        
        $movie = $this->repository->getById((int)$id);
        
        if ($movie) {
            echo json_encode($movie);
        } else {
            echo json_encode(['error' => 'Film non trouvé']);
        }
    }
    
    // ajt film
    public function add() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['title']) || empty($data['duration']) || empty($data['release_year'])) {
            echo json_encode(['error' => 'Données manquantes']);
            return;
        }
        
        // objet Movie
        $movie = new Movie();
        $movie->title = $data['title'];
        $movie->description = $data['description'] ?? null;
        $movie->duration = (int)$data['duration'];
        $movie->release_year = (int)$data['release_year'];
        $movie->genre = $data['genre'] ?? null;
        $movie->director = $data['director'] ?? null;
        
        // ajt en base
        $success = $this->repository->add($movie);
        
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Film ajouté']);
        } else {
            echo json_encode(['error' => 'Erreur lors de l\'ajout']);
        }
    }
    
    // modif film
    public function update() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['id'])) {
            echo json_encode(['error' => 'ID manquant']);
            return;
        }
        
        // recup film existant
        $movie = $this->repository->getById((int)$data['id']);
        
        if (!$movie) {
            echo json_encode(['error' => 'Film non trouvé']);
            return;
        }
        
        // mise a jour
        $movie->title = $data['title'] ?? $movie->title;
        $movie->description = $data['description'] ?? $movie->description;
        $movie->duration = $data['duration'] ?? $movie->duration;
        $movie->release_year = $data['release_year'] ?? $movie->release_year;
        $movie->genre = $data['genre'] ?? $movie->genre;
        $movie->director = $data['director'] ?? $movie->director;
        
        $success = $this->repository->update($movie);
        
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Film modifié']);
        } else {
            echo json_encode(['error' => 'Erreur lors de la modification']);
        }
    }
    
    // supp film
    public function delete() {
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            echo json_encode(['error' => 'ID manquant']);
            return;
        }
        
        $success = $this->repository->delete((int)$id);
        
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Film supprimé']);
        } else {
            echo json_encode(['error' => 'Impossible de supprimer (séances liées ?)']);
        }
    }
}
?>