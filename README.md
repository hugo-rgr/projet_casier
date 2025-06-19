# Projet de gestion de casier 

## Démarrage du backend

cd backend

Pour aller dans le repertoire du backend


npm install

Pour récupérer tous les packages utiles au projet


npx ts-node src/server.ts

Pour le lancer le projet backend(serveur)

Accès sur http://localhost:PORT en local

## Démarrage du frontend

cd frontend

Pour aller dans le repertoire du backend


npm install

Pour récupérer tous les packages utiles au projet


npm run dev

Pour le lancer le projet frontend (interface)

Accès sur http://localhost:PORT en local


## API endpoints

### Authentification
- `POST /api/v0/auth/login` : Authentification d'un utilisateur
- `POST /api/v0/auth/verify-email` : Vérification de l'email d'un utilisateur
- `POST /api/v0/auth/register` : Enregistrement d'un nouvel utilisateur
- `POST /api/v0/auth/request-password-reset` : Demande de réinitialisation de mot de passe
- `POST /api/v0/auth/reset-password` : Changement de mot de passe

### Utilisateurs
- `GET /api/v0/users` : Récupération de la liste des utilisateurs
- `GET /api/v0/users/:id` : Récupération des informations d'un utilisateur spécifique
- `PUT /api/v0/users/:id` : Mise à jour des informations d'un utilisateur spécifique
- `DELETE /api/v0/users/:id` : Suppression d'un utilisateur spécifique
- `POST /api/v0/users` : Création d'un nouvel utilisateur