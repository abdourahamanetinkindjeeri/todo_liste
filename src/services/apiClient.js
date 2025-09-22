import { API_BASE_URL, ERROR_MESSAGES } from '../constants/index.js';
import { getToken } from '../utils/tokenUtils.js';

/**
 * Configuration de base pour les requêtes API
 */
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Effectue une requête HTTP
   * @param {string} endpoint - L'endpoint de l'API
   * @param {Object} options - Options de la requête
   * @returns {Promise<any>} - La réponse de l'API
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Ajouter le token d'authentification si disponible
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(this.getErrorMessage(response.status));
      }

      // Vérifier si la réponse contient du JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(ERROR_MESSAGES.NETWORK);
      }
      throw error;
    }
  }

  /**
   * Effectue une requête GET
   * @param {string} endpoint - L'endpoint de l'API
   * @param {Object} params - Paramètres de requête
   * @returns {Promise<any>} - La réponse de l'API
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * Effectue une requête POST
   * @param {string} endpoint - L'endpoint de l'API
   * @param {any} data - Données à envoyer
   * @param {Object} options - Options supplémentaires
   * @returns {Promise<any>} - La réponse de l'API
   */
  async post(endpoint, data = null, options = {}) {
    const config = {
      method: 'POST',
      ...options,
    };

    if (data instanceof FormData) {
      // Pour FormData, ne pas définir Content-Type (laissé au navigateur)
      delete config.headers?.['Content-Type'];
      config.body = data;
    } else if (data) {
      config.body = JSON.stringify(data);
    }

    return this.request(endpoint, config);
  }

  /**
   * Effectue une requête PUT
   * @param {string} endpoint - L'endpoint de l'API
   * @param {any} data - Données à envoyer
   * @param {Object} options - Options supplémentaires
   * @returns {Promise<any>} - La réponse de l'API
   */
  async put(endpoint, data = null, options = {}) {
    const config = {
      method: 'PUT',
      ...options,
    };

    if (data instanceof FormData) {
      delete config.headers?.['Content-Type'];
      config.body = data;
    } else if (data) {
      config.body = JSON.stringify(data);
    }

    return this.request(endpoint, config);
  }

  /**
   * Effectue une requête DELETE
   * @param {string} endpoint - L'endpoint de l'API
   * @returns {Promise<any>} - La réponse de l'API
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * Retourne le message d'erreur approprié selon le code de statut
   * @param {number} status - Code de statut HTTP
   * @returns {string} - Message d'erreur
   */
  getErrorMessage(status) {
    switch (status) {
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 422:
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return ERROR_MESSAGES.SERVER_ERROR;
    }
  }
}

// Instance singleton du client API
export const apiClient = new ApiClient();
export default apiClient;