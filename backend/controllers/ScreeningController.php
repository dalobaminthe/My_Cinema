<?php
require_once __DIR__ . '/../repositories/ScreeningRepository.php';

class ScreeningController {
    private ScreeningRepository $repository;
    
    public function __construct() {
        $this->repository = new ScreeningRepository();
    }
    
    // liste tous les films
    public function list() {
        $screenings = $this->repository->getAll();
        echo json_encode($screenings);
    }
    
    // recup seance par id
    public function getOne() {
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            echo json_encode(['error' => 'ID manquant']);
            return;
        }
        
        $screening = $this->repository->getById((int)$id);
        
        if ($screening) {
            echo json_encode($screening);
        } else {
            echo json_encode(['error' => 'Séance non trouvée']);
        }
    }
    
    // ajt seance
    public function add() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validations.js
    if (empty($data['movie_id']) || empty($data['room_id']) || empty($data['start_time']) || empty($data['end_time'])) {
        echo json_encode(['error' => 'Données manquantes']);
        return;
    }
    
    //conflit
    $hasConflict = $this->repository->hasConflict(
        (int)$data['room_id'],
        $data['start_time'],
        $data['end_time']
    );
    
    if ($hasConflict) {
        echo json_encode(['error' => 'Conflit d\'horaire']);
        return;
    }
    
    $screening = new Screening();
    $screening->movie_id = (int)$data['movie_id'];
    $screening->room_id = (int)$data['room_id'];
    $screening->start_time = $data['start_time'];
    $screening->end_time = $data['end_time'];
    
    $success = $this->repository->add($screening);
    
    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Séance ajoutée']);
    } else {
        echo json_encode(['error' => 'Erreur lors de l\'ajout']);
    }
}
    
    // modif seance
    public function update() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['id'])) {
        echo json_encode(['error' => 'ID manquant']);
        return;
    }
    
    $screening = $this->repository->getById((int)$data['id']);
    
    if (!$screening) {
        echo json_encode(['error' => 'Séance non trouvée']);
        return;
    }
    

    $room_id = $data['room_id'] ?? $screening->room_id;
    $start_time = $data['start_time'] ?? $screening->start_time;
    $end_time = $data['end_time'] ?? $screening->end_time;
    
    $hasConflict = $this->repository->hasConflict(
        (int)$room_id,
        $start_time,
        $end_time,
        (int)$data['id']
    );
    
    if ($hasConflict) {
        echo json_encode(['error' => 'Conflit d\'horaire']);
        return;
    }
    
    // Mise à jour
    $screening->movie_id = $data['movie_id'] ?? $screening->movie_id;
    $screening->room_id = $room_id;
    $screening->start_time = $start_time;
    $screening->end_time = $end_time;
    
    $success = $this->repository->update($screening);
    
    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Séance modifiée']);
    } else {
        echo json_encode(['error' => 'Erreur lors de la modification']);
    }
}
    
    // supp seance
    public function delete() {
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            echo json_encode(['error' => 'ID manquant']);
            return;
        }
        
        $success = $this->repository->softDelete((int)$id);
        
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Séance supprimée']);
        } else {
            echo json_encode(['error' => 'Impossible de supprimer (séances liées ?)']);
        }
    }
}