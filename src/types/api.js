/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Indique si la requête a réussi
 * @property {any} data - Les données de la réponse
 * @property {string} [message] - Message d'erreur ou de succès (optionnel)
 */

/**
 * @typedef {Object} ApiError
 * @property {string} message - Le message d'erreur
 * @property {number} [status] - Le code de statut HTTP (optionnel)
 */

/**
 * @typedef {Object} PaginationParams
 * @property {number} [page] - Le numéro de page (optionnel)
 * @property {number} [limit] - Le nombre d'éléments par page (optionnel)
 */

export {};