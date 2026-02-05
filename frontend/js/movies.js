const API_URL = 'http://localhost:8000/backend/index.php';

// AFFICHER LA LISTE DES FILMS
function AfficheMovies() {
    fetch(`${API_URL}?action=list_movies`)
        .then(res => res.json())
        .then(movies => {
            const moviesList = document.getElementById('movies-list');
            
            // Vider la liste actuelle
            moviesList.innerHTML = '';
            
            // Si aucun film
            if (movies.length === 0) {
                moviesList.innerHTML = '<p style="color: #94a3b8;">Aucun film enregistré</p>';
                return;
            }
            
            // Afficher chaque film
            movies.forEach(movie => {
                const movieItem = document.createElement('div');
                movieItem.className = 'item';
                movieItem.innerHTML = `
                    <h4>${movie.title}</h4>
                    <p><strong>Durée :</strong> ${movie.duration} minutes</p>
                    <p><strong>Année :</strong> ${movie.release_year}</p>
                    ${movie.genre ? `<p><strong>Genre :</strong> ${movie.genre}</p>` : ''}
                    ${movie.director ? `<p><strong>Réalisateur :</strong> ${movie.director}</p>` : ''}
                    ${movie.description ? `<p><strong>Synopsis :</strong> ${movie.description}</p>` : ''}
                    <div class="item-actions">
                        <button class="btn-edit" onclick="editMovie(${movie.id})">Modifier</button>
                        <button class="btn-delete" onclick="deleteMovie(${movie.id}, '${movie.title}')">Supprimer</button>
                    </div>
                `;
                moviesList.appendChild(movieItem);
            });
        })
        .catch(err => {
            console.error('Erreur lors du chargement des films:', err);
            showMessage('error', 'Erreur lors du chargement des films');
        });
}