# 🚨 Guide de Dépannage - Todo List App

## Problèmes courants et solutions

### 1. **Erreur 500 (Internal Server Error)**

```
POST http://localhost:8888/todos 500 (Internal Server Error)
```

**Causes possibles :**

- ✅ Le serveur backend n'est pas démarré
- ✅ Problème de configuration de la base de données
- ✅ Erreur dans le code backend

**Solutions :**

1. **Démarrer le serveur backend :**

   ```bash
   cd votre-dossier-backend
   npm start
   # ou
   npm run dev
   ```

2. **Vérifier les logs du serveur backend** pour voir l'erreur exacte

3. **Tester l'API manuellement :**
   ```bash
   curl http://localhost:8888/todos
   ```

### 2. **Erreur de parsing JSON (HTML reçu)**

```
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

**Cause :** Le serveur retourne une page d'erreur HTML au lieu de JSON

**Solutions :**

1. **Vérifier que le serveur backend fonctionne :**

   - Ouvrir http://localhost:8888 dans le navigateur
   - Vous devriez voir une réponse JSON ou API, pas une page d'erreur

2. **Vérifier les CORS :**
   - Le backend doit accepter les requêtes depuis http://localhost:5173

### 3. **Aucune tâche affichée après connexion**

**Vérifications :**

1. **Token d'authentification :**

   - Ouvrir les DevTools > Application > Cookies
   - Vérifier la présence du cookie `accessToken`

2. **ID utilisateur :**

   - Dans l'interface, vérifier que "Utilisateur connecté ID" n'est pas "Non défini"

3. **Requêtes réseau :**
   - DevTools > Network
   - Vérifier que GET /todos retourne bien des données

### 4. **Configuration Backend Requise**

Votre backend doit avoir ces endpoints configurés :

```javascript
// CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Endpoints nécessaires
GET    /todos              // Récupérer tous les todos
POST   /todos              // Créer un todo (avec upload)
PUT    /todos/:id          // Modifier un todo
DELETE /todos/:id          // Supprimer un todo
PUT    /todos/:id/terminee // Changer statut
PUT    /todos/:id/en-cours // Changer statut
PUT    /todos/:id/en-attente // Changer statut
POST   /auth/login         // Connexion
POST   /users              // Inscription
```

### 5. **Base de données**

Vérifier que votre base de données contient :

- Table `users` avec colonnes : id, nom, prenom, email, password
- Table `todos` avec colonnes : id, titre, description, photo, status, userId, createdAt, updatedAt
- Relation : `todos.userId` → `users.id`

### 6. **Authentification**

Le token JWT doit contenir :

```json
{
  "id": 123, // ID de l'utilisateur
  "email": "...",
  "exp": 1234567890 // Timestamp d'expiration
}
```

### 7. **Upload de fichiers**

Pour l'upload de photos, vérifier :

- Middleware `multer` configuré sur le backend
- Dossier `public/data/uploads/` existant et accessible
- Headers `multipart/form-data` acceptés

---

## 🔧 Commandes de debug utiles

### Frontend (React)

```bash
# Démarrer en mode développement
npm run dev

# Vérifier les dépendances
npm install
```

### Backend (Node.js)

```bash
# Démarrer le serveur
npm start

# Logs détaillés
DEBUG=* npm start

# Vérifier les dépendances
npm install
```

### Base de données

```bash
# Migrations Prisma
npx prisma migrate dev

# Reset de la DB
npx prisma migrate reset

# Générer le client
npx prisma generate
```

---

## 📞 Test rapide de l'API

```bash
# Test de base
curl http://localhost:8888

# Test authentification
curl -X POST http://localhost:8888/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "password"}'

# Test récupération todos (avec token)
curl http://localhost:8888/todos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Si ces commandes ne fonctionnent pas, le problème vient du backend, pas du frontend.
