import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/useTheme.jsx";
import { useTodoContext } from "../../context/useTodoContext.jsx";
import SimpleTodoBoard from "./SimpleTodoBoard.jsx";
import TeamMembersList from "./TeamMembersList.jsx";
import SimpleFloatingActions from "./SimpleFloatingActions.jsx";
import SimpleCreateTodoForm from "./SimpleCreateTodoForm.jsx";
import SimpleEditTodoForm from "./SimpleEditTodoForm.jsx";
import NotificationToast from "../ui/NotificationToast.jsx";

const TodoWorkspace = ({ searchTerm, user, view }) => {
  const { darkMode } = useTheme();
  const { todos, isLoading, error, setError, fetchTodos } = useTodoContext();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [notification, setNotification] = useState(null);
  // ...

  // Sélecteur pour le nombre de todos par page PAR statut
  const [itemsPerStatus, setItemsPerStatus] = useState(() => {
    const saved = localStorage.getItem("todoItemsPerStatus");
    if (saved) return parseInt(saved, 10);
    const vh = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );
    const estimate = Math.max(3, Math.floor((vh - 300) / 120));
    return estimate;
  });

  // Sauvegarder la préférence dans localStorage
  const handleItemsPerStatusChange = (newValue) => {
    setItemsPerStatus(newValue);
    localStorage.setItem("todoItemsPerStatus", newValue.toString());
    setPageByStatus({
      EN_ATTENTE: 1,
      EN_COURS: 1,
      TERMINEE: 1,
    });
  };

  // Filtrage par recherche AVANT pagination
  const filteredTodos = React.useMemo(() => {
    let result = todos;
    if (view === "user" && user) {
      result = todos.filter(
        (todo) => todo.userId === user.id || todo.user?.id === user.id
      );
    }
    if (searchTerm && searchTerm.trim()) {
      result = result.filter(
        (todo) =>
          (todo.titre &&
            todo.titre.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (todo.description &&
            todo.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return result;
  }, [todos, user, searchTerm, view]);

  // Pagination indépendante par colonne/statut
  const [pageByStatus, setPageByStatus] = useState({
    EN_ATTENTE: 1,
    EN_COURS: 1,
    TERMINEE: 1,
  });

  // Réinitialiser la pagination lors d'un changement d'équipe, de vue ou de liste de tâches
  useEffect(() => {
    setPageByStatus({
      EN_ATTENTE: 1,
      EN_COURS: 1,
      TERMINEE: 1,
    });
  }, [user, view, todos]);

  // Filtrage par statut (pour chaque colonne) + pagination indépendante
  const paginatedTodosByStatus = React.useMemo(() => {
    const statusList = ["EN_ATTENTE", "EN_COURS", "TERMINEE"];
    const result = {};
    statusList.forEach((status) => {
      const todosForStatus = filteredTodos.filter(
        (todo) => todo.status === status
      );
      const start = (pageByStatus[status] - 1) * itemsPerStatus;
      const end = start + itemsPerStatus;
      result[status] = todosForStatus.slice(start, end);
    });
    return result;
  }, [filteredTodos, itemsPerStatus, pageByStatus]);

  const showNotification = (type, message) => {
    setNotification({ type, message, id: Date.now() });
  };

  const handleCreateTodo = () => {
    setShowCreateForm(true);
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
  };

  const handleRefresh = async () => {
    await fetchTodos();
    showNotification("success", "Données actualisées");
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  // Gestion du changement de page par colonne
  const handlePageChange = (status, value) => {
    setPageByStatus((prev) => ({ ...prev, [status]: value }));
  };

  return (
    <div className="px-6 pb-8 space-y-6" style={{ height: "100vh" }}>
      {/* Notification */}
      {notification && (
        <NotificationToast
          type={notification.type}
          message={notification.message}
          onClose={handleCloseNotification}
        />
      )}
      {/* Sélecteur du nombre de tâches par statut */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-medium ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Tâches par colonne :
          </span>
          <select
            value={itemsPerStatus}
            onChange={(e) =>
              handleItemsPerStatusChange(parseInt(e.target.value, 10))
            }
            className={`px-3 py-1 rounded-lg border text-sm outline-none ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value={3}>3 tâches</option>
            <option value={5}>5 tâches</option>
            <option value={8}>8 tâches</option>
            <option value={10}>10 tâches</option>
            <option value={15}>15 tâches</option>
          </select>
        </div>
        <div
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          Total : {filteredTodos.length} tâche
          {filteredTodos.length !== 1 ? "s" : ""}
        </div>
      </div>
      {/* Message d'erreur */}
      {error && (
        <div
          className={`p-4 rounded-lg border ${
            darkMode
              ? "bg-red-900/20 border-red-800/30 text-red-400"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
          role="alert"
        >
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className={`ml-4 hover:opacity-70 transition-opacity ${
                darkMode ? "text-red-400" : "text-red-600"
              }`}
              aria-label="Fermer le message d'erreur"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {/* Liste équipe au-dessus du board en mode Équipe */}
      {view === "team" && (
        <TeamMembersList showNotification={showNotification} />
      )}
      {/* Board des tâches toujours affiché */}
      <SimpleTodoBoard
        todos={filteredTodos}
        todosByStatus={paginatedTodosByStatus}
        onEditTodo={handleEditTodo}
        showNotification={showNotification}
        isLoading={isLoading}
        pageByStatus={pageByStatus}
        itemsPerStatus={itemsPerStatus}
        onPageChangeByStatus={handlePageChange}
        filteredTodos={filteredTodos}
      />
      {/* Actions flottantes */}
      <SimpleFloatingActions
        onCreateTodo={handleCreateTodo}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />
      {/* Modal de création */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <SimpleCreateTodoForm
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => {
              setShowCreateForm(false);
              showNotification("success", "Tâche créée avec succès");
            }}
          />
        </div>
      )}
      {/* Modal d'édition */}
      {editingTodo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <SimpleEditTodoForm
            todo={editingTodo}
            onClose={() => setEditingTodo(null)}
            onSuccess={() => {
              setEditingTodo(null);
              showNotification("success", "Tâche modifiée avec succès");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TodoWorkspace;
