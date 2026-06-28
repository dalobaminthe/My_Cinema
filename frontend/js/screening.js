// CHARGER LES FILMS ET SALLES DANS LES SELECTS
function loadScreeningOptions() {
    // Charger les films
    fetch(`${API_URL}?action=list_movies`)
        .then(res => res.json())
        .then(data => {
            const movieSelect = document.getElementById('screening-movie');
            movieSelect.innerHTML = '<option value="">Choisir un film *</option>';
            
            // Support pagination ou non
            const movies = data.movies || data;
            
            if (Array.isArray(movies)) {
                movies.forEach(movie => {
                    const option = document.createElement('option');
                    option.value = movie.id;
                    option.textContent = `${movie.title} (${movie.duration} min)`;
                    option.dataset.duration = movie.duration;
                    movieSelect.appendChild(option);
                });
            }
        })
        .catch(err => console.error('Erreur films:', err));
    
    // Charger les salles
    fetch(`${API_URL}?action=list_rooms`)
        .then(res => res.json())
        .then(rooms => {
            console.log('Salles reçues:', rooms); // DEBUG
            
            const roomSelect = document.getElementById('screening-room');
            roomSelect.innerHTML = '<option value="">Choisir une salle *</option>';
            
            if (Array.isArray(rooms) && rooms.length > 0) {
                rooms.forEach(room => {
                    const option = document.createElement('option');
                    option.value = room.id;
                    option.textContent = `${room.name} (${room.capacity} places)`;
                    roomSelect.appendChild(option);
                });
                console.log('✅ Salles chargées:', rooms.length);
            } else {
                console.error('❌ Aucune salle ou format incorrect');
            }
        })
        .catch(err => console.error('Erreur salles:', err));
}

// CALCULER END_TIME AUTOMATIQUEMENT
document.getElementById('screening-movie').addEventListener('change', function() {
    calculateEndTime();
});

document.getElementById('screening-start').addEventListener('change', function() {
    calculateEndTime();
});

function calculateEndTime() {
    const movieSelect = document.getElementById('screening-movie');
    const startInput = document.getElementById('screening-start');
    const endInput = document.getElementById('screening-end');
    
    const selectedOption = movieSelect.options[movieSelect.selectedIndex];
    const duration = selectedOption ? selectedOption.dataset.duration : null;
    const startTime = startInput.value;
    
    if (duration && startTime) {
        const start = new Date(startTime);
        start.setMinutes(start.getMinutes() + parseInt(duration));
        
        const year = start.getFullYear();
        const month = String(start.getMonth() + 1).padStart(2, '0');
        const day = String(start.getDate()).padStart(2, '0');
        const hours = String(start.getHours()).padStart(2, '0');
        const minutes = String(start.getMinutes()).padStart(2, '0');
        
        endInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
}

// AFFICHER LES SÉANCES
function loadScreenings() {
    fetch(`${API_URL}?action=list_screenings`)
        .then(res => res.json())
        .then(screenings => {
            const screeningsList = document.getElementById('screenings-list');
            screeningsList.innerHTML = '';
            
            if (screenings.length === 0) {
                screeningsList.innerHTML = '<p style="color: #94a3b8;">Aucune séance enregistrée</p>';
                return;
            }
            
            screenings.forEach(screening => {
                const screeningItem = document.createElement('div');
                screeningItem.className = 'item';
                
                const startDate = new Date(screening.start_time);
                const endDate = new Date(screening.end_time);
                
                screeningItem.innerHTML = `
                    <h4>Séance #${screening.id}</h4>
                    <p><strong>Film :</strong> ID ${screening.movie_id}</p>
                    <p><strong>Salle :</strong> ID ${screening.room_id}</p>
                    <p><strong>Début :</strong> ${startDate.toLocaleString('fr-FR')}</p>
                    <p><strong>Fin :</strong> ${endDate.toLocaleString('fr-FR')}</p>
                    <div class="item-actions">
                        <button class="btn-edit" onclick="editScreening(${screening.id})">Modifier</button>
                        <button class="btn-delete" onclick="deleteScreening(${screening.id})">Supprimer</button>
                    </div>
                `;
                screeningsList.appendChild(screeningItem);
            });
        })
        .catch(err => {
            console.error('Erreur:', err);
        });
}

// AJOUTER OU MODIFIER UNE SÉANCE
let editingScreeningId = null;

document.getElementById('add-screening-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const screeningData = {
        movie_id: parseInt(document.getElementById('screening-movie').value),
        room_id: parseInt(document.getElementById('screening-room').value),
        start_time: document.getElementById('screening-start').value.replace('T', ' ') + ':00',
        end_time: document.getElementById('screening-end').value.replace('T', ' ') + ':00'
    };

    const isEditing = editingScreeningId !== null;
    const action = isEditing ? 'update_screening' : 'add_screening';

    if (isEditing) {
        screeningData.id = editingScreeningId;
    }

    fetch(`${API_URL}?action=${action}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(screeningData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(isEditing ? '✅ Séance modifiée avec succès !' : '✅ Séance ajoutée avec succès !');
            cancelEditScreening();
            loadScreenings();
        } else {
            alert('❌ ' + (data.error || (isEditing ? 'Erreur lors de la modification' : 'Erreur lors de l\'ajout')));
        }
    })
    .catch(err => {
        console.error('Erreur:', err);
        alert('❌ Erreur de communication avec le serveur');
    });
});

// PASSER EN MODE ÉDITION
function editScreening(id) {
    fetch(`${API_URL}?action=get_screening&id=${id}`)
        .then(res => res.json())
        .then(screening => {
            if (screening.error) {
                alert('❌ ' + screening.error);
                return;
            }

            editingScreeningId = screening.id;

            document.getElementById('screening-id').value = screening.id;
            document.getElementById('screening-movie').value = screening.movie_id;
            document.getElementById('screening-room').value = screening.room_id;
            document.getElementById('screening-start').value = screening.start_time.replace(' ', 'T').substring(0, 16);
            document.getElementById('screening-end').value = screening.end_time.replace(' ', 'T').substring(0, 16);

            document.getElementById('screening-form-title').textContent = 'Modifier la séance';
            document.getElementById('screening-submit-btn').textContent = 'Enregistrer les modifications';
            document.getElementById('screening-cancel-btn').style.display = 'inline-block';

            document.getElementById('add-screening-form').scrollIntoView({ behavior: 'smooth' });
        })
        .catch(err => {
            console.error('Erreur:', err);
            alert('❌ Erreur lors du chargement de la séance');
        });
}

// ANNULER L'ÉDITION
function cancelEditScreening() {
    editingScreeningId = null;
    document.getElementById('add-screening-form').reset();
    document.getElementById('screening-form-title').textContent = 'Ajouter une séance';
    document.getElementById('screening-submit-btn').textContent = 'Ajouter la séance';
    document.getElementById('screening-cancel-btn').style.display = 'none';
}

document.getElementById('screening-cancel-btn').addEventListener('click', cancelEditScreening);

// SUPPRIMER UNE SÉANCE
function deleteScreening(id) {
    if (!confirm('Voulez-vous vraiment supprimer cette séance ?')) {
        return;
    }
    
    fetch(`${API_URL}?action=delete_screening&id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('✅ Séance supprimée !');
                loadScreenings();
            } else {
                alert('❌ ' + (data.error || 'Erreur'));
            }
        });
}

// CHARGER AU DÉMARRAGE
document.addEventListener('DOMContentLoaded', function() {
    loadScreeningOptions();
    loadScreenings();
});