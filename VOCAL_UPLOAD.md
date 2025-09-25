# API Todo avec Upload Vocal

## Configuration

1. Copier le fichier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

2. Configurer les variables d'environnement dans `.env` :

- `CLOUDINARY_CLOUD_NAME` : Le nom de votre cloud Cloudinary
- `CLOUDINARY_API_KEY` : Votre clé API Cloudinary
- `CLOUDINARY_API_SECRET` : Votre secret API Cloudinary

## Fonctionnalité Upload Vocal

### Créer une tâche avec vocal

**Endpoint** : `POST /api/todos`

**Content-Type** : `multipart/form-data`

**Champs** :

- `libelle` (string, requis) : Titre de la tâche
- `description` (string, optionnel) : Description de la tâche
- `photo` (file, optionnel) : Image de la tâche
- `vocal` (file, optionnel) : Fichier audio (max 30 secondes)

**Formats audio acceptés** :

- MP3 (audio/mpeg)
- WAV (audio/wav)
- OGG (audio/ogg)
- M4A (audio/m4a)
- MP4 (video/mp4)

**Exemple avec cURL** :

```bash
curl -X POST http://localhost:8888/api/todos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "libelle=Ma nouvelle tâche" \
  -F "description=Description de la tâche" \
  -F "vocal=@/path/to/audio.mp3" \
  -F "photo=@/path/to/image.jpg"
```

### Mettre à jour une tâche avec vocal

**Endpoint** : `PUT /api/todos/:id`

**Content-Type** : `multipart/form-data`

Mêmes champs que la création.

### Réponse

```json
{
  "message": "Tache ajoutée avec succès.",
  "todo": {
    "id": 1,
    "libelle": "Ma nouvelle tâche",
    "description": "Description de la tâche",
    "photo": "/public/data/uploads/1234567890_image.jpg",
    "vocal": "https://res.cloudinary.com/yourcloud/video/upload/v1234567890/todos/vocals/vocal_1234567890_123_create.mp3",
    "userId": 123,
    "status": "EN_ATTENTE",
    "estAcheve": false,
    "dateCreation": "2025-09-24T15:00:00.000Z",
    "derniereModif": "2025-09-24T15:00:00.000Z"
  }
}
```

## Gestion des erreurs

### Durée du vocal trop longue

```json
{
  "error": "La durée du fichier dépasse 30 secondes"
}
```

### Format non supporté

```json
{
  "error": "Format audio non supporté. Formats acceptés: MP3, WAV, OGG, M4A, MP4"
}
```

## Architecture du code

### Services

- `CloudinaryService` : Gestion des uploads vers Cloudinary
  - `uploadVocal()` : Upload spécialisé pour les vocaux
  - `deleteFile()` : Suppression de fichiers
  - `extractPublicId()` : Extraction d'ID depuis URL

### Middleware

- `multiUpload` : Gestion des uploads multiples (photo + vocal)
- `handlePhotoUpload` : Traitement spécifique des photos

### Contrôleur

- `create()` : Création avec gestion photo/vocal
- `update()` : Mise à jour avec gestion photo/vocal
- `delete()` : Suppression avec nettoyage Cloudinary
