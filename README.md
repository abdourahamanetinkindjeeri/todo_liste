# Todo API

Une API Node.js/Express pour la gestion de tâches avec Prisma et TypeScript.

## Fonctionnalités

- CRUD des tâches (Todo)
- Statuts de tâches : EN_ATTENTE, EN_COURS, TERMINEE
- Marquer une tâche comme terminée, en attente ou en cours
- Filtrer les tâches par statut ou par achèvement

## Installation

```bash
npm install
```

## Configuration

- Configurez la base de données dans `.env` (voir `DATABASE_URL`)
- Modifiez le schéma Prisma dans `prisma/schema.prisma` si besoin

## Migration et génération Prisma

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Lancement du serveur

```bash
npm run watch
```

## Endpoints principaux

- `POST   /todos` : Créer une tâche
- `GET    /todos` : Liste toutes les tâches
- `GET    /todos/not-acheve` : Liste des tâches non achevées
- `GET    /todos/status/:status` : Liste des tâches par statut
- `PUT    /todos/:id/terminee` : Marquer comme terminée
- `PUT    /todos/:id/en-attente` : Marquer comme en attente
- `PUT    /todos/:id/en-cours` : Marquer comme en cours
- `PUT    /todos/:id` : Modifier une tâche
- `DELETE /todos/:id` : Supprimer une tâche

## Exemple de requête

```bash
curl -X PUT http://localhost:8888/todos/1/terminee
```

## Dépendances principales

- express
- @prisma/client
- prisma
- typescript
- zod

## Auteur

- Abdourahamane DIALLO
