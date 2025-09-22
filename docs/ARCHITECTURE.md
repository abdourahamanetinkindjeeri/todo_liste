# Architecture Clean du Projet Todo List

Ce projet a été restructuré selon les principes de la Clean Architecture pour améliorer la maintenabilité, la testabilité et la séparation des responsabilités.

## 📁 Structure du Projet

```
src/
├── components/           # Composants réutilisables
│   ├── ui/              # Composants UI de base (Button, Input, Modal, etc.)
│   └── common/          # Composants partagés (TodoWorkspace, SearchBar, etc.)
├── features/            # Fonctionnalités métier
│   ├── auth/           # Authentification (LoginPage, SignupPage)
│   ├── dashboard/      # Dashboard (Header, Stats, UserProfile)
│   └── profile/        # Profil utilisateur
├── hooks/              # Custom hooks
├── services/           # Logique métier et API
├── utils/              # Fonctions utilitaires
├── types/              # Types TypeScript/JSDoc
├── constants/          # Constantes
└── assets/             # Images, fonts, etc.
```

## 🏗️ Principes Architecturaux

### 1. Single Responsibility Principle (SRP)
Chaque composant, service et hook a une responsabilité unique et bien définie.

### 2. Dependency Inversion
Les couches de haut niveau ne dépendent pas des couches de bas niveau. Les services sont injectés via des hooks.

### 3. Separation of Concerns
- **Components** : Affichage et interaction utilisateur
- **Services** : Logique métier et appels API
- **Hooks** : État local et logique de présentation
- **Utils** : Fonctions utilitaires pures

## 📦 Couches de l'Architecture

### 🎨 Couche Présentation (UI)
- **Components/UI** : Composants réutilisables (Button, Input, Modal)
- **Components/Common** : Composants partagés métier
- **Features** : Pages et fonctionnalités spécifiques

### 🔧 Couche Application (Hooks)
- **Custom Hooks** : Gestion de l'état et logique de présentation
- **useAuth**, **useTodos**, **useUsers** : Hooks métier

### 🏢 Couche Business (Services)
- **Services** : Logique métier et appels API
- **AuthService**, **TodoService**, **UserService**

### 🗄️ Couche Infrastructure
- **ApiClient** : Client HTTP configuré
- **Utils** : Fonctions utilitaires (tokenUtils, etc.)

## 🔄 Flux de Données

```
UI Component → Hook → Service → API
     ↑                           ↓
     ←─── State Update ←─── Response
```

## 📚 Exemples d'Utilisation

### Composant avec Hook
```jsx
import { useAuth } from '../hooks/useAuth.js';
import { Button } from '../components/ui/Button.jsx';

const LoginForm = () => {
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (credentials) => {
    const result = await login(credentials);
    if (result.success) {
      // Redirection
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
      <Button loading={isLoading} type="submit">
        Se connecter
      </Button>
    </form>
  );
};
```

### Service
```javascript
import { apiClient } from './apiClient.js';

export class AuthService {
  async login(credentials) {
    return await apiClient.post('/auth/login', credentials);
  }
}
```

## 🛠️ Bonnes Pratiques

### 1. Composants
- Un composant = une responsabilité
- Props typées avec JSDoc
- Composition plutôt qu'héritage
- Accessibilité (ARIA) incluse

### 2. Hooks
- Logique réutilisable extraite
- État local géré proprement
- Nettoyage des effets de bord

### 3. Services
- Séparation API/logique métier
- Gestion d'erreurs centralisée
- Interface consistante

### 4. Types
- Documentation des données avec JSDoc
- Types d'entrée/sortie définis
- Validation des paramètres

## 🔧 Configuration

### Constants
Toutes les constantes sont centralisées dans `src/constants/` :
- **api.js** : URLs, endpoints, messages
- **ui.js** : Thèmes, couleurs, tailles

### Services
Configuration centralisée dans `src/services/apiClient.js` :
- Base URL
- Headers par défaut
- Intercepteurs d'erreur

## 🧪 Tests (À venir)
```
src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── utils/
```

## 🚀 Avantages de cette Architecture

1. **Maintenabilité** : Code organisé et prévisible
2. **Testabilité** : Chaque couche testable indépendamment
3. **Réutilisabilité** : Composants et hooks réutilisables
4. **Évolutivité** : Ajout de fonctionnalités facilité
5. **Lisibilité** : Structure claire et documentée

## 🔄 Migration Graduelle

L'ancienne structure coexiste avec la nouvelle pour permettre une migration progressive :
- Nouveaux composants dans la nouvelle structure
- Refactoring graduel des anciens composants
- Tests pour valider le comportement

## 📖 Documentation Supplémentaire

- [Composants UI](./docs/UI_COMPONENTS.md)
- [Services API](./docs/API_SERVICES.md)
- [Hooks Personnalisés](./docs/CUSTOM_HOOKS.md)
- [Guide de Contribution](./docs/CONTRIBUTING.md)