import { apiClient } from './apiClient.js';
import { API_ENDPOINTS } from '../constants/index.js';

/**
 * Service pour gérer les utilisateurs
 */
export class UserService {
  /**
   * Récupère le profil de l'utilisateur connecté
   * @returns {Promise<import('../types/auth.js').User>} - Profil utilisateur
   */
  async getProfile() {
    const response = await apiClient.get(API_ENDPOINTS.USERS.PROFILE);
    return response;
  }

  /**
   * Met à jour le profil de l'utilisateur
   * @param {FormData} formData - Données du profil à mettre à jour
   * @returns {Promise<import('../types/auth.js').User>} - Profil utilisateur mis à jour
   */
  async updateProfile(formData) {
    const response = await apiClient.put(API_ENDPOINTS.USERS.PROFILE, formData);
    return response;
  }

  /**
   * Récupère tous les utilisateurs
   * @param {import('../types/api.js').PaginationParams} params - Paramètres de pagination
   * @returns {Promise<import('../types/auth.js').User[]>} - Liste des utilisateurs
   */
  async getUsers(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.USERS.BASE, params);
    return response;
  }

  /**
   * Récupère un utilisateur par son ID
   * @param {number} id - ID de l'utilisateur
   * @returns {Promise<import('../types/auth.js').User>} - Utilisateur
   */
  async getUserById(id) {
    const response = await apiClient.get(API_ENDPOINTS.USERS.BY_ID(id));
    return response;
  }
}

// Instance singleton du service utilisateur
export const userService = new UserService();
export default userService;