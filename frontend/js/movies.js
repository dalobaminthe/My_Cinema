const API_URL = 'http://localhost:8000/index.php';

// ---- AFFICHER LA LISTE DES FILMS ------- //
function AfficheMovies() {
    fetch(`${API_URL}?action=list_movies`)
        .then(res => res.json())
        .then(movies => {
            const moviesList = document.getElementById('movies-list');
            moviesList.innerHTML = '';
            
            if (movies.length === 0) {
                moviesList.innerHTML = '<p style="color: #94a3b8;">Aucun film enregistré</p>';
                return;
            }
            
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
                        <button class="btn-delete" onclick="deleteMovie(${movie.id}, '${movie.title.replace(/'/g, "\\'")}')">Supprimer</button>
                    </div>
                `;
                moviesList.appendChild(movieItem);
            });
        })
        .catch(err => {
            console.error('Erreur:', err);
            showMessage('error', 'Erreur lors du chargement des films');
        });
}

// ------- AJOUTER UN FILM -------
document.getElementById('add-movie-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const movieData = {
        title: document.getElementById('movie-title').value,
        description: document.getElementById('movie-description').value,
        duration: parseInt(document.getElementById('movie-duration').value),
        release_year: parseInt(document.getElementById('movie-year').value),
        genre: document.getElementById('movie-genre').value,
        director: document.getElementById('movie-director').value
    };
    
    fetch(`${API_URL}?action=add_movie`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movieData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showMessage('success', 'Film ajouté avec succès !');
            document.getElementById('add-movie-form').reset();
            AfficheMovies();
        } else {
            showMessage('error', data.error || 'Erreur lors de l\'ajout');
        }
    })
    .catch(err => {
        console.error('Erreur:', err);
        showMessage('error', 'Erreur de communication avec le serveur');
    });
});

// ------- SUPPRIMER UN FILM -------
function deleteMovie(id, title) {
    if (!confirm(`Voulez-vous vraiment supprimer le film "${title}" ?`)) {
        return;
    }
    
    fetch(`${API_URL}?action=delete_movie&id=${id}`, {
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showMessage('success', 'Film supprimé avec succès !');
            AfficheMovies();
        } else {
            showMessage('error', data.error || 'Impossible de supprimer ce film');
        }
    })
    .catch(err => {
        console.error('Erreur:', err);
        showMessage('error', 'Erreur lors de la suppression');
    });
}

// ------- AFFICHER UN MESSAGE -------
function showMessage(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const filmsSection = document.getElementById('films');
    filmsSection.insertBefore(messageDiv, filmsSection.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 4000);
}

// ------- CHARGER LES FILMS AU DÉMARRAGE -------
document.addEventListener('DOMContentLoaded', function() {
    AfficheMovies();
});