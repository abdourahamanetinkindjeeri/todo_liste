/**
 * Constantes pour les statuts des tâches
 * Correspond exactement à l'enum Statut de la base de données
 */
export const TODO_STATUSES = {
  EN_ATTENTE: "EN_ATTENTE",
  EN_COURS: "EN_COURS",
  TERMINEE: "TERMINEE",
};

/**
 * Labels d'affichage pour les statuts
 */
export const TODO_STATUS_LABELS = {
  [TODO_STATUSES.EN_ATTENTE]: "En Attente",
  [TODO_STATUSES.EN_COURS]: "En Cours",
  [TODO_STATUSES.TERMINEE]: "Terminée",
};

/**
 * Couleurs des statuts pour l'affichage
 */
export const TODO_STATUS_COLORS = {
  [TODO_STATUSES.EN_ATTENTE]: {
    bg: "rgba(255, 193, 7, 0.3)",
    text: "#ffc107",
    border: "rgba(255, 193, 7, 0.5)",
  },
  [TODO_STATUSES.EN_COURS]: {
    bg: "rgba(76, 175, 80, 0.3)",
    text: "#4caf50",
    border: "rgba(76, 175, 80, 0.5)",
  },
  [TODO_STATUSES.TERMINEE]: {
    bg: "rgba(76, 175, 80, 0.3)",
    text: "#4caf50",
    border: "rgba(76, 175, 80, 0.5)",
  },
};

/**
 * Ordre des statuts pour l'affichage
 */
export const TODO_STATUS_ORDER = [
  TODO_STATUSES.EN_ATTENTE,
  TODO_STATUSES.EN_COURS,
  TODO_STATUSES.TERMINEE,
];
