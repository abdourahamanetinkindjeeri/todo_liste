# Exposé technique : Les composants du projet Todo List

## 1. Introduction

Les composants sont les briques de base de l’interface React. Dans ce projet, chaque composant a une responsabilité unique et respecte les bonnes pratiques pour être simple, réutilisable et compréhensible par un débutant.

## 2. Catégories de composants

- **Composants modernes** : ultra simples, dans `src/components/modern/`
- **Composants utilitaires** : modales, widgets, etc.
- **Composants contextuels** : liés à la gestion d’état (User, Todo, Theme)

## 3. Principaux composants modernes

### SimpleDashboard

- Orchestration générale du dashboard.
- Regroupe l’en-tête, le tableau de tâches et le layout.

### DashboardHeader

- Affiche le titre, le profil utilisateur, les stats et le switch équipe/perso.

### SimpleTodoBoard

- Tableau Kanban ultra simple : colonnes par statut, affichage des tâches.

### SimpleTodoCard

- Carte de tâche : titre, description, statut, délégation, actions.
- Ultra simple, sans complexité inutile.

### UserProfile

- Menu utilisateur : avatar, nom, email, bouton déconnexion.

### LogoutConfirmModal

- Modale de confirmation pour la déconnexion.

### SimpleUserDelegateModal

- Modale pour déléguer une tâche à un autre utilisateur.

### SimpleUsersWidget

- Affiche la liste des membres de l’équipe.

### TodoStatusButtons & TodoStatusBar

- Boutons et barre visuelle pour changer le statut d’une tâche.

### SearchBar

- Barre de recherche pour filtrer les tâches.

## 4. Composants utilitaires

- **Modales** : DeleteConfirmModal, RemoveDelegateConfirmModal
- **Widgets** : NotificationToast, QuickActionsWidget, StatsWidget

## 5. Architecture et bonnes pratiques

- **Single Responsibility** : chaque composant fait une seule chose
- **Props claires** : passage des données et callbacks par props
- **Hooks personnalisés** : pour la logique métier (useTodoOperations, useUserOperations)
- **Context API** : pour partager l’état utilisateur, tâches, thème

## 6. Exemple d’utilisation

```jsx
<SimpleTodoCard
  todo={todo}
  showNotification={showNotification}
  darkMode={darkMode}
/>
```

## 7. Avantages pédagogiques

- Code facile à lire et à modifier
- Composants réutilisables
- Architecture évolutive
- Idéal pour apprendre React et la gestion d’état

---

Pour chaque composant, consultez le code source et la documentation technique pour comprendre son rôle et son fonctionnement.
