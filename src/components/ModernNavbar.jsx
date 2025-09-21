import React, { useState } from "react";
import { useTodoContext } from "../context/useTodoContext";
import { useUserContext } from "../context/useUserContext";
import LogoutConfirmModal from "./LogoutConfirmModal";
import {
  FiSun,
  FiMoon,
  FiUser,
  FiLogOut,
  FiSettings,
  FiToggleLeft,
  FiToggleRight,
  FiBell,
} from "react-icons/fi";

const ModernNavbar = ({ darkMode, toggleDarkMode, showAllTodos, user }) => {
  const { setShowAllTodos } = useTodoContext();
  const { logout } = useUserContext();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleToggleAllTodos = () => {
    setShowAllTodos(!showAllTodos);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  return (
    <nav
      className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-300 ${
        darkMode
          ? "bg-gray-900/80 border-gray-700/50"
          : "bg-white/80 border-gray-200/50"
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo et titre */}
          <div className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg`}
            >
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <h1
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                TodoFlow
              </h1>
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Gestionnaire de tâches moderne
              </p>
            </div>
          </div>

          {/* Controls centraux */}
          <div className="flex items-center gap-6">
            {/* Toggle Mes tâches / Toutes les tâches */}
            <div className="hidden sm:flex items-center gap-3">
              <span
                className={`text-sm font-medium ${
                  !showAllTodos
                    ? darkMode
                      ? "text-blue-400"
                      : "text-blue-600"
                    : darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Mes tâches
              </span>
              <button
                onClick={handleToggleAllTodos}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  showAllTodos
                    ? "bg-blue-600"
                    : darkMode
                    ? "bg-gray-600"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showAllTodos ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`text-sm font-medium ${
                  showAllTodos
                    ? darkMode
                      ? "text-blue-400"
                      : "text-blue-600"
                    : darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Équipe
              </span>
            </div>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-3">
            {/* Notifications (placeholder) */}
            <button
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? "hover:bg-gray-800 text-gray-400 hover:text-gray-300"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              <FiBell size={18} />
            </button>

            {/* Toggle thème */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-200 ${
                darkMode
                  ? "hover:bg-gray-800 text-yellow-400 hover:text-yellow-300"
                  : "hover:bg-gray-100 text-gray-600 hover:text-gray-700"
              }`}
              title={darkMode ? "Mode clair" : "Mode sombre"}
            >
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Menu utilisateur */}
            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                darkMode ? "bg-gray-800/50" : "bg-gray-100/50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center`}
              >
                <FiUser className="text-white" size={14} />
              </div>
              <div className="hidden sm:block">
                <p
                  className={`text-sm font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user?.username || user?.email || "Utilisateur"}
                </p>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {user?.email}
                </p>
              </div>

              {/* Menu dropdown (simplifié) */}
              <div className="flex items-center gap-1">
                <button
                  className={`p-1 rounded transition-colors ${
                    darkMode
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-gray-200 text-gray-500"
                  }`}
                >
                  <FiSettings size={14} />
                </button>
                <button
                  onClick={handleLogout}
                  className={`p-1 rounded transition-colors ${
                    darkMode
                      ? "hover:bg-red-900 text-red-400"
                      : "hover:bg-red-100 text-red-600"
                  }`}
                  title="Déconnexion"
                >
                  <FiLogOut size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Barre mobile pour le toggle */}
        <div className="sm:hidden pb-3">
          <div className="flex items-center justify-center gap-3">
            <span
              className={`text-sm font-medium ${
                !showAllTodos
                  ? darkMode
                    ? "text-blue-400"
                    : "text-blue-600"
                  : darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Mes tâches
            </span>
            <button
              onClick={handleToggleAllTodos}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showAllTodos
                  ? "bg-blue-600"
                  : darkMode
                  ? "bg-gray-600"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showAllTodos ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${
                showAllTodos
                  ? darkMode
                    ? "text-blue-400"
                    : "text-blue-600"
                  : darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Équipe
            </span>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de déconnexion */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
        darkMode={darkMode}
      />
    </nav>
  );
};

export default ModernNavbar;
