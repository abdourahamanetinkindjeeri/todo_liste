import { apiClient } from './apiClient.js';
import { API_ENDPOINTS } from '../constants/index.js';

/**
 * Service pour gérer les tâches
 */
export class TodoService {
  /**
   * Récupère toutes les tâches
   * @param {import('../types/api.js').PaginationParams} params - Paramètres de pagination
   * @returns {Promise<import('../types/todo.js').Todo[]>} - Liste des tâches
   */
  async getTodos(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.TODOS.BASE, params);
    return response;
  }

  /**
   * Récupère une tâche par son ID
   * @param {number} id - ID de la tâche
   * @returns {Promise<import('../types/todo.js').Todo>} - Tâche
   */
  async getTodoById(id) {
    const response = await apiClient.get(API_ENDPOINTS.TODOS.BY_ID(id));
    return response;
  }

  /**
   * Crée une nouvelle tâche
   * @param {import('../types/todo.js').CreateTodoData} todoData - Données de la tâche
   * @returns {Promise<import('../types/todo.js').Todo>} - Tâche créée
   */
  async createTodo(todoData) {
    const formData = new FormData();
    formData.append('titre', todoData.titre);
    formData.append('description', todoData.description);
    
    if (todoData.photo) {
      formData.append('photo', todoData.photo);
    }

     if (todoData.tempsExecution) {
      formData.append('tempsExecution', todoData.tempsExecution);
    }
    

    const response = await apiClient.post(API_ENDPOINTS.TODOS.BASE, formData);
    return response;
  }

  /**
   * Met à jour une tâche
   * @param {number} id - ID de la tâche
   * @param {import('../types/todo.js').UpdateTodoData} todoData - Données à mettre à jour
   * @returns {Promise<import('../types/todo.js').Todo>} - Tâche mise à jour
   */
  async updateTodo(id, todoData) {
    const formData = new FormData();
    
    if (todoData.titre !== undefined) {
      formData.append('titre', todoData.titre);
    }
    if (todoData.description !== undefined) {
      formData.append('description', todoData.description);
    }
    if (todoData.termine !== undefined) {
      formData.append('termine', todoData.termine.toString());
    }
    if (todoData.photo) {
      formData.append('photo', todoData.photo);
    }

    const response = await apiClient.put(API_ENDPOINTS.TODOS.BY_ID(id), formData);
    return response;
  }

  /**
   * Supprime une tâche
   * @param {number} id - ID de la tâche
   * @returns {Promise<void>}
   */
  async deleteTodo(id) {
    await apiClient.delete(API_ENDPOINTS.TODOS.BY_ID(id));
  }

  /**
   * Délègue une tâche à un utilisateur
   * @param {number} todoId - ID de la tâche
   * @param {number} userId - ID de l'utilisateur à qui déléguer
   * @returns {Promise<import('../types/todo.js').TaskDelegation>} - Délégation créée
   */
  async delegateTodo(todoId, userId) {
    const response = await apiClient.post(API_ENDPOINTS.TODOS.DELEGATE(todoId), {
      delegatedToUserId: userId,
    });
    return response;
  }

  /**
   * Retire la délégation d'une tâche
   * @param {number} todoId - ID de la tâche
   * @param {number} delegationId - ID de la délégation
   * @returns {Promise<void>}
   */
  async undelegateTodo(todoId, delegationId) {
    await apiClient.delete(`${API_ENDPOINTS.TODOS.UNDELEGATE(todoId)}/${delegationId}`);
  }
}

// Instance singleton du service todo
export const todoService = new TodoService();
export default todoService;