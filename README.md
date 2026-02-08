# 🎬 My Cinema - Système de Gestion de Cinéma

Application web de gestion de cinéma permettant d'administrer films, salles et séances.

## 🎯 Fonctionnalités

- ✅ **Gestion des films** : CRUD complet (Create, Read, Delete)
- ✅ **Gestion des salles** : CRUD avec soft delete
- ✅ **Gestion des séances** : Création avec vérification automatique des conflits d'horaires
- ✅ **Architecture MVC** : Backend organisé en Models, Repositories, Controllers
- ✅ **API REST JSON** : Communication Frontend ↔ Backend via Fetch API
- ✅ **Pagination** : Affichage des films par pages
- ✅ **Calcul automatique** : L'heure de fin des séances se calcule selon la durée du film

## 🛠️ Technologies

**Backend** :
- PHP 8+ (Programmation Orientée Objet)
- MySQL avec PDO (requêtes préparées)
- Architecture MVC

**Frontend** :
- HTML5 / CSS3
- JavaScript (Fetch API)
- Design responsive

## 📦 Installation

### 1. Créer la base de données
```bash
sudo mysql < script.sql
```

### 2. Lancer le serveur backend
```bash
cd backend
php -S localhost:8000
```

### 3. Lancer le serveur frontend
```bash
cd frontend
php -S localhost:3000
```

### 4. Accéder à l'application

Ouvrir dans le navigateur : `http://localhost:3000/index.html`

## 📁 Structure du projet
```
my-cinema/
├── backend/
│   ├── index.php (Point d'entrée API)
│   ├── config/
│   │   └── database.php
│   ├── models/
│   │   ├── Movie.php
│   │   ├── Room.php
│   │   └── Screening.php
│   ├── repositories/
│   │   ├── MovieRepository.php
│   │   ├── RoomRepository.php
│   │   └── ScreeningRepository.php
│   └── controllers/
│       ├── MovieController.php
│       ├── RoomController.php
│       └── ScreeningController.php
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── js/
│       ├── script.js
│       ├── movies.js
│       ├── room.js
│       └── screening.js
├── script.sql
└── README.md
```

## 🎬 Utilisation

### Ajouter un film
1. Aller sur l'onglet "Films"
2. Remplir le formulaire (titre, durée, année...)
3. Cliquer sur "Ajouter le film"

### Créer une séance
1. Aller sur l'onglet "Séances"
2. Sélectionner un film et une salle
3. Choisir l'heure de début
4. L'heure de fin se calcule automatiquement
5. Le système vérifie qu'il n'y a pas de conflit d'horaire

## 🔒 Sécurité

- ✅ Requêtes préparées PDO (protection injection SQL)
- ✅ Validation des données côté serveur
- ✅ Foreign keys pour l'intégrité référentielle
- ✅ Soft delete pour les salles

## 👤 Auteur

Daloba M. - EPITECH - 2026

## 📄 Licence

Projet éducatif - EPITECH