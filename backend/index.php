<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Connexion -- base de données
require_once __DIR__ . '/config/database.php';

// Controllers
require_once __DIR__ . '/controllers/MovieController.php';
require_once __DIR__ . '/controllers/RoomController.php';
require_once __DIR__ . '/controllers/ScreeningController.php';

$request = $_GET['action'] ?? '';

switch ($request) {
    // FILMS
    case 'list_movies':
        $controller = new MovieController();
        $controller->list();
        break;
    
    case 'get_movie':
        $controller = new MovieController();
        $controller->getOne();
        break;
    
    case 'add_movie':
        $controller = new MovieController();
        $controller->add();
        break;
    
    case 'update_movie':
        $controller = new MovieController();
        $controller->update();
        break;
    
    case 'delete_movie':
        $controller = new MovieController();
        $controller->delete();
        break;
    
    // SALLES 
    case 'list_rooms':
        $controller = new RoomController();
        $controller->list();
        break;
    
    case 'get_room':
        $controller = new RoomController();
        $controller->getOne();
        break;
    
    case 'add_room':
        $controller = new RoomController();
        $controller->add();
        break;
    
    case 'update_room':
        $controller = new RoomController();
        $controller->update();
        break;
    
    case 'delete_room':
        $controller = new RoomController();
        $controller->delete();
        break;
    
    // SÉANCES 
    case 'list_screenings':
        $controller = new ScreeningController();
        $controller->list();
        break;
    
    case 'get_screening':
        $controller = new ScreeningController();
        $controller->getOne();
        break;
    
    case 'add_screening':
        $controller = new ScreeningController();
        $controller->add();
        break;
    
    case 'update_screening':
        $controller = new ScreeningController();
        $controller->update();
        break;
    
    case 'delete_screening':
        $controller = new ScreeningController();
        $controller->delete();
        break;
    
    // DÉFAUT 
    default:
        echo json_encode(['error' => 'Action non trouvée']);
        break;
}