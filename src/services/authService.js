import { apiClient } from './apiClient.js';
import { API_ENDPOINTS } from '../constants/index.js';
import { setToken, removeToken } from '../utils/tokenUtils.js';

/**
 * Service pour gérer l'authentification
 */
export class AuthService {
  /**
   * Connecte un utilisateur
   * @param {import('../types/auth.js').LoginCredentials} credentials - Identifiants de connexion
   * @returns {Promise<import('../types/auth.js').AuthResponse>} - Réponse d'authentification
   */
  async login(credentials) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    
    if (response.token) {
      setToken(response.token);
    }
    
    return response;
  }

  /**
   * Inscrit un nouvel utilisateur
   * @param {import('../types/auth.js').SignupCredentials} credentials - Données d'inscription
   * @returns {Promise<import('../types/auth.js').AuthResponse>} - Réponse d'authentification
   */
  async signup(credentials) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, credentials);
    
    if (response.token) {
      setToken(response.token);
    }
    
    return response;
  }

  /**
   * Déconnecte l'utilisateur
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.warn('Erreur lors de la déconnexion côté serveur:', error);
    } finally {
      removeToken();
    }
  }
}

// Instance singleton du service d'authentification
export const authService = new AuthService();
export default authService;