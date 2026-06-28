// AFFICHER LA LISTE DES SALLES
function loadRooms() {
    fetch(`${API_URL}?action=list_rooms`)
        .then(res => res.json())
        .then(rooms => {
            const roomsList = document.getElementById('rooms-list');
            roomsList.innerHTML = '';
            
            if (rooms.length === 0) {
                roomsList.innerHTML = '<p style="color: #94a3b8;">Aucune salle enregistrée</p>';
                return;
            }
            
            rooms.forEach(room => {
                const roomItem = document.createElement('div');
                roomItem.className = 'item';
                roomItem.innerHTML = `
                    <h4>${room.name}</h4>
                    <p><strong>Capacité :</strong> ${room.capacity} places</p>
                    ${room.room_type ? `<p><strong>Type :</strong> ${room.room_type}</p>` : ''}
                    <div class="item-actions">
                        <button class="btn-edit" onclick="editRoom(${room.id})">Modifier</button>
                        <button class="btn-delete" onclick="deleteRoom(${room.id}, '${room.name.replace(/'/g, "\\'")}')">Supprimer</button>
                    </div>
                `;
                roomsList.appendChild(roomItem);
            });
        })
        .catch(err => {
            console.error('Erreur:', err);
            showRoomMessage('error', 'Erreur lors du chargement des salles');
        });
}

// AJOUTER OU MODIFIER UNE SALLE
let editingRoomId = null;

document.getElementById('add-room-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const roomData = {
        name: document.getElementById('room-name').value,
        capacity: parseInt(document.getElementById('room-capacity').value),
        room_type: document.getElementById('room-type').value
    };

    const isEditing = editingRoomId !== null;
    const action = isEditing ? 'update_room' : 'add_room';

    if (isEditing) {
        roomData.id = editingRoomId;
    }

    fetch(`${API_URL}?action=${action}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(roomData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showRoomMessage('success', isEditing ? 'Salle modifiée avec succès !' : 'Salle ajoutée avec succès !');
            cancelEditRoom();
            loadRooms();

            if (typeof loadScreeningOptions === 'function') {
                loadScreeningOptions();
            }
        } else {
            showRoomMessage('error', data.error || (isEditing ? 'Erreur lors de la modification' : 'Erreur lors de l\'ajout'));
        }
    })
    .catch(err => {
        console.error('Erreur:', err);
        showRoomMessage('error', 'Erreur de communication avec le serveur');
    });
});

// PASSER EN MODE ÉDITION
function editRoom(id) {
    fetch(`${API_URL}?action=get_room&id=${id}`)
        .then(res => res.json())
        .then(room => {
            if (room.error) {
                showRoomMessage('error', room.error);
                return;
            }

            editingRoomId = room.id;

            document.getElementById('room-id').value = room.id;
            document.getElementById('room-name').value = room.name;
            document.getElementById('room-capacity').value = room.capacity;
            document.getElementById('room-type').value = room.room_type || '';

            document.getElementById('room-form-title').textContent = 'Modifier la salle';
            document.getElementById('room-submit-btn').textContent = 'Enregistrer les modifications';
            document.getElementById('room-cancel-btn').style.display = 'inline-block';

            document.getElementById('add-room-form').scrollIntoView({ behavior: 'smooth' });
        })
        .catch(err => {
            console.error('Erreur:', err);
            showRoomMessage('error', 'Erreur lors du chargement de la salle');
        });
}

// ANNULER L'ÉDITION
function cancelEditRoom() {
    editingRoomId = null;
    document.getElementById('add-room-form').reset();
    document.getElementById('room-form-title').textContent = 'Ajouter une salle';
    document.getElementById('room-submit-btn').textContent = 'Ajouter la salle';
    document.getElementById('room-cancel-btn').style.display = 'none';
}

document.getElementById('room-cancel-btn').addEventListener('click', cancelEditRoom);

// SUPPRIMER UNE SALLE (soft delete)
function deleteRoom(id, name) {
    if (!confirm(`Voulez-vous vraiment supprimer la salle "${name}" ?`)) {
        return;
    }
    
    fetch(`${API_URL}?action=delete_room&id=${id}`, {
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showRoomMessage('success', 'Salle supprimée avec succès !');
            loadRooms();
        } else {
            showRoomMessage('error', data.error || 'Impossible de supprimer cette salle');
        }
    })
    .catch(err => {
        console.error('Erreur:', err);
        showRoomMessage('error', 'Erreur lors de la suppression');
    });
}

// AFFICHER UN MESSAGE
function showRoomMessage(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const sallesSection = document.getElementById('salles');
    sallesSection.insertBefore(messageDiv, sallesSection.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 4000);
}

// CHARGER LES SALLES AU DÉMARRAGE
document.addEventListener('DOMContentLoaded', function() {
    loadRooms();
});