import React, { useState } from "react";
import { useTodoContext } from "../context/useTodoContext";
import { useUserContext } from "../context/useUserContext";
import ModernTodoCard from "./ModernTodoCard";
import { FiPlus, FiMoreVertical } from "react-icons/fi";

const ModernTodoColumn = ({
  status,
  title,
  todos,
  gradient,
  icon: Icon,
  darkMode,
  viewMode,
  onEdit,
  searchTerm,
  filterStatus,
  filterUser,
  showNotification,
}) => {
  const { createTodo, changeStatus, TODO_STATUSES } = useTodoContext();
  const { user } = useUserContext();
  const [isDragging, setIsDragging] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickTodo, setQuickTodo] = useState("");

  // Filtrer les todos selon les critères
  const filteredTodos = todos.filter((todo) => {
    // Filtre par terme de recherche
    if (
      searchTerm &&
      !todo.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !todo.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filtre par statut
    if (filterStatus !== "all" && todo.status !== filterStatus) {
      return false;
    }

    // Filtre par utilisateur
    if (
      filterUser === "me" &&
      todo.userId !== user?.id &&
      todo.user?.id !== user?.id
    ) {
      return false;
    }
    if (
      filterUser === "others" &&
      (todo.userId === user?.id || todo.user?.id === user?.id)
    ) {
      return false;
    }

    return true;
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Ne désactiver le dragging que si on quitte vraiment la zone
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    try {
      const todoId = e.dataTransfer.getData("text/plain");

      // Récupérer les données supplémentaires si disponibles
      let todoData = null;
      try {
        const jsonData = e.dataTransfer.getData("application/json");
        todoData = jsonData ? JSON.parse(jsonData) : null;
      } catch {
        // Ignore les erreurs de parsing JSON
      }

      const result = await changeStatus(parseInt(todoId), status);

      if (result.success) {
        const todoTitle = todoData?.title || `Tâche #${todoId}`;
        showNotification("success", `"${todoTitle}" déplacée vers ${title}`);
      } else {
        showNotification("error", result.error || "Erreur lors du déplacement");
      }
    } catch {
      showNotification("error", "Erreur lors du déplacement de la tâche");
    }
  };

  const handleQuickAdd = async () => {
    if (!quickTodo.trim()) return;

    try {
      const result = await createTodo({
        titre: quickTodo,
        description: "",
      });

      if (result.success) {
        // Changer le statut vers cette colonne si nécessaire
        if (status !== TODO_STATUSES.EN_ATTENTE) {
          await changeStatus(result.data.id, status);
        }
        setQuickTodo("");
        setShowQuickAdd(false);
        showNotification("success", "Tâche créée avec succès");
      } else {
        showNotification("error", result.error || "Erreur lors de la création");
      }
    } catch {
      showNotification("error", "Erreur lors de la création de la tâche");
    }
  };

  const getColumnStyles = () => {
    const baseStyles = `rounded-xl transition-all duration-300 ${
      isDragging ? "ring-2 ring-blue-500 scale-105" : ""
    }`;

    if (viewMode === "list") {
      return `${baseStyles} ${
        darkMode
          ? "bg-gray-800/30 border border-gray-700/50"
          : "bg-white/50 border border-gray-200/50"
      } backdrop-blur-sm p-4 mb-4`;
    }

    return `${baseStyles} ${
      darkMode
        ? "bg-gray-800/30 border border-gray-700/50"
        : "bg-white/50 border border-gray-200/50"
    } backdrop-blur-sm p-4 min-h-[400px] flex flex-col`;
  };

  if (viewMode === "list") {
    return (
      <div className={getColumnStyles()}>
        {/* En-tête de section pour la vue liste */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg`}
            >
              <Icon className="text-white" size={18} />
            </div>
            <div>
              <h3
                className={`font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {title}
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
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${gradient} text-white`}
          >
            {filteredTodos.length}
          </span>
        </div>

        {/* Liste des tâches */}
        <div className="space-y-3">
          {filteredTodos.map((todo) => (
            <ModernTodoCard
              key={todo.id}
              todo={todo}
              darkMode={darkMode}
              viewMode={viewMode}
              onEdit={onEdit}
              showNotification={showNotification}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={getColumnStyles()}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* En-tête de colonne */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg`}
          >
            <Icon className="text-white" size={20} />
          </div>
          <div>
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {title}
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

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${gradient} text-white`}
          >
            {filteredTodos.length}
          </span>
          <button
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-300"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
            title="Ajout rapide"
          >
            <FiPlus size={16} />
          </button>
        </div>
      </div>

      {/* Ajout rapide */}
      {showQuickAdd && (
        <div className="mb-4 space-y-2">
          <input
            type="text"
            placeholder="Titre de la tâche..."
            value={quickTodo}
            onChange={(e) => setQuickTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleQuickAdd()}
            className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleQuickAdd}
              disabled={!quickTodo.trim()}
              className="px-3 py-1 text-sm text-white transition-colors bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Ajouter
            </button>
            <button
              onClick={() => {
                setShowQuickAdd(false);
                setQuickTodo("");
              }}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                darkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Zone de drop améliorée */}
      {isDragging && (
        <div
          className={`absolute inset-0 rounded-xl border-2 border-dashed animate-pulse ${
            darkMode
              ? "border-blue-400 bg-blue-900/30 backdrop-blur-sm"
              : "border-blue-500 bg-blue-50/90 backdrop-blur-sm"
          } flex items-center justify-center z-10`}
        >
          <div className="space-y-2 text-center">
            <div
              className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg animate-bounce-gentle`}
            >
              <Icon className="text-white" size={24} />
            </div>
            <p
              className={`text-sm font-medium ${
                darkMode ? "text-blue-300" : "text-blue-700"
              }`}
            >
              Déposer ici pour déplacer vers
            </p>
            <p
              className={`text-lg font-bold ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {title}
            </p>
          </div>
        </div>
      )}

      {/* Liste des tâches */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {filteredTodos.length === 0 ? (
          <div
            className={`text-center py-8 ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            <Icon size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {searchTerm || filterStatus !== "all" || filterUser !== "all"
                ? "Aucune tâche correspondante"
                : "Aucune tâche"}
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <ModernTodoCard
              key={todo.id}
              todo={todo}
              darkMode={darkMode}
              viewMode={viewMode}
              onEdit={onEdit}
              showNotification={showNotification}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ModernTodoColumn;
