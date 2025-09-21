import React, { useState } from "react";
import { useTodoContext } from "../context/useTodoContext";
import { useUserContext } from "../context/useUserContext";
import DelegateModal from "./DelegateModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import {
  FiEdit3,
  FiTrash2,
  FiUser,
  FiClock,
  FiImage,
  FiChevronRight,
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
  FiStar,
  FiMoreHorizontal,
  FiUserPlus,
} from "react-icons/fi";

const ModernTodoCard = ({
  todo,
  darkMode,
  viewMode,
  onEdit,
  showNotification,
}) => {
  const {
    changeStatus,
    deleteTodo,
    delegateTodo,
    removeDelegation,
    TODO_STATUSES,
  } = useTodoContext();
  const { user } = useUserContext();
  const [isDragging, setIsDragging] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDelegateModal, setShowDelegateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isOwner = todo.userId === user?.id || todo.user?.id === user?.id;

  const handleDragStart = (e) => {
    if (!isOwner) return;
    e.dataTransfer.setData("text/plain", todo.id.toString());
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);

    // Ajouter des données supplémentaires pour l'effet visuel
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        id: todo.id,
        title: todo.libelle,
        currentStatus: todo.status,
      })
    );
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleStatusChange = async (newStatus) => {
    if (!isOwner) return;

    setIsLoading(true);
    try {
      const result = await changeStatus(todo.id, newStatus);
      if (result.success) {
        showNotification("success", "Statut mis à jour");
      } else {
        showNotification(
          "error",
          result.error || "Erreur lors de la mise à jour"
        );
      }
    } catch {
      showNotification("error", "Erreur lors de la mise à jour du statut");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwner) return;
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    setShowDeleteModal(false);
    try {
      const result = await deleteTodo(todo.id);
      if (result.success) {
        showNotification("success", "Tâche supprimée");
      } else {
        showNotification(
          "error",
          result.error || "Erreur lors de la suppression"
        );
      }
    } catch {
      showNotification("error", "Erreur lors de la suppression");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelegate = async (userId) => {
    if (!isOwner) return;

    setIsLoading(true);
    try {
      let result;
      if (userId === null) {
        // Supprimer la délégation
        result = await removeDelegation(todo.id);
      } else {
        // Déléguer à un utilisateur
        result = await delegateTodo(todo.id, userId);
      }

      if (result.success) {
        showNotification(
          "success",
          userId === null
            ? "Délégation supprimée"
            : "Tâche déléguée avec succès"
        );
      } else {
        showNotification(
          "error",
          result.error || "Erreur lors de la délégation"
        );
      }
    } catch {
      showNotification("error", "Erreur lors de la délégation");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusActions = () => {
    const actions = [];

    if (todo.status !== TODO_STATUSES.EN_ATTENTE) {
      actions.push({
        icon: FiArrowLeft,
        label: "En attente",
        action: () => handleStatusChange(TODO_STATUSES.EN_ATTENTE),
        color: "text-amber-500",
      });
    }

    if (todo.status !== TODO_STATUSES.EN_COURS) {
      actions.push({
        icon: FiArrowRight,
        label: "En cours",
        action: () => handleStatusChange(TODO_STATUSES.EN_COURS),
        color: "text-blue-500",
      });
    }

    if (todo.status !== TODO_STATUSES.TERMINEE) {
      actions.push({
        icon: FiCheck,
        label: "Terminer",
        action: () => handleStatusChange(TODO_STATUSES.TERMINEE),
        color: "text-green-500",
      });
    }

    return actions;
  };

  const getStatusColor = () => {
    switch (todo.status) {
      case TODO_STATUSES.EN_ATTENTE:
        return "border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10";
      case TODO_STATUSES.EN_COURS:
        return "border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10";
      case TODO_STATUSES.TERMINEE:
        return "border-l-green-500 bg-green-50/50 dark:bg-green-900/10";
      default:
        return "border-l-gray-300 bg-gray-50/50 dark:bg-gray-900/10";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const cardClasses = `
    draggable-card group relative overflow-hidden transition-all duration-200 border-l-4 
    ${getStatusColor()}
    ${
      darkMode
        ? "bg-gray-800/70 border border-gray-700/50 hover:bg-gray-800/90"
        : "bg-white/80 border border-gray-200/50 hover:bg-white/95"
    }
    ${isDragging ? "dragging" : ""}
    ${
      isOwner && !isDragging
        ? "cursor-grab hover:shadow-lg hover:scale-102"
        : "cursor-default"
    }
    ${viewMode === "list" ? "rounded-lg p-4" : "rounded-xl p-4"}
    ${isLoading ? "pointer-events-none opacity-75" : ""}
    backdrop-blur-sm
  `;

  return (
    <div
      className={cardClasses}
      draggable={isOwner}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Badge propriétaire et indicateur drag */}
      {isOwner && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
          {!isDragging && (
            <div
              className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
              title="Glisser pour déplacer"
            >
              <FiMoreHorizontal size={12} />
            </div>
          )}
          <FiStar className="text-yellow-500 fill-yellow-500" size={14} />
        </div>
      )}

      {/* Contenu principal */}
      <div className="space-y-3">
        {/* En-tête avec titre */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4
              className={`font-semibold line-clamp-2 ${
                todo.status === TODO_STATUSES.TERMINEE
                  ? "line-through opacity-75"
                  : ""
              } ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              {todo.libelle || todo.titre}
            </h4>
          </div>

          {/* Actions pour les propriétaires */}
          {isOwner && (
            <div
              className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                showActions ? "opacity-100" : ""
              }`}
            >
              <button
                onClick={() => onEdit(todo)}
                className={`p-1.5 rounded-lg transition-colors ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-400 hover:text-blue-400"
                    : "hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                }`}
                title="Modifier"
              >
                <FiEdit3 size={14} />
              </button>
              <button
                onClick={() => setShowDelegateModal(true)}
                className={`p-1.5 rounded-lg transition-colors ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-400 hover:text-purple-400"
                    : "hover:bg-gray-100 text-gray-500 hover:text-purple-600"
                }`}
                title="Déléguer"
              >
                <FiUserPlus size={14} />
              </button>
              <button
                onClick={handleDelete}
                className={`p-1.5 rounded-lg transition-colors ${
                  darkMode
                    ? "hover:bg-red-900/30 text-gray-400 hover:text-red-400"
                    : "hover:bg-red-100 text-gray-500 hover:text-red-600"
                }`}
                title="Supprimer"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        {todo.description && (
          <p
            className={`text-sm line-clamp-3 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {todo.description}
          </p>
        )}

        {/* Image */}
        {todo.photo && (
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={todo.photo}
              alt="Tâche"
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <FiImage
              className="absolute top-2 right-2 text-white/80"
              size={16}
            />
          </div>
        )}

        {/* Métadonnées */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            {/* Utilisateur */}
            <div className="flex items-center gap-1">
              <FiUser
                className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                size={12}
              />
              <span
                className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                {todo.user?.username || todo.user?.email || "Utilisateur"}
              </span>
            </div>

            {/* Date */}
            {todo.createdAt && (
              <div className="flex items-center gap-1">
                <FiClock
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  size={12}
                />
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {formatDate(todo.createdAt)}
                </span>
              </div>
            )}
          </div>

          {/* Statut badge */}
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              todo.status === TODO_STATUSES.TERMINEE
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : todo.status === TODO_STATUSES.EN_COURS
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            }`}
          >
            {todo.status === TODO_STATUSES.TERMINEE
              ? "Terminée"
              : todo.status === TODO_STATUSES.EN_COURS
              ? "En cours"
              : "En attente"}
          </span>
        </div>

        {/* Actions rapides pour le propriétaire */}
        {isOwner && viewMode === "kanban" && (
          <div
            className={`flex items-center gap-2 pt-2 border-t opacity-0 group-hover:opacity-100 transition-opacity ${
              showActions ? "opacity-100" : ""
            } ${darkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            {getStatusActions().map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-400 hover:text-gray-300"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
                title={action.label}
                disabled={isLoading}
              >
                <action.icon size={12} className={action.color} />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Indicateur de délégation */}
      {todo.delegatedUser && (
        <div
          className={`mt-3 p-2 rounded-lg ${
            darkMode
              ? "bg-purple-900/20 border border-purple-800/30"
              : "bg-purple-50 border border-purple-200"
          }`}
        >
          <div className="flex items-center gap-2 text-xs">
            <FiUserPlus
              className={`${darkMode ? "text-purple-400" : "text-purple-600"}`}
              size={12}
            />
            <span
              className={`font-medium ${
                darkMode ? "text-purple-300" : "text-purple-700"
              }`}
            >
              Délégué à:
            </span>
            <span
              className={`${darkMode ? "text-purple-200" : "text-purple-800"}`}
            >
              {todo.delegatedUser.username || todo.delegatedUser.email}
            </span>
          </div>
        </div>
      )}

      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Modal de délégation */}
      <DelegateModal
        todo={todo}
        isOpen={showDelegateModal}
        onClose={() => setShowDelegateModal(false)}
        onDelegate={handleDelegate}
        darkMode={darkMode}
      />

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        darkMode={darkMode}
        todoTitle={todo.title}
      />
    </div>
  );
};

export default ModernTodoCard;
