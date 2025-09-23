import React, { useState } from "react";
import { useTheme } from "../../context/useTheme.jsx";
import { useTodoContext } from "../../context/useTodoContext.jsx";
import SimpleTodoCard from "./SimpleTodoCard.jsx";
import { FiCheckCircle, FiClock, FiTrendingUp, FiInfo } from "react-icons/fi";

/**
 * Tableau Kanban simplifié
 * Principe: Single Responsibility - Affiche uniquement les colonnes de todos
 * @param {Object} props
 * @param {string} props.searchTerm - Terme de recherche pour filtrer les tâches
 * @param {Function} props.onEditTodo - Fonction appelée pour éditer une tâche
 * @param {Function} props.showNotification - Fonction pour afficher une notification
 * @param {boolean} props.isLoading - État de chargement
 */
const SimpleTodoBoard = ({
  searchTerm,
  onEditTodo,
  showNotification,
  isLoading,
}) => {
  const { darkMode } = useTheme();
  const { todosByStatus, TODO_STATUSES } = useTodoContext();

  // Configuration des colonnes
  const columns = [
    {
      status: TODO_STATUSES.EN_ATTENTE,
      title: "À faire",
      icon: FiClock,
      color: "amber",
      todos: todosByStatus[TODO_STATUSES.EN_ATTENTE] || [],
    },
    {
      status: TODO_STATUSES.EN_COURS,
      title: "En cours",
      icon: FiTrendingUp,
      color: "blue",
      todos: todosByStatus[TODO_STATUSES.EN_COURS] || [],
    },
    {
      status: TODO_STATUSES.TERMINEE,
      title: "Terminé",
      icon: FiCheckCircle,
      color: "emerald",
      todos: todosByStatus[TODO_STATUSES.TERMINEE] || [],
    },
  ];

  // Filtrer les todos selon la recherche
  const filterTodos = (todos) => {
    if (!searchTerm) return todos;
    return todos.filter(
      (todo) =>
        todo.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const totalTodos = Object.values(todosByStatus).reduce(
    (acc, todos) => acc + todos.length,
    0
  );

  const defaultPageSize = 3;
  const [pageSizes, setPageSizes] = useState({
    [TODO_STATUSES.EN_ATTENTE]: defaultPageSize,
    [TODO_STATUSES.EN_COURS]: defaultPageSize,
    [TODO_STATUSES.TERMINEE]: defaultPageSize,
  });
  const [pages, setPages] = useState({
    [TODO_STATUSES.EN_ATTENTE]: 1,
    [TODO_STATUSES.EN_COURS]: 1,
    [TODO_STATUSES.TERMINEE]: 1,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div
          className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
            darkMode ? "border-blue-400" : "border-blue-600"
          }`}
          aria-label="Chargement"
        ></div>
      </div>
    );
  }

  if (totalTodos === 0) {
    return (
      <div
        className={`text-center py-12 rounded-xl border ${
          darkMode
            ? "bg-gray-800/30 border-gray-700/50 text-gray-400"
            : "bg-white/50 border-gray-200 text-gray-600"
        }`}
      >
        <FiInfo className="mx-auto mb-4" size={48} aria-hidden="true" />
        <h3
          className={`text-lg font-semibold mb-2 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Aucune tâche pour le moment
        </h3>
        <p>Créez votre première tâche pour commencer</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {columns.map((column) => {
          const Icon = column.icon;
          const filteredTodos = filterTodos(column.todos);
          const pageSize = pageSizes[column.status];
          const page = pages[column.status];
          const totalPages = Math.max(
            1,
            Math.ceil(filteredTodos.length / pageSize)
          );
          const columnPaginatedTodos = filteredTodos.slice(
            (page - 1) * pageSize,
            page * pageSize
          );
          const sizeOptions = [3, 5, 10, 20]
            .filter((size) => size < filteredTodos.length)
            .concat(filteredTodos.length)
            .filter((v, i, arr) => arr.indexOf(v) === i && v > 0);
          return (
            <div key={column.status} className="space-y-4">
              {/* En-tête de colonne */}
              <div
                className={`flex items-center gap-3 p-4 rounded-xl border ${
                  darkMode
                    ? "bg-gray-800/30 border-gray-700/50"
                    : "bg-white/50 border-gray-200"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    column.color === "amber"
                      ? darkMode
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-amber-100 text-amber-600"
                      : column.color === "blue"
                      ? darkMode
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-blue-100 text-blue-600"
                      : darkMode
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  <Icon size={20} aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {column.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {filteredTodos.length} tâche
                    {filteredTodos.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Liste des todos paginée */}
              <div className="space-y-3 min-h-[200px]">
                {columnPaginatedTodos.map((todo) => (
                  <SimpleTodoCard
                    key={todo.id}
                    todo={todo}
                    onEdit={onEditTodo}
                    showNotification={showNotification}
                  />
                ))}
                {columnPaginatedTodos.length === 0 && (
                  <div
                    className={`text-center py-8 border-2 border-dashed rounded-xl ${
                      darkMode
                        ? "border-gray-700 text-gray-500"
                        : "border-gray-300 text-gray-400"
                    }`}
                  >
                    <Icon
                      className="mx-auto mb-2"
                      size={24}
                      aria-hidden="true"
                    />
                    <p className="text-sm">Aucune tâche</p>
                  </div>
                )}
              </div>

              {/* Pagination par colonne */}
              {filteredTodos.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <button
                    className={`px-2 py-1 rounded font-medium text-xs ${
                      darkMode
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    onClick={() =>
                      setPages((prev) => ({
                        ...prev,
                        [column.status]: Math.max(1, page - 1),
                      }))
                    }
                    disabled={page === 1}
                  >
                    Précédent
                  </button>
                  <span className="text-xs font-medium">
                    Page {page} / {totalPages}
                  </span>
                  <button
                    className={`px-2 py-1 rounded font-medium text-xs ${
                      darkMode
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    onClick={() =>
                      setPages((prev) => ({
                        ...prev,
                        [column.status]: Math.min(totalPages, page + 1),
                      }))
                    }
                    disabled={page === totalPages}
                  >
                    Suivant
                  </button>
                  <select
                    className={`px-2 py-1 rounded font-medium text-xs ${
                      darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    value={pageSize}
                    onChange={(e) => {
                      setPageSizes((prev) => ({
                        ...prev,
                        [column.status]: Number(e.target.value),
                      }));
                      setPages((prev) => ({
                        ...prev,
                        [column.status]: 1,
                      }));
                    }}
                  >
                    {sizeOptions.map((size) => (
                      <option key={size} value={size}>
                        {size} / page
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ...pagination globale supprimée... */}
    </div>
  );
};

export default SimpleTodoBoard;
