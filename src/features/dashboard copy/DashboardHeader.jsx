import React, { useState } from "react";
import { useUserContext } from "../../context/useUserContext";
import { useTheme } from "../../context/useTheme";
import SearchBar from "../../components/common/SearchBar";
import { FiMoon, FiSun, FiLogOut } from "react-icons/fi";

const DashboardHeader = ({
  searchTerm,
  setSearchTerm,
  onLogout,
  view,
  setView,
}) => {
  const { user } = useUserContext();
  const { darkMode, toggleDarkMode } = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  return (
    <header
      className={`sticky top-0 z-30 shadow-md ${
        darkMode
          ? "bg-gray-900 border-b border-gray-800"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src={
              darkMode
                ? "https://cdn-icons-png.flaticon.com/512/1152/1152451.png"
                : "https://cdn-icons-png.flaticon.com/512/1152/1152451.png"
            }
            alt="Logo"
            className="w-8 h-8"
          />
          <span
            className={`text-xl font-bold tracking-wider ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Quantum
          </span>
        </div>
        {/* Sélecteur Mes tâches / Équipe */}
        <div className="flex items-center mx-8">
          <button
            className={`px-4 py-1 rounded-l-lg text-sm font-medium transition-colors border ${
              view === "user"
                ? darkMode
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-blue-500 text-white border-blue-500"
                : darkMode
                ? "bg-gray-800 text-gray-300 border-gray-700"
                : "bg-white text-gray-600 border-gray-300"
            }`}
            onClick={() => setView("user")}
          >
            Mes tâches
          </button>
          <button
            className={`px-4 py-1 rounded-r-lg text-sm font-medium transition-colors border-l-0 border ${
              view === "team"
                ? darkMode
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-blue-500 text-white border-blue-500"
                : darkMode
                ? "bg-gray-800 text-gray-300 border-gray-700"
                : "bg-white text-gray-600 border-gray-300"
            }`}
            onClick={() => setView("team")}
          >
            Équipe
          </button>
        </div>
        {/* Barre de recherche centrée */}
        <div className="flex-1 max-w-lg">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une tâche..."
          />
        </div>
        {/* Actions utilisateur */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors ${
              darkMode
                ? "text-yellow-400 hover:bg-gray-700"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            aria-label="Changer de thème"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm font-medium ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              {user?.email} {user?.prenom}
            </span>
            <img
              src={
                user?.photo ||
                `https://ui-avatars.com/api/?name=${user?.prenom}+${user?.nom}&background=random`
              }
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`p-2 rounded-full transition-colors ${
              darkMode
                ? "text-red-400 hover:bg-red-900/50"
                : "text-red-600 hover:bg-red-100"
            }`}
            aria-label="Déconnexion"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </div>
      {/* Modal de confirmation de déconnexion */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm`}
          >
            <h2 className="mb-4 text-lg font-semibold text-center">
              Confirmer la déconnexion
            </h2>
            <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
              Voulez-vous vraiment vous déconnecter ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
