import { useState, useCallback } from "react";
import { useTodoContext } from "../../context/useTodoContext";

/**
 * Hook personnalisé pour gérer les opérations sur les todos
 * Principe: Single Responsibility - Isole la logique métier des composants UI
 */
export const useTodoOperations = () => {
  const {
    createTodo: createTodoContext,
    updateTodo: updateTodoContext,
    deleteTodo: deleteTodoContext,
    changeStatus: changeStatusContext,
    delegateTodo: delegateTodoContext,
    removeDelegation: removeDelegationContext,
    fetchTodos,
  } = useTodoContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeOperation = useCallback(async (operation, ...args) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await operation(...args);
      if (!result.success) {
        setError(result.error);
      }
      return result;
    } catch (error) {
      console.error("Erreur operation:", error);
      const errorMessage = "Une erreur inattendue s'est produite";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTodo = useCallback(
    (todoData) => {
      return executeOperation(createTodoContext, todoData);
    },
    [executeOperation, createTodoContext]
  );

  const updateTodo = useCallback(
    (id, todoData) => {
      return executeOperation(updateTodoContext, id, todoData);
    },
    [executeOperation, updateTodoContext]
  );

  const deleteTodo = useCallback(
    (id) => {
      return executeOperation(deleteTodoContext, id);
    },
    [executeOperation, deleteTodoContext]
  );

  const changeStatus = useCallback(
    (id, status) => {
      return executeOperation(changeStatusContext, id, status);
    },
    [executeOperation, changeStatusContext]
  );

  const delegateTodo = useCallback(
    (id, userId) => {
      return executeOperation(delegateTodoContext, id, userId);
    },
    [executeOperation, delegateTodoContext]
  );

  const removeDelegation = useCallback(
    (id) => {
      return executeOperation(removeDelegationContext, id);
    },
    [executeOperation, removeDelegationContext]
  );

  const refreshTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await fetchTodos();
      return { success: true };
    } catch (error) {
      console.error("Erreur refresh:", error);
      const errorMessage = "Erreur lors du rafraîchissement";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [fetchTodos]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createTodo,
    updateTodo,
    deleteTodo,
    changeStatus,
    delegateTodo,
    removeDelegation,
    refreshTodos,

    isLoading,
    error,
    clearError,
  };
};

export default useTodoOperations;
