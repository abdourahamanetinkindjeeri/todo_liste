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

  // Pagination par colonne
  const [pageSizes, setPageSizes] = useState({
    EN_ATTENTE: 3,
    EN_COURS: 3,
    TERMINEE: 3,
  });
  const [pages, setPages] = useState({
    EN_ATTENTE: 1,
    EN_COURS: 1,
    TERMINEE: 1,
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {columns.map((column) => {
        const Icon = column.icon;
        const filteredTodos = filterTodos(column.todos);
        const pageSize = pageSizes[column.status] || 3;
        const page = pages[column.status] || 1;
        const totalPages = Math.max(
          1,
          Math.ceil(filteredTodos.length / pageSize)
        );
        const paginatedTodos = filteredTodos.slice(
          (page - 1) * pageSize,
          page * pageSize
        );
        // Proposer uniquement des tailles <= total
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
              {paginatedTodos.map((todo) => (
                <SimpleTodoCard
                  key={todo.id}
                  todo={todo}
                  onEdit={onEditTodo}
                  showNotification={showNotification}
                />
              ))}
              {paginatedTodos.length === 0 && (
                <div
                  className={`text-center py-8 border-2 border-dashed rounded-xl ${
                    darkMode
                      ? "border-gray-700 text-gray-500"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  <Icon className="mx-auto mb-2" size={24} aria-hidden="true" />
                  <p className="text-sm">Aucune tâche</p>
                </div>
              )}
            </div>
            {/* Pagination controls en bas */}
            {filteredTodos.length > 0 && (
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() =>
                      setPages((p) => ({
                        ...p,
                        [column.status]: Math.max(1, p[column.status] - 1),
                      }))
                    }
                    disabled={page === 1}
                  >
                    Précédent
                  </button>
                  <span className="text-xs">
                    Page {page} / {totalPages}
                  </span>
                  <button
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() =>
                      setPages((p) => ({
                        ...p,
                        [column.status]: Math.min(
                          totalPages,
                          p[column.status] + 1
                        ),
                      }))
                    }
                    disabled={page === totalPages || totalPages === 0}
                  >
                    Suivant
                  </button>
                </div>
                <div>
                  <select
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    value={pageSize}
                    onChange={(e) => {
                      setPageSizes((s) => ({
                        ...s,
                        [column.status]: Number(e.target.value),
                      }));
                      setPages((p) => ({ ...p, [column.status]: 1 }));
                    }}
                  >
                    {sizeOptions.map((size) => (
                      <option key={size} value={size}>
                        {size} / page
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SimpleTodoBoard;
