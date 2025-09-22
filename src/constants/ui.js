// Thèmes disponibles
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Configuration du thème par défaut
export const DEFAULT_THEME = THEMES.LIGHT;

// Classes CSS pour les thèmes
export const THEME_CLASSES = {
  [THEMES.LIGHT]: 'bg-white text-gray-900',
  [THEMES.DARK]: 'bg-gray-900 text-white',
};

// Messages de notification
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Durée d'affichage des notifications (en millisecondes)
export const NOTIFICATION_DURATION = 3000;

// Configuration des tailles
export const SIZES = {
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg',
};

// Configuration des couleurs
export const COLORS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};