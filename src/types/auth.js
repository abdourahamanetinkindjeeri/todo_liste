/**
 * @typedef {Object} User
 * @property {number} id - L'identifiant unique de l'utilisateur
 * @property {string} username - Le nom d'utilisateur
 * @property {string} email - L'adresse email
 * @property {string} [photo] - L'URL de la photo de profil (optionnel)
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email - L'adresse email
 * @property {string} password - Le mot de passe
 */

/**
 * @typedef {Object} SignupCredentials
 * @property {string} username - Le nom d'utilisateur
 * @property {string} email - L'adresse email
 * @property {string} password - Le mot de passe
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token - Le token JWT
 * @property {User} user - Les données de l'utilisateur
 */

export {};