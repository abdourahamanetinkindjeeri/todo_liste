import { useState, useCallback } from "react";
import { useTodoContext } from "../context/useTodoContext";

/**
 * Hook personnalisé pour gérer les opérations sur les utilisateurs
 * Principe: Single Responsibility - Isole la logique des utilisateurs
 */
export const useUserOperations = () => {
  const { fetchUsers, users } = useTodoContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadUsers = useCallback(async () => {
    if (users.length > 0) return { success: true, data: users };

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchUsers();
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error || "Erreur lors du chargement des utilisateurs");
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error);
      const errorMessage = "Erreur lors du chargement des utilisateurs";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsers, users]);

  const getUserById = useCallback(
    (userId) => {
      return users.find((user) => user.id === userId);
    },
    [users]
  );

  const getUserDisplayName = useCallback((user) => {
    if (!user) return "Utilisateur inconnu";

    if (user.prenom && user.nom) {
      return `${user.prenom} ${user.nom}`;
    }
    return user.username || user.email || "Utilisateur";
  }, []);

  const getUserInitials = useCallback((user) => {
    if (!user) return "U";

    if (user.prenom && user.nom) {
      return `${user.prenom[0]}${user.nom[0]}`.toUpperCase();
    }
    if (user.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  }, []);

  const searchUsers = useCallback(
    (searchTerm) => {
      if (!searchTerm) return users;

      const term = searchTerm.toLowerCase();
      return users.filter(
        (user) =>
          user.prenom?.toLowerCase().includes(term) ||
          user.nom?.toLowerCase().includes(term) ||
          user.username?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term)
      );
    },
    [users]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // États
    users,
    isLoading,
    error,

    loadUsers,
    getUserById,
    getUserDisplayName,
    getUserInitials,
    searchUsers,
    clearError,
  };
};

export default useUserOperations;
