import React, { useState } from "react";
import { useTheme } from "../../context/useTheme";
import { useTodoContext } from "../../context/useTodoContext";
import SimpleTodoBoard from "./SimpleTodoBoard";
import SimpleFloatingActions from "./SimpleFloatingActions";
import SimpleCreateTodoForm from "./SimpleCreateTodoForm";
import SimpleEditTodoForm from "./SimpleEditTodoForm";
import SearchBar from "./SearchBar";
import NotificationToast from "./NotificationToast";

const TodoWorkspace = () => {
  const { darkMode } = useTheme();
  const { isLoading, error, setError, fetchTodos } = useTodoContext();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message, id: Date.now() });
    setTimeout(() => setNotification(null), 4000);
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

  return (
    <div className="px-6 pb-8 space-y-6">
      {notification && (
        <NotificationToast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Barre de recherche */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        darkMode={darkMode}
      />

      {/* Message d'erreur */}
      {error && (
        <div
          className={`p-4 rounded-xl border ${
            darkMode
              ? "bg-red-900/20 border-red-800/30 text-red-400"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className={`ml-4 hover:opacity-70 ${
                darkMode ? "text-red-400" : "text-red-600"
              }`}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <SimpleTodoBoard
        searchTerm={searchTerm}
        onEditTodo={handleEditTodo}
        showNotification={showNotification}
        isLoading={isLoading}
      />

      <SimpleFloatingActions
        onCreateTodo={handleCreateTodo}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

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
