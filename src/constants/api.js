// Configuration de l'API
export const API_BASE_URL = "http://localhost:8888";

// Endpoints de l'API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    LOGOUT: "/auth/logout",
  },
  USERS: {
    BASE: "/users",
    PROFILE: "/users/profile",
    BY_ID: (id) => `/users/${id}`,
  },
  TODOS: {
    BASE: "/todos",
    BY_ID: (id) => `/todos/${id}`,
    DELEGATE: (id) => `/todos/${id}/delegate`,
    UNDELEGATE: (id) => `/todos/${id}/undelegate`,
    BADGE: (id) => `/todos/${id}/history`,
  },
};

// Messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK: "Erreur de connexion réseau",
  UNAUTHORIZED: "Non autorisé",
  FORBIDDEN: "Accès interdit",
  NOT_FOUND: "Ressource non trouvée",
  SERVER_ERROR: "Erreur serveur",
  VALIDATION_ERROR: "Erreur de validation",
  TOKEN_EXPIRED: "Session expirée",
};

// Messages de succès
export const SUCCESS_MESSAGES = {
  LOGIN: "Connexion réussie",
  SIGNUP: "Inscription réussie",
  LOGOUT: "Déconnexion réussie",
  TODO_CREATED: "Tâche créée avec succès",
  TODO_UPDATED: "Tâche mise à jour avec succès",
  TODO_DELETED: "Tâche supprimée avec succès",
  TODO_DELEGATED: "Tâche déléguée avec succès",
  TODO_UNDELEGATED: "Délégation retirée avec succès",
};

// Configuration des cookies
export const COOKIE_CONFIG = {
  MAX_AGE: 3600, // 1 heure en secondes
  SECURE: true,
  SAME_SITE: "Strict",
  PATH: "/",
};
