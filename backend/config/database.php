<?php
// fichier qui sert à créer une connexion à MySQL et PHP.

$host = 'localhost';
$dbname = 'mon_cinema';
$user = 'cine_admin';
$pass = 'cinema0904';

$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";

// Connexion PDO
try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}