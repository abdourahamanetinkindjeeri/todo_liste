import React, { useState } from "react";
import { useUserContext } from "../context/useUserContext";
import { useTodoContext } from "../context/useTodoContext";
import { useTheme } from "../context/useTheme";
import LogoutConfirmModal from "./LogoutConfirmModal";
import {
  FiLogOut,
  FiUser,
  FiEye,
  FiUserCheck,
  FiMoon,
  FiSun,
} from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useUserContext();
  const { showAllTodos, setShowAllTodos, todosByStatus, TODO_STATUSES } =
    useTodoContext();
  const { darkMode, toggleDarkMode } = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const toggleTodosView = () => {
    setShowAllTodos(!showAllTodos);
  };

  // Calculer les statistiques
  const totalTodos = Object.values(todosByStatus).reduce(
    (acc, todos) => acc + todos.length,
    0
  );

  return (
    <>
      <nav
        className={`border-b shadow-lg transition-colors duration-300 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo et titre */}
            <div className="flex items-center">
              <div className="flex items-center flex-shrink-0">
                <div className="p-2 mr-3 bg-green-500 rounded-full">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h1
                    className={`text-xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Todo List Dashboard
                  </h1>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Gestion des tâches
                  </p>
                </div>
              </div>
            </div>

            {/* Section centrale - Toggle et statistiques */}
            <div className="flex items-center space-x-6">
              {/* Toggle pour affichage */}
              <div
                className={`flex items-center p-1 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <button
                  onClick={toggleTodosView}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    !showAllTodos
                      ? "bg-blue-500 text-white shadow-sm"
                      : darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FiUserCheck className="mr-2" />
                  Mes tâches
                </button>
                <button
                  onClick={toggleTodosView}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    showAllTodos
                      ? "bg-blue-500 text-white shadow-sm"
                      : darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FiEye className="mr-2" />
                  Toutes les tâches
                </button>
              </div>

              {/* Statistiques rapides */}
              <div className="items-center hidden space-x-4 text-sm md:flex">
                <div
                  className={`flex items-center ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <span className="font-medium">Total:</span>
                  <span
                    className={`px-2 py-1 ml-1 rounded ${
                      darkMode
                        ? "text-gray-100 bg-gray-700"
                        : "text-gray-800 bg-gray-200"
                    }`}
                  >
                    {totalTodos}
                  </span>
                </div>
                <div className="flex items-center text-blue-600">
                  <span className="font-medium">En cours:</span>
                  <span className="px-2 py-1 ml-1 text-blue-800 bg-blue-100 rounded">
                    {todosByStatus[TODO_STATUSES.EN_COURS]?.length || 0}
                  </span>
                </div>
                <div className="flex items-center text-green-600">
                  <span className="font-medium">Terminées:</span>
                  <span className="px-2 py-1 ml-1 text-green-800 bg-green-100 rounded">
                    {todosByStatus[TODO_STATUSES.TERMINEE]?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Informations utilisateur et actions */}
            <div className="flex items-center space-x-4">
              {/* Toggle theme */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
                title={darkMode ? "Mode clair" : "Mode sombre"}
              >
                {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>

              {/* Informations utilisateur */}
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FiUser className="w-4 h-4 text-blue-600" />
                </div>
                <div className="hidden sm:block">
                  <p
                    className={`text-sm font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {user?.email || "Utilisateur"}
                  </p>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    ID: {user?.id || "Non défini"}
                  </p>
                </div>
              </div>

              {/* Indicateur de mode */}
              <div className="hidden lg:block">
                <span
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {showAllTodos
                    ? "Mode: Toutes les tâches"
                    : "Mode: Mes tâches"}
                </span>
              </div>

              {/* Bouton de déconnexion */}
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <FiLogOut className="mr-2" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Ligne d'information du mode actif (mobile) */}
          <div className="pb-3 md:hidden">
            <div className="flex items-center justify-between text-sm">
              <span
                className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                {showAllTodos
                  ? "Affichage: Toutes les tâches"
                  : "Affichage: Mes tâches"}
              </span>
              <div className="flex space-x-3">
                <span className="text-blue-600">
                  En cours: {todosByStatus[TODO_STATUSES.EN_COURS]?.length || 0}
                </span>
                <span className="text-green-600">
                  Terminées:{" "}
                  {todosByStatus[TODO_STATUSES.TERMINEE]?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal de confirmation de déconnexion */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
        darkMode={darkMode}
      />
    </>
  );
};

export default Navbar;
