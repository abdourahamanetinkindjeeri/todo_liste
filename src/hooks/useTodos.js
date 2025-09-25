import { useState } from 'react';
import { todoService } from '../services/index.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/index.js';

/**
 * Hook personnalisé pour gérer les opérations sur les tâches
 * @returns {Object} Objet contenant les fonctions et états des tâches
 */
export const useTodos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Récupère toutes les tâches
   * @param {import('../types/api.js').PaginationParams} params
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  const fetchTodos = async (params = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await todoService.getTodos(params);
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
   * Crée une nouvelle tâche
   * @param {import('../types/todo.js').CreateTodoData} todoData
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  const createTodo = async (todoData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await todoService.createTodo(todoData);
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
   * Met à jour une tâche
   * @param {number} id
   * @param {import('../types/todo.js').UpdateTodoData} todoData
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  const updateTodo = async (id, todoData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await todoService.updateTodo(id, todoData);
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
   * Supprime une tâche
   * @param {number} id
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const deleteTodo = async (id) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await todoService.deleteTodo(id);
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
   * Délègue une tâche
   * @param {number} todoId
   * @param {number} userId
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  const delegateTodo = async (todoId, userId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await todoService.delegateTodo(todoId, userId);
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
   * Retire la délégation d'une tâche
   * @param {number} todoId
   * @param {number} delegationId
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const undelegateTodo = async (todoId, delegationId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await todoService.undelegateTodo(todoId, delegationId);
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
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    delegateTodo,
    undelegateTodo,
    isLoading,
    error,
    clearError,
  };
};