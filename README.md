# Todo API

Une API Node.js/Express pour la gestion de tâches avec Prisma et TypeScript.

## Fonctionnalités

- Authentification JWT (login, refresh)
- CRUD des tâches (Todo)
- Statuts de tâches : EN_ATTENTE, EN_COURS, TERMINEE
- Marquer une tâche comme terminée, en attente ou en cours
- Filtrer les tâches par statut ou par achèvement
- Gestion des utilisateurs (CRUD)
- Restriction d'accès : toutes les routes sauf /auth/login et /auth/refresh nécessitent d'être authentifié

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
- `PUT    /todos/:id` : Modifier une tâche (authentifié, créateur uniquement)
- `DELETE /todos/:id` : Supprimer une tâche (authentifié, créateur uniquement)
- `GET    /users` : Liste des utilisateurs (authentifié)
- `POST   /users` : Créer un utilisateur

## Exemple de requête

```bash
# Connexion
curl -X POST http://localhost:8888/auth/login -d '{"email":"awa@exemple.com","password":"admin123"}' -H "Content-Type: application/json"

# Récupérer la liste des todos (avec le token)
curl -X GET http://localhost:8888/todos -H "Authorization: Bearer <accessToken>"
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
