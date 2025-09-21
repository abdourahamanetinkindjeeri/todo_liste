import React, { useState } from "react";
import { useTodoContext } from "../context/useTodoContext";
import TodoColumn from "./TodoColumn";
import CreateTodoForm from "./CreateTodoForm";
import EditTodoForm from "./EditTodoForm";
import Navbar from "./Navbar";
import { FiPlus, FiRefreshCw, FiAlertCircle, FiInfo } from "react-icons/fi";

const TodoBoard = () => {
  const {
    todosByStatus,
    isLoading,
    error,
    setError,
    fetchTodos,
    showAllTodos,
    TODO_STATUSES,
  } = useTodoContext();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const handleCreateTodo = () => {
    setShowCreateForm(true);
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
  };

  const handleCloseEditForm = () => {
    setEditingTodo(null);
  };

  const handleRefresh = () => {
    fetchTodos();
  };

  const dismissError = () => {
    setError(null);
  };

  const columns = [
    {
      status: TODO_STATUSES.EN_COURS,
      title: "En Cours",
      color: "blue",
      todos: todosByStatus[TODO_STATUSES.EN_COURS] || [],
    },
    {
      status: TODO_STATUSES.EN_ATTENTE,
      title: "En Attente",
      color: "yellow",
      todos: todosByStatus[TODO_STATUSES.EN_ATTENTE] || [],
    },
    {
      status: TODO_STATUSES.TERMINEE,
      title: "Terminées",
      color: "green",
      todos: todosByStatus[TODO_STATUSES.TERMINEE] || [],
    },
  ];

  const totalTodos = Object.values(todosByStatus).reduce(
    (acc, todos) => acc + todos.length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Contenu principal */}
      <div className="p-6">
        {/* Barre d'actions */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {showAllTodos ? "Toutes les tâches" : "Mes tâches"}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {showAllTodos
                ? "Visualisation de toutes les tâches de l'équipe"
                : "Gestion de vos tâches personnelles"}
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              <FiRefreshCw
                className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Actualiser
            </button>
            <button
              onClick={handleCreateTodo}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FiPlus className="mr-2" />
              Nouvelle Tâche
            </button>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <FiAlertCircle className="text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
            <button
              onClick={dismissError}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Message de debug si aucun todo */}
        {totalTodos === 0 && !isLoading && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <FiInfo className="text-blue-500 mr-2" />
              <div>
                <p className="text-blue-700 font-medium">
                  {showAllTodos
                    ? "Aucune tâche dans l'équipe"
                    : "Aucune de vos tâches"}
                </p>
                <p className="text-blue-600 text-sm">
                  • Vérifiez que le serveur backend (port 8888) est démarré
                  <br />
                  • Cliquez sur "Actualiser" pour recharger les données
                  <br />• Créez une nouvelle tâche avec le bouton "Nouvelle
                  Tâche"
                  {!showAllTodos && (
                    <>
                      <br />• Basculez vers "Toutes les tâches" pour voir les
                      tâches de l'équipe
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tableau Kanban */}
        <div className="flex space-x-4 overflow-x-auto">
          {columns.map((column) => (
            <TodoColumn
              key={column.status}
              status={column.status}
              title={column.title}
              todos={column.todos}
              color={column.color}
              onEdit={handleEditTodo}
            />
          ))}
        </div>

        {/* Instructions pour les utilisateurs */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Comment utiliser le tableau
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              • <strong>Vos tâches</strong> apparaissent avec un fond bleu et
              une étoile jaune
            </li>
            <li>
              • <strong>Glissez et déposez</strong> les tâches entre les
              colonnes pour changer leur statut
            </li>
            <li>
              • <strong>Modifier/Supprimer</strong> : Survolez une de vos tâches
              pour voir les actions
            </li>
            <li>
              • <strong>Changement rapide</strong> : Utilisez les boutons en bas
              de vos cartes
            </li>
            <li>• Seules vos propres tâches peuvent être modifiées</li>
            <li>
              • <strong>Toggle navbar</strong> : Utilisez le commutateur en haut
              pour basculer entre "Mes tâches" et "Toutes les tâches"
            </li>
          </ul>
        </div>

        {/* Formulaire de création */}
        {showCreateForm && <CreateTodoForm onClose={handleCloseCreateForm} />}

        {/* Formulaire d'édition */}
        {editingTodo && (
          <EditTodoForm todo={editingTodo} onClose={handleCloseEditForm} />
        )}
      </div>
    </div>
  );
};

export default TodoBoard;
