<?php
//les repositories sont les SEULS à parler à la base de données. Chaque table = 1 repository.

require_once __DIR__ . '/../config/database.php';

// test $pdo
$stmt = $pdo->query("SELECT * FROM movies");
$movies = $stmt->fetchAll();

print_r($movies);

echo "Connexion réussie PDO";
?>