/**
 * @typedef {Object} Todo
 * @property {number} id - L'identifiant unique de la tâche
 * @property {string} titre - Le titre de la tâche
 * @property {string} description - La description de la tâche
 * @property {boolean} termine - Le statut de completion
 * @property {string} [photo] - L'URL de la photo (optionnel)
 * @property {string} createdAt - Date de création
 * @property {string} updatedAt - Date de dernière modification
 * @property {number} userId - L'identifiant du propriétaire
 * @property {User} [user] - Les données du propriétaire (optionnel)
 * @property {TaskDelegation[]} [delegations] - Les délégations (optionnel)
 */

/**
 * @typedef {Object} CreateTodoData
 * @property {string} titre - Le titre de la tâche
 * @property {string} description - La description de la tâche
 * @property {File} [photo] - Le fichier photo (optionnel)
 */

/**
 * @typedef {Object} UpdateTodoData
 * @property {string} [titre] - Le titre de la tâche (optionnel)
 * @property {string} [description] - La description de la tâche (optionnel)
 * @property {boolean} [termine] - Le statut de completion (optionnel)
 * @property {File} [photo] - Le fichier photo (optionnel)
 */

/**
 * @typedef {Object} TaskDelegation
 * @property {number} id - L'identifiant de la délégation
 * @property {number} todoId - L'identifiant de la tâche
 * @property {number} delegatedToUserId - L'identifiant de l'utilisateur délégué
 * @property {string} createdAt - Date de création
 * @property {User} [delegatedToUser] - Les données de l'utilisateur délégué (optionnel)
 */

export {};