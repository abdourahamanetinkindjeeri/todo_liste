import { TODO_STATUSES } from "../constants/todoStatuses";

/**
 * Utilitaires pour la gestion des statuts de tâches
 * Permet la conversion entre différents formats de statuts
 */

/**
 * Convertit un booléen 'termine' en statut enum
 * @param {boolean} termine - Le statut booléen
 * @returns {string} Le statut enum correspondant
 */
export const booleanToStatus = (termine) => {
  return termine ? TODO_STATUSES.TERMINEE : TODO_STATUSES.EN_ATTENTE;
};

/**
 * Convertit un statut enum en booléen 'termine'
 * @param {string} status - Le statut enum
 * @returns {boolean} Le statut booléen correspondant
 */
export const statusToBoolean = (status) => {
  return status === TODO_STATUSES.TERMINEE;
};

/**
 * Normalise un objet todo pour s'assurer qu'il ait les bonnes propriétés de statut
 * @param {Object} todo - L'objet todo à normaliser
 * @returns {Object} L'objet todo normalisé
 */
export const normalizeTodoStatus = (todo) => {
  if (!todo) return todo;

  const normalized = { ...todo };

  // Si on a 'statut' mais pas 'termine'
  if (normalized.statut && normalized.termine === undefined) {
    normalized.termine = statusToBoolean(normalized.statut);
  }

  // Si on a 'termine' mais pas 'statut'
  if (normalized.termine !== undefined && !normalized.statut) {
    normalized.statut = booleanToStatus(normalized.termine);
  }

  // Si on a 'status' au lieu de 'statut' (normalisation des noms de champs)
  if (normalized.status && !normalized.statut) {
    normalized.statut = normalized.status;
  }

  // Si on a 'title' ou 'titre' mais pas 'libelle'
  if ((normalized.title || normalized.titre) && !normalized.libelle) {
    normalized.libelle = normalized.title || normalized.titre;
  }

  return normalized;
};

/**
 * Valide si un statut est valide
 * @param {string} status - Le statut à valider
 * @returns {boolean} True si le statut est valide
 */
export const isValidStatus = (status) => {
  return Object.values(TODO_STATUSES).includes(status);
};

/**
 * Obtient le prochain statut logique dans le workflow
 * @param {string} currentStatus - Le statut actuel
 * @returns {string} Le prochain statut logique
 */
export const getNextStatus = (currentStatus) => {
  switch (currentStatus) {
    case TODO_STATUSES.EN_ATTENTE:
      return TODO_STATUSES.EN_COURS;
    case TODO_STATUSES.EN_COURS:
      return TODO_STATUSES.TERMINEE;
    case TODO_STATUSES.TERMINEE:
      return TODO_STATUSES.EN_ATTENTE;
    default:
      return TODO_STATUSES.EN_ATTENTE;
  }
};

/**
 * Obtient le statut précédent dans le workflow
 * @param {string} currentStatus - Le statut actuel
 * @returns {string} Le statut précédent
 */
export const getPreviousStatus = (currentStatus) => {
  switch (currentStatus) {
    case TODO_STATUSES.EN_COURS:
      return TODO_STATUSES.EN_ATTENTE;
    case TODO_STATUSES.TERMINEE:
      return TODO_STATUSES.EN_COURS;
    case TODO_STATUSES.EN_ATTENTE:
      return TODO_STATUSES.TERMINEE;
    default:
      return TODO_STATUSES.EN_ATTENTE;
  }
};
