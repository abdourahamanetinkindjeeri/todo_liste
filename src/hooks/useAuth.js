import { useState } from 'react';
import { authService } from '../services/index.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/index.js';

/**
 * Hook personnalisé pour gérer l'authentification
 * @returns {Object} Objet contenant les fonctions et états d'authentification
 */
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Connecte un utilisateur
   * @param {import('../types/auth.js').LoginCredentials} credentials
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
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
   * Inscrit un nouvel utilisateur
   * @param {import('../types/auth.js').SignupCredentials} credentials
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  const signup = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.signup(credentials);
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
   * Déconnecte l'utilisateur
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const logout = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.logout();
      setIsLoading(false);
      return { success: true };
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
    login,
    signup,
    logout,
    isLoading,
    error,
    clearError,
  };
};