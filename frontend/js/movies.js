const API_URL = 'http://localhost:8000/index.php';

let currentPage = 1;

// ---- AFFICHER LA LISTE DES FILMS AVEC PAGINATION -------
function AfficheMovies(page = 1) {
    currentPage = page;
    
    fetch(`${API_URL}?action=list_movies&page=${page}`)
        .then(res => res.json())
        .then(data => {
            const moviesList = document.getElementById('movies-list');
            moviesList.innerHTML = '';
            
            // Si pas de films
            if (!data.movies || data.movies.length === 0) {
                moviesList.innerHTML = '<p style="color: #94a3b8;">Aucun film enregistré</p>';
                return;
            }
            
            // Afficher chaque film
            data.movies.forEach(movie => {
                const movieItem = document.createElement('div');
                movieItem.className = 'item';
                movieItem.innerHTML = `
                    <h4>${movie.title}</h4>
                    <p><strong>Durée :</strong> ${movie.duration} minutes</p>
                    <p><strong>Année :</strong> ${movie.release_year}</p>
                    ${movie.genre ? `<p><strong>Genre :</strong> ${movie.genre}</p>` : ''}
                    ${movie.director ? `<p><strong>Réalisateur :</strong> ${movie.director}</p>` : ''}
                    ${movie.description ? `<p><strong>Synopsis :</strong> ${movie.description.substring(0, 150)}...</p>` : ''}
                    <div class="item-actions">
                        <button class="btn-delete" onclick="deleteMovie(${movie.id}, '${movie.title.replace(/'/g, "\\'")}')">Supprimer</button>
                    </div>
                `;
                moviesList.appendChild(movieItem);
            });
            
            // AFFICHER LA PAGINATION
            if (data.totalPages > 1) {
                afficherPagination(data.page, data.totalPages);
            }
        })
        .catch(err => {
            console.error('Erreur:', err);
            showMessage('error', 'Erreur lors du chargement des films');
        });
}

// AFFICHER LES BOUTONS DE PAGINATION
function afficherPagination(currentPage, totalPages) {
    const moviesList = document.getElementById('movies-list');
    
    const paginationDiv = document.createElement('div');
    paginationDiv.style.cssText = `
        display: flex; 
        justify-content: center; 
        align-items: center;
        gap: 0.5rem; 
        margin-top: 2rem; 
        padding: 1rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    `;
    
    // Bouton "Précédent"
    if (currentPage > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '← Précédent';
        prevBtn.style.cssText = `
            padding: 0.7rem 1.2rem; 
            background: #0891b2; 
            color: white; 
            border: none; 
            border-radius: 6px; 
            cursor: pointer; 
            font-weight: 600;
            font-family: 'Space Grotesk', sans-serif;
        `;
        prevBtn.onmouseover = () => prevBtn.style.background = '#06b6d4';
        prevBtn.onmouseout = () => prevBtn.style.background = '#0891b2';
        prevBtn.onclick = () => AfficheMovies(currentPage - 1);
        paginationDiv.appendChild(prevBtn);
    }
    
    // Boutons de numéros de pages
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        
        if (i === currentPage) {
            // Page active
            pageBtn.style.cssText = `
                padding: 0.7rem 1rem; 
                background: #0891b2; 
                color: white; 
                border: none; 
                border-radius: 6px; 
                font-weight: 700;
                font-family: 'Space Grotesk', sans-serif;
                min-width: 40px;
            `;
        } else {
            // Autres pages
            pageBtn.style.cssText = `
                padding: 0.7rem 1rem; 
                background: white; 
                color: #0891b2; 
                border: 2px solid #0891b2; 
                border-radius: 6px; 
                cursor: pointer; 
                font-weight: 600;
                font-family: 'Space Grotesk', sans-serif;
                min-width: 40px;
            `;
            pageBtn.onmouseover = () => {
                pageBtn.style.background = '#ecfeff';
            };
            pageBtn.onmouseout = () => {
                pageBtn.style.background = 'white';
            };
            pageBtn.onclick = () => AfficheMovies(i);
        }
        
        paginationDiv.appendChild(pageBtn);
    }
    
    // Bouton "Suivant"
    if (currentPage < totalPages) {
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = 'Suivant →';
        nextBtn.style.cssText = `
            padding: 0.7rem 1.2rem; 
            background: #0891b2; 
            color: white; 
            border: none; 
            border-radius: 6px; 
            cursor: pointer; 
            font-weight: 600;
            font-family: 'Space Grotesk', sans-serif;
        `;
        nextBtn.onmouseover = () => nextBtn.style.background = '#06b6d4';
        nextBtn.onmouseout = () => nextBtn.style.background = '#0891b2';
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
            AfficheMovies(1); // Retour page 1
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
    
    fetch(`${API_URL}?action=delete_movie&id=${id}`)
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showMessage('success', 'Film supprimé avec succès !');
            AfficheMovies(currentPage);
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
    AfficheMovies(1);
});