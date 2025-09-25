import { useState, useEffect, useCallback } from "react";
import { TodoContext } from "./TodoContext";
import { useUserContext } from "./useUserContext";
import { TODO_STATUSES } from "../constants/todoStatuses";

export function TodoProvider({ children }) {
  const { accessToken, user } = useUserContext();
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAllTodos, setShowAllTodos] = useState(false); // Par défaut, seules les tâches de l'utilisateur
  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  const getAuthHeaders = useCallback(
    () => ({
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    }),
    [accessToken]
  );

  const getAuthHeadersMultipart = useCallback(
    () => ({
      Authorization: `Bearer ${accessToken}`,
    }),
    [accessToken]
  );

  // Récupérer l'historique des tâches (notifications)
  const fetchNotifications = useCallback(async () => {
    if (!accessToken || !user?.id) return;
    setIsLoadingNotifications(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8888/todos/${user.id}/history`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        // L'API retourne {message: "...", data: [...]} ou directement un tableau
        const notifArray = responseData.data || responseData;
        setNotifications(Array.isArray(notifArray) ? notifArray : []);
      } else {
        const errorText = await response.text();
        setError(
          `Erreur notifications ${response.status}: ${response.statusText}`
        );
      }
    } catch (err) {
      setError("Impossible de contacter le serveur (notifications)");
    } finally {
      setIsLoadingNotifications(false);
    }
  }, [accessToken, user, getAuthHeaders]);

  // Récupérer tous les todos
  const fetchTodos = useCallback(async () => {
    if (!accessToken) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8888/todos", {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Todos récupérés:", responseData);

        // L'API retourne {message: "...", data: [...]}
        const todosArray = responseData.data || responseData;
        setTodos(Array.isArray(todosArray) ? todosArray : []);
      } else {
        const errorText = await response.text();
        console.error("Erreur serveur:", response.status, errorText);
        setError(`Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setError("Impossible de contacter le serveur");
      console.error("Erreur fetch todos:", err);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, getAuthHeaders]);

  // Récupérer tous les utilisateurs
  const fetchUsers = useCallback(async () => {
    if (!accessToken) return;

    try {
      const response = await fetch("http://localhost:8888/users", {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Utilisateurs récupérés:", responseData);

        // L'API retourne {message: "...", data: [...]}
        const usersArray = responseData.data || responseData;
        setUsers(Array.isArray(usersArray) ? usersArray : []);
        return { success: true, data: usersArray };
      } else {
        const errorText = await response.text();
        console.error("Erreur serveur users:", response.status, errorText);
        return {
          success: false,
          error: `Erreur ${response.status}: ${response.statusText}`,
        };
      }
    } catch (err) {
      console.error("Erreur fetch users:", err);
      return { success: false, error: "Impossible de contacter le serveur" };
    }
  }, [accessToken, getAuthHeaders]);

  // Créer un nouveau todo
  // const createTodo = async (todoData) => {
  //   setError(null);
  //   try {
  //     const formData = new FormData();
  //     formData.append("libelle", todoData.titre);
  //     if (todoData.description) {
  //       formData.append("description", todoData.description);
  //     }
  //     if (todoData.photo) {
  //       formData.append("photo", todoData.photo);
  //     }
  //     console.log("Création todo avec données:", {
  //       libelle: todoData.titre,
  //       description: todoData.description,
  //       hasPhoto: !!todoData.photo,
  //     });
  //     const response = await fetch("http://localhost:8888/todos", {
  //       method: "POST",
  //       headers: getAuthHeadersMultipart(),
  //       body: formData,
  //     });
  //     if (response.ok) {
  //       const responseData = await response.json();
  //       const newTodo = responseData.data || responseData;
  //       setTodos((prev) => [...prev, newTodo]);
  //       // Rafraîchir la liste après ajout
  //       await fetchTodos();
  //       return { success: true, data: newTodo };
  //     } else {
  //       const errorText = await response.text();
  //       let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
  //       try {
  //         const errorData = JSON.parse(errorText);
  //         errorMessage = errorData.message || errorMessage;
  //       } catch {
  //         errorMessage = errorText.includes("<!DOCTYPE")
  //           ? 'Erreur serveur - Vérifiez que le backend attend "libelle" au lieu de "titre"'
  //           : errorText;
  //       }
  //       setError(errorMessage);
  //       return { success: false, error: errorMessage };
  //     }
  //   } catch (err) {
  //     const errorMessage = "Impossible de contacter le serveur " + err;
  //     setError(errorMessage);
  //     return { success: false, error: errorMessage };
  //   }
  // };

  const createTodo = async (todoData) => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append("libelle", todoData.titre);
      if (todoData.description) {
        formData.append("description", todoData.description);
      }
      if (todoData.photo) {
        // Ajoute le nom du fichier si disponible
        formData.append(
          "photo",
          todoData.photo,
          todoData.photo.name || "photo.jpg"
        );
      }
      if (todoData.vocal) {
        // Ajoute le nom du fichier pour le blob ou le fichier
        formData.append(
          "vocal",
          todoData.vocal,
          todoData.vocal.name || "vocal.webm"
        );
      }
      // Ajoute les autres champs si besoin
      if (todoData.dateFin) {
        formData.append("dateFin", todoData.dateFin);
      }
      if (todoData.duree) {
        formData.append("duree", todoData.duree);
      }

      console.log("Création todo avec données:", {
        libelle: todoData.titre,
        description: todoData.description,
        hasPhoto: !!todoData.photo,
        hasVocal: !!todoData.vocal,
      });

      const response = await fetch("http://localhost:8888/todos", {
        method: "POST",
        headers: getAuthHeadersMultipart(),
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        const newTodo = responseData.data || responseData;
        setTodos((prev) => [...prev, newTodo]);
        // Rafraîchir la liste après ajout
        await fetchTodos();
        return { success: true, data: newTodo };
      } else {
        const errorText = await response.text();
        let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText.includes("<!DOCTYPE")
            ? 'Erreur serveur - Vérifiez que le backend attend "libelle" au lieu de "titre"'
            : errorText;
        }
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = "Impossible de contacter le serveur " + err;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };
  // Mettre à jour un todo
  const updateTodo = async (id, todoData) => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append("libelle", todoData.titre);
      if (todoData.description !== undefined) {
        formData.append("description", todoData.description);
      }
      if (todoData.photo) {
        formData.append("photo", todoData.photo);
      }
      const response = await fetch(`http://localhost:8888/todos/${id}`, {
        method: "PUT",
        headers: getAuthHeadersMultipart(),
        body: formData,
      });
      if (response.ok) {
        const responseData = await response.json();
        const updatedTodo = responseData.data || responseData;
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? updatedTodo : todo))
        );
        // Rafraîchir la liste après modification
        await fetchTodos();
        return { success: true, data: updatedTodo };
      } else {
        const errorText = await response.text();
        let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText.includes("<!DOCTYPE")
            ? "Erreur serveur lors de la mise à jour"
            : errorText;
        }
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = "Impossible de contacter le serveur " + err;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Changer le statut d'un todo
  const changeStatus = async (id, status) => {
    setError(null);
    try {
      let endpoint;
      switch (status) {
        case TODO_STATUSES.TERMINEE:
          endpoint = `http://localhost:8888/todos/${id}/terminee`;
          break;
        case TODO_STATUSES.EN_ATTENTE:
          endpoint = `http://localhost:8888/todos/${id}/en-attente`;
          break;
        case TODO_STATUSES.EN_COURS:
          endpoint = `http://localhost:8888/todos/${id}/en-cours`;
          break;
        default:
          return { success: false, error: "Statut invalide" };
      }

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const responseData = await response.json();
        const updatedTodo = responseData.data || responseData;
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? updatedTodo : todo))
        );
        return { success: true, data: updatedTodo };
      } else {
        const errorText = await response.text();
        let errorMessage = `Erreur ${response.status}: ${response.statusText}`;

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText.includes("<!DOCTYPE")
            ? "Erreur serveur lors du changement de statut"
            : errorText;
        }

        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = "Impossible de contacter le serveur";
      setError(errorMessage);
      console.error("Erreur changement statut:", err);
      return { success: false, error: errorMessage };
    }
  };

  // Supprimer un todo
  const deleteTodo = async (id) => {
    setError(null);
    try {
      const response = await fetch(`http://localhost:8888/todos/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
        // Rafraîchir la liste après suppression
        await fetchTodos();
        return { success: true };
      } else {
        const errorText = await response.text();
        let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText.includes("<!DOCTYPE")
            ? "Erreur serveur lors de la suppression"
            : errorText;
        }
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = "Impossible de contacter le serveur " + err;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // // Déléguer un todo
  // const delegateTodo = async (id, userId) => {
  //   setError(null);
  //   try {
  //     const body = JSON.stringify({ userId });

  //     console.log(userId);
  //     const response = await fetch(
  //       `http://localhost:8888/todos/${id}/delegate`,
  //       {
  //         method: "POST",
  //         headers: getAuthHeaders(),
  //         body,
  //       }
  //     );

  //     if (response.ok) {
  //       const responseData = await response.json();
  //       const updatedTodo = responseData.data || responseData;
  //       setTodos((prev) =>
  //         prev.map((todo) => (todo.id === id ? updatedTodo : todo))
  //       );
  //       return { success: true, data: updatedTodo };
  //     } else {
  //       const errorText = await response.text();
  //       let errorMessage = `Erreur ${response.status}: ${response.statusText}`;

  //       try {
  //         const errorData = JSON.parse(errorText);
  //         errorMessage = errorData.message || errorMessage;
  //       } catch {
  //         errorMessage = errorText.includes("<!DOCTYPE")
  //           ? "Erreur serveur lors de la délégation"
  //           : errorText;
  //       }

  //       setError(errorMessage);
  //       return { success: false, error: errorMessage };
  //     }
  //   } catch (err) {
  //     const errorMessage = "Impossible de contacter le serveur";
  //     setError(errorMessage);
  //     console.error("Erreur délégation todo:", err);
  //     return { success: false, error: errorMessage };
  //   }
  // };
  const delegateTodo = async (id, userId) => {
    setError(null);
    try {
      const url = `http://localhost:8888/todos/${id}/delegate`;
      const headers = getAuthHeaders();
      const userIdNumber = typeof userId === "string" ? Number(userId) : userId;
      const body = JSON.stringify({ userId: userIdNumber });
      const response = await fetch(url, {
        method: "POST",
        headers,
        body,
      });
      if (response.ok) {
        const responseData = await response.json();
        const updatedTodo = responseData.data || responseData;
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? updatedTodo : todo))
        );
        // Rafraîchir la liste après délégation
        await fetchTodos();
        return { success: true, data: updatedTodo };
      } else {
        const errorText = await response.text();
        let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText.includes("<!DOCTYPE")
            ? "Erreur serveur lors de la délégation"
            : errorText;
        }
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = "Impossible de contacter le serveur " + err;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // // Supprimer la délégation
  // const removeDelegation = async (id) => {
  //   setError(null);
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8888/todos/${id}/delegate`,
  //       {
  //         method: "DELETE",
  //         headers: getAuthHeaders(),
  //       }
  //     );
  //     if (response.ok) {
  //       const responseData = await response.json();
  //       const updatedTodo = responseData.data || responseData;
  //       setTodos((prev) =>
  //         prev.map((todo) => (todo.id === id ? updatedTodo : todo))
  //       );
  //       // Rafraîchir la liste après suppression de délégation
  //       await fetchTodos();
  //       return { success: true, data: updatedTodo };
  //     } else {
  //       const errorText = await response.text();
  //       let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
  //       try {
  //         const errorData = JSON.parse(errorText);
  //         errorMessage = errorData.message || errorMessage;
  //       } catch {
  //         errorMessage = errorText.includes("<!DOCTYPE")
  //           ? "Erreur serveur lors de la suppression de délégation"
  //           : errorText;
  //       }
  //       setError(errorMessage);
  //       return { success: false, error: errorMessage };
  //     }
  //   } catch (err) {
  //     const errorMessage = "Impossible de contacter le serveur";
  //     setError(errorMessage);
  //     return { success: false, error: errorMessage };
  //   }
  // };

  // Organiser les todos par statut (filtré selon showAllTodos)
  const getFilteredTodos = () => {
    if (!Array.isArray(todos)) return [];

    if (showAllTodos) {
      return todos; // Afficher toutes les tâches
    } else {
      // Afficher seulement les tâches de l'utilisateur connecté
      if (!user?.id) return [];
      return todos.filter(
        (todo) => todo.userId === user.id || todo.user?.id === user.id
      );
    }
  };

  const filteredTodos = getFilteredTodos();

  const todosByStatus = {
    [TODO_STATUSES.EN_COURS]: filteredTodos.filter(
      (todo) => todo.status === TODO_STATUSES.EN_COURS
    ),
    [TODO_STATUSES.EN_ATTENTE]: filteredTodos.filter(
      (todo) => todo.status === TODO_STATUSES.EN_ATTENTE
    ),
    [TODO_STATUSES.TERMINEE]: filteredTodos.filter(
      (todo) => todo.status === TODO_STATUSES.TERMINEE
    ),
  };

  // Organiser les todos par propriétaire (utilisateur connecté vs autres)
  const getCurrentUserTodos = () => {
    if (!Array.isArray(todos) || !user?.id) return [];
    return todos.filter(
      (todo) => todo.userId === user.id || todo.user?.id === user.id
    );
  };

  const getOtherUsersTodos = () => {
    if (!Array.isArray(todos) || !user?.id) return todos;
    return todos.filter(
      (todo) => todo.userId !== user.id && todo.user?.id !== user.id
    );
  };

  // Charger les todos au montage du composant
  useEffect(() => {
    if (accessToken) {
      fetchTodos();
    }
  }, [accessToken, fetchTodos]);

  const contextValue = {
    todos,
    users,
    todosByStatus,
    currentUserTodos: getCurrentUserTodos(),
    otherUsersTodos: getOtherUsersTodos(),
    currentUserId: user?.id,
    showAllTodos,
    setShowAllTodos,
    isLoading,
    error,
    setError,
    fetchTodos,
    fetchUsers,
    createTodo,
    updateTodo,
    changeStatus,
    deleteTodo,
    delegateTodo,
    // removeDelegation,
    TODO_STATUSES,
    notifications,
    isLoadingNotifications,
    fetchNotifications,
  };

  return (
    <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
  );
}
