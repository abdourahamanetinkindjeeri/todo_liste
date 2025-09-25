/**
 * Messages d'erreur centralisés pour l'application
 */

export const AUTH_ERROR_MESSAGES = {
  // Erreurs de login
  EMAIL_NOT_FOUND:
    "Aucun compte n'est associé à cette adresse email. Vérifiez votre saisie ou créez un compte.",
  PASSWORD_INCORRECT:
    "Mot de passe incorrect. Vérifiez votre saisie ou utilisez 'Mot de passe oublié'.",
  INVALID_CREDENTIALS:
    "Email ou mot de passe incorrect. Vérifiez vos identifiants.",
  INVALID_DATA: "Données de connexion invalides. Vérifiez vos informations.",

  // Erreurs serveur
  SERVER_ERROR:
    "Erreur serveur temporaire. Veuillez réessayer dans quelques instants.",
  NETWORK_ERROR:
    "Impossible de se connecter au serveur. Vérifiez votre connexion internet.",
  NETWORK_RETRY: "Erreur de réseau. Veuillez réessayer.",

  // Erreurs génériques
  LOGIN_FAILED: "Échec de la connexion",
  UNEXPECTED_ERROR: "Une erreur inattendue s'est produite. Veuillez réessayer.",

  // Erreurs de validation
  EMAIL_REQUIRED: "Email requis",
  EMAIL_INVALID: "Format email invalide",
  PASSWORD_REQUIRED: "Mot de passe requis",
  PASSWORD_MIN_LENGTH: "Minimum 6 caractères",

  // Erreurs d'inscription
  SIGNUP_FAILED: "Erreur lors de l'inscription",
  EMAIL_ALREADY_EXISTS:
    "Cette adresse email est déjà utilisée. Essayez de vous connecter ou utilisez une autre adresse.",

  // Messages d'aide
  FORGOT_PASSWORD_HINT:
    "Utilisez le lien 'Mot de passe oublié' si vous ne vous souvenez plus de votre mot de passe.",
  CREATE_ACCOUNT_HINT: "Pas encore de compte ? Créez-en un gratuitement.",
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Connexion réussie ! Redirection en cours...",
  LOGOUT_SUCCESS: "Déconnexion réussie",
  SIGNUP_SUCCESS:
    "Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
};

export default {
  AUTH_ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
