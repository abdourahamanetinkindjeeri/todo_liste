import { useState } from 'react';
import { userService } from '../services/index.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/index.js';

/**
 * Hook personnalisé pour gérer les utilisateurs
 * @returns {Object} Objet contenant les fonctions et états des utilisateurs
 */
export const useUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Récupère le profil de l'utilisateur connecté
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userService.getProfile();
      setIsLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.SERVER_ERROR;
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Met à jour le profil de l'utilisateur
   * @param {FormData} profileData
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  const updateProfile = async (profileData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userService.updateProfile(profileData);
      setIsLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.SERVER_ERROR;
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Récupère tous les utilisateurs
   * @param {import('../types/api.js').PaginationParams} params
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  const fetchUsers = async (params = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userService.getUsers(params);
      setIsLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.SERVER_ERROR;
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Récupère un utilisateur par son ID
   * @param {number} id
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  const fetchUserById = async (id) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userService.getUserById(id);
      setIsLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.SERVER_ERROR;
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Nettoie les erreurs
   */
  const clearError = () => {
    setError(null);
  };

  return {
    fetchProfile,
    updateProfile,
    fetchUsers,
    fetchUserById,
    isLoading,
    error,
    clearError,
  };
};