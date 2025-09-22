# Documentation technique du projet Todo List

## 1. Introduction

Ce projet est une application de gestion de tâches (Todo List) moderne, développée avec React, Tailwind CSS et une architecture respectant les principes SOLID. Il intègre toutes les fonctionnalités backend nécessaires (CRUD, délégation, authentification).

## 2. Structure du projet

```
├── src/
│   ├── components/
│   │   ├── modern/           # Composants modernes et ultra simples
│   │   ├── ...               # Autres composants (legacy ou utilitaires)
│   ├── context/              # Contextes React (User, Todo, Theme)
│   ├── hooks/                # Hooks personnalisés (useTodoOperations, useUserOperations)
│   ├── utils/                # Fonctions utilitaires (tokenUtils.js)
│   ├── App.jsx               # Point d'entrée principal
│   ├── main.jsx              # Bootstrap React
├── public/                   # Fichiers statiques
├── docs/                     # Documentation technique
```

## 3. Fonctionnement général

- **Authentification** : L'utilisateur doit se connecter pour accéder au dashboard. Le token JWT est stocké dans un cookie sécurisé.
- **Dashboard** : Après connexion, l'utilisateur accède à un tableau Kanban moderne (SimpleDashboard) avec ses tâches et celles de l'équipe.
- **Gestion des tâches** : Création, modification, changement de statut, délégation à un autre utilisateur.
- **Déconnexion** : Supprime le token et redirige vers la page de connexion.

## 4. Principaux composants

- `SimpleDashboard` : Orchestration générale du dashboard.
- `DashboardHeader` : En-tête avec profil, stats, switch équipe/perso.
- `SimpleTodoBoard` : Tableau Kanban ultra simple.
- `SimpleTodoCard` : Carte de tâche, statuts, délégation.
- `UserProfile` : Menu utilisateur, déconnexion.
- `LogoutConfirmModal` : Confirmation de déconnexion.
- `SimpleUserDelegateModal` : Délégation d'une tâche.
- `SimpleUsersWidget` : Liste des membres de l'équipe.

## 5. Contextes et hooks

- `UserProvider` / `useUserContext` : Gestion de l'utilisateur et du token.
- `TodoProvider` / `useTodoContext` : Gestion des tâches et opérations backend.
- `useTodoOperations` / `useUserOperations` : Hooks pour simplifier les appels backend et la logique métier.
- `ThemeProvider` / `useTheme` : Gestion du mode sombre/clair.

## 6. Backend

- L'application communique avec une API REST (ex: http://localhost:8888) pour toutes les opérations (auth, CRUD, users).
- Les tokens JWT sont utilisés pour sécuriser les appels.

## 7. Délégation

- Un utilisateur peut déléguer une tâche à un autre membre de l'équipe via la modale dédiée.
- La délégation est visible sur la carte et peut être retirée.

## 8. Sécurité

- Le token est stocké dans un cookie sécurisé (voir `tokenUtils.js`).
- La déconnexion supprime le token et l'utilisateur du contexte.

## 9. Personnalisation et extension

- Tous les composants modernes sont ultra simples et facilement modifiables.
- Pour ajouter une fonctionnalité, créez un nouveau composant dans `src/components/modern/` et utilisez les hooks/context existants.

## 10. Démarrage rapide

1. Installer les dépendances : `npm install`
2. Lancer le serveur : `npm run dev`
3. Accéder à l'application : [http://localhost:5173](http://localhost:5173)

## 11. Ressources utiles

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

Pour toute question ou amélioration, consultez les fichiers README ou contactez le mainteneur du projet.
