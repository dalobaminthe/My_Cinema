<?php
$request = $_GET ['action'] ?? ''; // Récupération du paramètre d ' URL action indiquant la route API
switch ($request ) {
case ' list_movies ':
$controller = new MovieController () ;
$controller -> list () ; // Appel de la méthode list du MovieController
break ;
default :
echo json_encode ([ " error " => " Action not found " ]) ;
break ;
}
// index.php est le seul point d'entrée : toutes les demandes passent par lui
?>