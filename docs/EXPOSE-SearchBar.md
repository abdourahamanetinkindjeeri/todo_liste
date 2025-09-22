# Exposé technique : composant SearchBar

## 1. Rôle du composant

La `SearchBar` est une barre de recherche ultra simple et moderne, utilisée pour filtrer les tâches dans le dashboard. Elle respecte le principe SOLID de responsabilité unique : elle ne gère que la recherche.

## 2. Fonctionnement

- **Affichage** : Un champ texte avec une icône de loupe à gauche (FiSearch) et une icône de croix à droite (FiX) pour effacer la recherche.
- **Props** :
  - `searchTerm` : la valeur actuelle du champ de recherche
  - `onSearchChange` : fonction appelée à chaque modification du texte
  - `darkMode` : booléen pour adapter le style au mode sombre
- **Interaction** :
  - L’utilisateur tape un mot-clé : la fonction `onSearchChange` est appelée et le parent filtre les tâches.
  - Si le champ n’est pas vide, l’icône croix apparaît pour effacer rapidement la recherche.

## 3. Design et accessibilité

- **Design** :
  - Utilisation de Tailwind CSS pour un style moderne et responsive
  - Couleurs adaptées au mode sombre ou clair
  - Icônes claires pour l’action de recherche et d’effacement
- **Accessibilité** :
  - Champ texte accessible
  - Bouton d’effacement accessible au clavier et à la souris

## 4. Exemple d’utilisation

```jsx
<SearchBar searchTerm={search} onSearchChange={setSearch} darkMode={darkMode} />
```

## 5. Avantages pédagogiques

- Facile à comprendre pour un débutant React
- Séparation claire des responsabilités
- Réutilisable dans d’autres contextes (recherche utilisateur, projet, etc.)

## 6. Points d’amélioration possibles

- Ajouter la gestion du clavier (Enter pour valider, Esc pour effacer)
- Ajouter un debounce pour éviter trop d’appels lors de la saisie
- Afficher le nombre de résultats trouvés

---

Ce composant est un bon exemple de simplicité, efficacité et respect des bonnes pratiques React.
