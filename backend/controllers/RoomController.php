<?php
require_once __DIR__ . '/../repositories/RoomRepository.php';

class RoomController {
    private RoomRepository $repository;

    public function __construct() {
        $this->repository = new RoomRepository();
    }
    
    public function list() {
        $rooms = $this->repository->getAll();
        echo json_encode($rooms);
    }
    
    // recup salle par id
    public function getOne() {
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            echo json_encode(['error' => 'ID manquant']);
            return;
        }
        
        $room = $this->repository->getById((int)$id);
        
        if ($room) {
            echo json_encode($room);
        } else {
            echo json_encode(['error' => 'Salle non trouvée']);
        }
    }
    
    // ajt salle
    public function add() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['name']) || empty($data['capacity'])) {
            echo json_encode(['error' => 'Données manquantes']);
        
        return;
        }
        
        $room = new Room();
        $room->name = $data['name'];
        $room->capacity = (int)$data['capacity'];
        $room->room_type = $data['room_type'] ?? null;
        
        // ajt en base
        $success = $this->repository->add($room);
        
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Salle ajouté']);
        } else {
            echo json_encode(['error' => 'Erreur lors de l\'ajout']);
        }
    }
    
    // modif salle
    public function update() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['id'])) {
            echo json_encode(['error' => 'ID manquant']);
            return;
        }
        
        // recup salle
        $room = $this->repository->getById((int)$data['id']);
        
        if (!$room) {
            echo json_encode(['error' => 'Salle non trouvée']);
            return;
        }
        
        // mise a jour
        $room->name = $data['name'] ?? $room->name;
        $room->capacity = $data['capacity'] ?? $room->capacity;
        $room->room_type = $data['room_type'] ?? $room->room_type;

        
        $success = $this->repository->update($room);
        
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Salle modifiée']);
        } else {
            echo json_encode(['error' => 'Erreur lors de la modification']);
        }
    }
    
    // supp salle
    public function delete() {
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            echo json_encode(['error' => 'ID manquant']);
            return;
        }
        
        $success = $this->repository->softDelete((int)$id);
        
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Salle supprimée']);
        } else {
            echo json_encode(['error' => 'Impossible de supprimer (séances liées ?)']);
        }
    }
}