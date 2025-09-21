import React, { useState } from "react";
import { useTodoContext } from "../context/useTodoContext";
import DeleteConfirmModal from "./DeleteConfirmModal";
import {
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiCalendar,
  FiUser,
  FiStar,
} from "react-icons/fi";

const TodoCard = ({ todo, onEdit }) => {
  const { deleteTodo, changeStatus, currentUserId } = useTodoContext();
  const [isDragging, setIsDragging] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Vérifier si le todo appartient à l'utilisateur connecté
  const isOwnTodo =
    todo.userId === currentUserId || todo.user?.id === currentUserId;

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        id: todo.id,
        status: todo.status,
      })
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDelete = async () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    await deleteTodo(todo.id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "EN_COURS":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "EN_ATTENTE":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "TERMINEE":
        return "bg-green-100 border-green-300 text-green-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "EN_COURS":
        return "En cours";
      case "EN_ATTENTE":
        return "En attente";
      case "TERMINEE":
        return "Terminée";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className={`relative rounded-lg shadow-md border p-4 mb-3 cursor-move todo-card ${
        isDragging ? "dragging" : ""
      } ${
        isOwnTodo
          ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Indicateur de propriétaire */}
      {isOwnTodo && (
        <div className="absolute top-2 left-2">
          <FiStar
            className="h-4 w-4 text-yellow-500 fill-current"
            title="Votre tâche"
          />
        </div>
      )}

      {/* Badge de statut */}
      <div
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2 ${getStatusColor(
          todo.status
        )}`}
      >
        {getStatusLabel(todo.status)}
      </div>

      {/* Titre */}
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {todo.titre}
      </h3>

      {/* Description */}
      {todo.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {todo.description}
        </p>
      )}

      {/* Photo */}
      {todo.photo && (
        <div className="mb-3">
          <img
            src={`http://localhost:8888${todo.photo}`}
            alt="Photo de la tâche"
            className="w-full h-32 object-cover rounded-md"
          />
        </div>
      )}

      {/* Informations utilisateur */}
      <div className="flex items-center text-xs text-gray-500 mb-2">
        <FiUser className="mr-1" />
        <span
          className={`mr-3 ${isOwnTodo ? "font-semibold text-blue-700" : ""}`}
        >
          {todo.user?.prenom} {todo.user?.nom}
          {isOwnTodo && " (Vous)"}
        </span>
        <FiCalendar className="mr-1" />
        <span>{formatDate(todo.createdAt)}</span>
      </div>

      {/* Délégations */}
      {todo.delegations && todo.delegations.length > 0 && (
        <div className="flex items-center text-xs text-blue-600 mb-2">
          <FiUsers className="mr-1" />
          <span>Délégué à {todo.delegations.length} personne(s)</span>
        </div>
      )}

      {/* Actions (visibles au hover) - seulement pour ses propres todos */}
      {isOwnTodo && (
        <div
          className={`absolute top-2 right-2 flex space-x-1 transition-opacity duration-200 ${
            showActions ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={() => onEdit(todo)}
            className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            title="Modifier"
          >
            <FiEdit2 size={12} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            title="Supprimer"
          >
            <FiTrash2 size={12} />
          </button>
        </div>
      )}

      {/* Actions rapides de changement de statut - seulement pour ses propres todos */}
      {isOwnTodo && (
        <div className="mt-3 flex space-x-2">
          {todo.status !== "EN_COURS" && (
            <button
              onClick={() => changeStatus(todo.id, "EN_COURS")}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              → En cours
            </button>
          )}
          {todo.status !== "EN_ATTENTE" && (
            <button
              onClick={() => changeStatus(todo.id, "EN_ATTENTE")}
              className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
            >
              → En attente
            </button>
          )}
          {todo.status !== "TERMINEE" && (
            <button
              onClick={() => changeStatus(todo.id, "TERMINEE")}
              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
            >
              → Terminée
            </button>
          )}
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        darkMode={false} // Composant legacy, pas de dark mode
        todoTitle={todo.title}
      />
    </div>
  );
};

export default TodoCard;
