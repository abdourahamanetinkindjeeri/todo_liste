import React from "react";
import { useTheme } from "../../context/useTheme.jsx";
import SimpleTodoCard from "./SimpleTodoCard.jsx";
import { Info, Plus, Clock, Play, CheckCircle } from "lucide-react";
import Pagination from "@mui/material/Pagination";

/**
 * Tableau Kanban style Quantum
 * Principe: Single Responsibility - Affiche uniquement les colonnes de todos
 * @param {Object} props
 * @param {Array} props.todos - Liste des todos à afficher (déjà paginés)
 * @param {string} props.searchTerm - Terme de recherche pour filtrer les tâches (optionnel)
 * @param {Function} props.onEditTodo - Fonction appelée pour éditer une tâche
 * @param {Function} props.showNotification - Fonction pour afficher une notification
 * @param {boolean} props.isLoading - État de chargement
 */

const TODO_STATUSES = {
  EN_COURS: "EN_COURS",
  EN_ATTENTE: "EN_ATTENTE",
  TERMINEE: "TERMINEE",
};

const SimpleTodoBoard = ({
  todos = [],
  todosByStatus = {},
  onEditTodo,
  showNotification,
  isLoading,
  pageByStatus = {},
  itemsPerStatus = 6,
  onPageChangeByStatus = () => {},
  filteredTodos = [],
}) => {
  const { darkMode } = useTheme();

  const columns = [
    {
      status: TODO_STATUSES.EN_ATTENTE,
      title: TODO_STATUSES.EN_ATTENTE,
      // subtitle: "NEW TASK",
      icon: Clock,
      iconColor: darkMode ? "text-orange-400" : "text-orange-600",
      todos: todosByStatus[TODO_STATUSES.EN_ATTENTE] || [],
    },
    {
      status: TODO_STATUSES.EN_COURS,
      title: TODO_STATUSES.EN_COURS,
      // subtitle: "NEW TASK",
      icon: Play,
      iconColor: darkMode ? "text-blue-400" : "text-blue-600",
      todos: todosByStatus[TODO_STATUSES.EN_COURS] || [],
    },
    {
      status: TODO_STATUSES.TERMINEE,
      title: TODO_STATUSES.TERMINEE,
      // subtitle: "NEW TASK",
      icon: CheckCircle,
      iconColor: darkMode ? "text-green-400" : "text-green-600",
      todos: todosByStatus[TODO_STATUSES.TERMINEE] || [],
    },
  ];

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

  const totalTodos = todos.length;
  if (totalTodos === 0) {
    return (
      <div
        className={`text-center py-12 rounded-xl border ${
          darkMode
            ? "bg-gray-800/30 border-gray-700/50 text-gray-400"
            : "bg-white/50 border-gray-200 text-gray-600"
        }`}
      >
        <Info className="mx-auto mb-4" size={48} aria-hidden="true" />
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
    <div
      className="space-y-6"
      style={{ height: "calc(100vh - 120px)", overflow: "hidden" }}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 h-full">
        {columns.map((column) => {
          const total = filteredTodos.filter(
            (todo) => todo.status === column.status
          ).length;
          const pages = Math.ceil(total / itemsPerStatus);

          return (
            <div
              key={column.status}
              className="flex flex-col h-full"
              style={{ transition: "none", animation: "none" }}
            >
              {/* En-tête de colonne style Quantum compact */}
              <div
                className={`rounded-lg border ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700/50"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <column.icon className={`w-4 h-4 ${column.iconColor}`} />
                      <h3
                        className={`font-semibold text-sm ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {column.title}
                      </h3>
                    </div>
                    {/* <button
                      className={`p-1 rounded hover:bg-gray-100 ${
                        darkMode
                          ? "hover:bg-gray-700 text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </button> */}
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        darkMode
                          ? "bg-blue-600/20 text-blue-400"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {column.subtitle}
                    </span>
                    <span
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {total} tâche{total !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Liste des todos de la colonne (scrollable) */}
              <div className="space-y-3 flex-1 overflow-auto">
                {column.todos.map((todo) => (
                  <SimpleTodoCard
                    key={todo.id}
                    todo={todo}
                    onEdit={onEditTodo}
                    showNotification={showNotification}
                  />
                ))}
                {column.todos.length === 0 && (
                  <div
                    className={`text-center py-8 border-2 border-dashed rounded-xl ${
                      darkMode
                        ? "border-gray-700 text-gray-500"
                        : "border-gray-300 text-gray-400"
                    }`}
                  >
                    <Plus size={20} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucune tâche</p>
                  </div>
                )}
              </div>
              {/* Pagination toujours visible en bas */}
              {pages > 1 && (
                <div
                  className="flex justify-center mt-2 mb-2"
                  style={{ transition: "none", animation: "none" }}
                >
                  <Pagination
                    count={pages}
                    page={pageByStatus[column.status] || 1}
                    onChange={(_, value) =>
                      onPageChangeByStatus(column.status, value)
                    }
                    color="primary"
                    size="small"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    sx={{
                      transition: "none",
                      animation: "none",
                      "& .MuiPaginationItem-root": {
                        color: darkMode ? "#e5e7eb" : "#374151",
                        transition: "none",
                        animation: "none",
                        "&.Mui-selected": {
                          backgroundColor: darkMode ? "#3b82f6" : "#3b82f6",
                          color: "white",
                          transition: "none",
                          animation: "none",
                        },
                        "&:hover": {
                          backgroundColor: darkMode ? "#374151" : "#f3f4f6",
                          transition: "none",
                          animation: "none",
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimpleTodoBoard;
