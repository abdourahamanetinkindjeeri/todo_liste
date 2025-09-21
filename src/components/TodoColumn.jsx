import React, { useState } from "react";
import TodoCard from "./TodoCard";
import { useTodoContext } from "../context/useTodoContext";

const TodoColumn = ({ status, title, todos, color, onEdit }) => {
  const { changeStatus } = useTodoContext();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      const { id, status: currentStatus } = data;

      // Ne rien faire si le statut est le même
      if (currentStatus === status) {
        return;
      }

      // Changer le statut du todo
      await changeStatus(id, status);
    } catch (error) {
      console.error("Erreur lors du drop:", error);
    }
  };

  const getHeaderStyle = (color) => {
    const baseClass =
      "text-center py-3 px-4 rounded-t-lg font-semibold text-white";
    switch (color) {
      case "blue":
        return `${baseClass} bg-blue-500`;
      case "yellow":
        return `${baseClass} bg-yellow-500`;
      case "green":
        return `${baseClass} bg-green-500`;
      default:
        return `${baseClass} bg-gray-500`;
    }
  };

  return (
    <div className="flex-1 min-h-96">
      {/* En-tête de la colonne */}
      <div className={getHeaderStyle(color)}>
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="text-sm opacity-90">({todos.length})</span>
      </div>

      {/* Zone de drop */}
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`min-h-96 p-4 bg-gray-50 border-l border-r border-b border-gray-200 rounded-b-lg transition-all duration-200 custom-scrollbar overflow-y-auto ${
          isDragOver ? "drop-zone-active" : "border-solid"
        }`}
      >
        {/* Message si aucun todo */}
        {todos.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">Aucune tâche</p>
            <p className="text-xs mt-1">Glissez une tâche ici</p>
          </div>
        )}

        {/* Liste des todos */}
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} onEdit={onEdit} />
        ))}

        {/* Indicateur de zone de drop active */}
        {isDragOver && (
          <div className="border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg p-8 text-center text-blue-600">
            <p className="font-medium">Déposer la tâche ici</p>
            <p className="text-sm">pour la déplacer vers "{title}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoColumn;
