import React from "react";
import { FiPlus, FiRefreshCw, FiZap } from "react-icons/fi";

/**
 * Actions flottantes pour accès rapide
 * Principe: Single Responsibility - Gère uniquement les actions rapides
 */
const SimpleFloatingActions = ({ onCreateTodo, onRefresh, isLoading }) => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
      {/* Bouton d'actualisation */}
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:scale-105 disabled:opacity-50"
        title="Actualiser"
      >
        <FiRefreshCw
          size={20}
          className={`text-gray-600 dark:text-gray-400 ${
            isLoading ? "animate-spin" : ""
          }`}
        />
      </button>

      {/* Bouton d'action rapide */}
      <button
        className="p-4 bg-purple-500 dark:bg-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 hover:bg-purple-600 dark:hover:bg-purple-500"
        title="Actions rapides"
      >
        <FiZap size={20} />
      </button>

      {/* Bouton principal de création */}
      <button
        onClick={onCreateTodo}
        className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        title="Nouvelle tâche"
      >
        <FiPlus size={24} />
      </button>
    </div>
  );
};

export default SimpleFloatingActions;
