import React, { useState } from "react";
import { useTheme } from "../../context/useTheme";
import { useUserContext } from "../../context/useUserContext";
import { useTodoContext } from "../../context/useTodoContext";
import UserProfile from "./UserProfile";
import QuickStats from "./QuickStats";
import ThemeToggle from "./ThemeToggle";
import SimpleUsersWidget from "./SimpleUsersWidget";
import { FiHome } from "react-icons/fi";

/**
 * En-tête du dashboard
 * Principe: Single Responsibility - Gère uniquement l'affichage de l'en-tête
 */
const DashboardHeader = () => {
  const { darkMode } = useTheme();
  const { user } = useUserContext();
  const { showAllTodos, setShowAllTodos } = useTodoContext();
  const [showUsersWidget, setShowUsersWidget] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  return (
    <div className="px-6 py-8">
      {/* Navigation moderne et simple */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-xl ${
              darkMode
                ? "bg-blue-600/20 border border-blue-500/30"
                : "bg-blue-100 border border-blue-200"
            }`}
          >
            <FiHome
              className={darkMode ? "text-blue-400" : "text-blue-600"}
              size={24}
            />
          </div>

          <div>
            <h1
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {getGreeting()}, {user?.prenom || user?.name || "Utilisateur"}
            </h1>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {showAllTodos
                ? "Vue d'ensemble de toute l'équipe"
                : "Votre espace de travail personnel"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserProfile />
        </div>
      </div>

      {/* Statistiques rapides */}
      <QuickStats />

      {/* Toggle vue personnelle/équipe */}
      <div className="mt-6">
        <div
          className={`inline-flex rounded-lg p-1 ${
            darkMode
              ? "bg-gray-800/50 border border-gray-700/50"
              : "bg-white/70 border border-gray-200"
          }`}
        >
          <button
            onClick={() => setShowAllTodos(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              !showAllTodos
                ? darkMode
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-blue-500 text-white shadow-lg"
                : darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Mes tâches
          </button>
          <button
            onClick={() => setShowAllTodos(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              showAllTodos
                ? darkMode
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-blue-500 text-white shadow-lg"
                : darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Équipe
          </button>
        </div>
      </div>

      {/* Widget des utilisateurs */}
      <div className="mt-6">
        <SimpleUsersWidget
          isExpanded={showUsersWidget}
          onToggle={() => setShowUsersWidget(!showUsersWidget)}
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
