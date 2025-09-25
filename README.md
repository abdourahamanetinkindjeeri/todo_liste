# Todo API

API Node.js/Express pour la gestion avancée de tâches avec Prisma, TypeScript, upload de fichiers et suivi de progression.

## Fonctionnalités principales

- Authentification JWT (login, refresh)
- CRUD des tâches (Todo)
- Statuts de tâches : EN_ATTENTE, EN_COURS, TERMINEE
- Suivi automatique de la progression d'une tâche (temps d'exécution, passage automatique à TERMINEE)
- Marquer une tâche comme terminée, en attente ou en cours
- Filtrer les tâches par statut ou par achèvement
- Gestion des utilisateurs (CRUD)
- Restriction d'accès : toutes les routes sauf /auth/login et /auth/refresh nécessitent d'être authentifié
- Délégation de tâche : possibilité pour un utilisateur de déléguer une tâche à un autre utilisateur
- Upload de photo et de fichier vocal pour une tâche (champs `photo`, `vocal`)
- Historique des modifications et délégations

## Structure du projet

- `src/` : Code source principal
  - `controllers/` : Logique métier des routes
  - `middleware/` : Middlewares Express (auth, audit, upload, progression...)
  - `repositories/` : Accès aux données Prisma
  - `routes/` : Définition des routes Express
  - `services/` : Services métiers (Cloudinary, Todo, User...)
  - `validators/` : Validation des données (Zod)
- `prisma/` : Schéma et migrations Prisma
- `public/` : Fichiers statiques et uploads

## Installation

```bash
npm install
```

## Configuration

- Configurez la base de données dans `.env` (voir `DATABASE_URL`)
- Ajoutez les secrets JWT dans `.env` :
  - JWT_ACCESS_SECRET
  - JWT_REFRESH_SECRET
- Modifiez le schéma Prisma dans `prisma/schema.prisma` si besoin

## Migration et génération Prisma

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Seed de la base

Pour insérer des utilisateurs et des tâches de test :

```bash
npx prisma db seed
```

## Lancement du serveur

```bash
npm run dev
```

## Gestion du temps d'exécution et progression

- Lors de la création d'une tâche, renseignez le champ `tempsExecution` (en secondes).
- Quand une tâche passe en statut `EN_COURS`, la date de début est enregistrée.
- La progression est calculée automatiquement à chaque requête : si le temps d'exécution est écoulé, la tâche passe en `TERMINEE`.
- Endpoint dédié : `GET /todos/:id/progression` pour récupérer le temps restant et le statut en temps réel.

## Upload de fichiers

- Photo : via le champ `photo` (upload local ou Cloudinary)
- Vocal : via le champ `vocal` (upload Cloudinary)

## Endpoints principaux

- `POST   /auth/login` : Connexion, retourne un accessToken
- `POST   /auth/refresh` : Rafraîchir le token d'accès
- `POST   /todos` : Créer une tâche (authentifié, upload photo/vocal possible)
- `GET    /todos` : Liste toutes les tâches (authentifié)
- `GET    /todos/non-acheve` : Liste des tâches non achevées (authentifié)
- `GET    /todos/status/:status` : Liste des tâches par statut (authentifié)
- `GET    /todos/:id/progression` : Progression et temps restant d'une tâche
- `PUT    /todos/:id/terminee` : Marquer comme terminée (authentifié)
- `PUT    /todos/:id/en-attente` : Marquer comme en attente (authentifié)
- `PUT    /todos/:id/en-cours` : Marquer comme en cours (authentifié)
- `PUT    /todos/:id` : Modifier une tâche (authentifié, créateur ou délégué)
- `DELETE /todos/:id` : Supprimer une tâche (authentifié, créateur uniquement)
- `POST   /todos/:id/delegate` : Déléguer une tâche à un utilisateur (authentifié, créateur uniquement)
- `DELETE /todos/:id/delegate` : Retirer la délégation d'une tâche (authentifié, créateur uniquement)
- `GET    /users` : Liste des utilisateurs (authentifié)
- `POST   /users` : Créer un utilisateur

## Exemple de requête

```bash
# Connexion
curl -X POST http://localhost:8888/auth/login -d '{"email":"awa@exemple.com","password":"admin123"}' -H "Content-Type: application/json"

# Récupérer la liste des todos (avec le token)
curl -X GET http://localhost:8888/todos -H "Authorization: Bearer <accessToken>"

# Progression d'une tâche
curl -X GET http://localhost:8888/todos/1/progression -H "Authorization: Bearer <accessToken>"

# Déléguer une tâche à un utilisateur
curl -X POST http://localhost:8888/todos/1/delegate -d '{"userId":2}' -H "Authorization: Bearer <accessToken>" -H "Content-Type: application/json"
```

## Installation

```bash
npm install
```

## Configuration

- Configurez la base de données dans `.env` (voir `DATABASE_URL`)
- Ajoutez les secrets JWT dans `.env` :
  - JWT_ACCESS_SECRET
  - JWT_REFRESH_SECRET
- Modifiez le schéma Prisma dans `prisma/schema.prisma` si besoin

## Migration et génération Prisma

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Seed de la base

Pour insérer des utilisateurs et des tâches de test :

```bash
npx prisma db seed
```

## Lancement du serveur

```bash
npm run watch
```

## Endpoints principaux

- `POST   /auth/login` : Connexion, retourne un accessToken
- `POST   /auth/refresh` : Rafraîchir le token d'accès
- `POST   /todos` : Créer une tâche (authentifié)
- `GET    /todos` : Liste toutes les tâches (authentifié)
- `GET    /todos/non-acheve` : Liste des tâches non achevées (authentifié)
- `GET    /todos/status/:status` : Liste des tâches par statut (authentifié)
- `PUT    /todos/:id/terminee` : Marquer comme terminée (authentifié)
- `PUT    /todos/:id/en-attente` : Marquer comme en attente (authentifié)
- `PUT    /todos/:id/en-cours` : Marquer comme en cours (authentifié)
- `PUT    /todos/:id` : Modifier une tâche (authentifié, créateur ou délégué)
- `DELETE /todos/:id` : Supprimer une tâche (authentifié, créateur uniquement)
- `POST   /todos/:id/delegate` : Déléguer une tâche à un utilisateur (authentifié, créateur uniquement)
- `DELETE /todos/:id/delegate` : Retirer la délégation d'une tâche (authentifié, créateur uniquement)
- `GET    /users` : Liste des utilisateurs (authentifié)
- `POST   /users` : Créer un utilisateur

## Exemple de requête

```bash
# Connexion
curl -X POST http://localhost:8888/auth/login -d '{"email":"awa@exemple.com","password":"admin123"}' -H "Content-Type: application/json"

# Récupérer la liste des todos (avec le token)
curl -X GET http://localhost:8888/todos -H "Authorization: Bearer <accessToken>"

# Déléguer une tâche à un utilisateur
curl -X POST http://localhost:8888/todos/1/delegate -d '{"userId":2}' -H "Authorization: Bearer <accessToken>" -H "Content-Type: application/json"

# Retirer la délégation d'une tâche
curl -X DELETE http://localhost:8888/todos/1/delegate -d '{"userId":2}' -H "Authorization: Bearer <accessToken>" -H "Content-Type: application/json"

# Créer une tâche avec upload de photo
curl -X POST http://localhost:8888/todos -H "Authorization: Bearer <accessToken>" -F "libelle=Ma tâche" -F "description=Description" -F "photo=@/chemin/vers/image.png"
```

## Dépendances principales

- express
- @prisma/client
- prisma
- typescript
- zod
- bcryptjs
- jsonwebtoken

## Auteur

- Abdourahamane DIALLO
