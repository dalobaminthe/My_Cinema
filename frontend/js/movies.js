const API_URL = 'http://localhost:8000/index.php';

// ---- AFFICHER LA LISTE DES FILMS ------- //

let currentPage = 1;
const perPage = 10;

function AfficheMovies(page = 1) {
    currentPage = page;
    
    fetch(`${API_URL}?action=list_movies&page=${page}&perPage=${perPage}`)
        .then(res => res.json())
        .then(data => {
            const moviesList = document.getElementById('movies-list');
            moviesList.innerHTML = '';
            
            if (data.movies.length === 0) {
                moviesList.innerHTML = '<p style="color: #94a3b8;">Aucun film enregistré</p>';
                return;
            }
            
            // Afficher les films
            data.movies.forEach(movie => {
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
            
            // Afficher la pagination
            displayPagination(data.page, data.totalPages);
        })
        .catch(err => {
            console.error('Erreur:', err);
            showMessage('error', 'Erreur lors du chargement des films');
        });
}

// AFFICHER LA PAGINATION
function displayPagination(currentPage, totalPages) {
    const moviesList = document.getElementById('movies-list');
    
    if (totalPages <= 1) {
        return; // Pas besoin de pagination
    }
    
    const paginationDiv = document.createElement('div');
    paginationDiv.style.cssText = 'display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; flex-wrap: wrap;';
    
    // Bouton Précédent
    if (currentPage > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '← Précédent';
        prevBtn.style.cssText = 'padding: 0.6rem 1rem; background: #0891b2; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;';
        prevBtn.onclick = () => AfficheMovies(currentPage - 1);
        paginationDiv.appendChild(prevBtn);
    }
    
    // Numéros de pages
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        
        if (i === currentPage) {
            pageBtn.style.cssText = 'padding: 0.6rem 1rem; background: #0891b2; color: white; border: none; border-radius: 6px; font-weight: 700;';
        } else {
            pageBtn.style.cssText = 'padding: 0.6rem 1rem; background: white; color: #0891b2; border: 2px solid #0891b2; border-radius: 6px; cursor: pointer; font-weight: 600;';
            pageBtn.onclick = () => AfficheMovies(i);
        }
        
        paginationDiv.appendChild(pageBtn);
    }
    
    // Bouton Suivant
    if (currentPage < totalPages) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Suivant →';
        nextBtn.style.cssText = 'padding: 0.6rem 1rem; background: #0891b2; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;';
        nextBtn.onclick = () => AfficheMovies(currentPage + 1);
        paginationDiv.appendChild(nextBtn);
    }
    
    moviesList.appendChild(paginationDiv);
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