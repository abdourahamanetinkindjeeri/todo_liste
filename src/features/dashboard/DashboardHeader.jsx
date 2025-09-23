import React, { useState } from "react";
import { getToken } from "../../utils/tokenUtils.js";
import { useTheme } from "../../context/useTheme.jsx";
import { useUserContext } from "../../context/useUserContext.jsx";
import { useTodoContext } from "../../context/useTodoContext.jsx";
import { ThemeToggle } from "../../components/ui/index.js";
import UserProfile from "./UserProfile.jsx";
import QuickStats from "./QuickStats.jsx";
import SimpleUsersWidget from "./SimpleUsersWidget.jsx";
import SimpleTodoHistory from "./SimpleTodoHistory.jsx";
import { Search, Bell, Grid3X3, BarChart3 } from "lucide-react";
import TeamMembersList from "../../components/common/TeamMembersList.jsx";

/**
 * En-tête du dashboard style Quantum
 * Principe: Single Responsibility - Gère uniquement l'affichage de l'en-tête
 */
const DashboardHeader = () => {
  const { darkMode } = useTheme();
  const { user } = useUserContext();
  const { showAllTodos, setShowAllTodos } = useTodoContext();
  const [showUsersWidget, setShowUsersWidget] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [errorHistory, setErrorHistory] = useState(null);

  // Récupérer l'historique depuis l'API à l'ouverture de la modal
  const fetchHistory = async () => {
    if (!user?.id) return;
    setLoadingHistory(true);
    setErrorHistory(null);
    try {
      const token = getToken();
      const response = await fetch(
        `http://localhost:8888/todos/history/user/${user.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (!response.ok)
        throw new Error("Erreur lors de la récupération de l'historique");
      const result = await response.json();
      setHistoryData(result.data || []);
    } catch (err) {
      setErrorHistory(err.message);
      setHistoryData([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div
      className={`${darkMode ? "bg-gray-900" : "bg-white"} border-b ${
        darkMode ? "border-gray-800" : "border-gray-200"
      }`}
    >
      {/* Header principal style Quantum */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo et navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <h1
                className={`text-xl font-bold tracking-wider ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                TODO
              </h1>
            </div>

            {/* Navigation tabs */}
            <nav className="flex space-x-8">
              <button
                className={`text-sm font-medium pb-4 border-b-2 ${
                  darkMode
                    ? "text-blue-400 border-blue-400"
                    : "text-blue-600 border-blue-600"
                }`}
              >
                Dashboard
              </button>
              <button
                className={`text-sm font-medium pb-4 border-b-2 border-transparent ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  setShowHistoryModal(true);
                  fetchHistory();
                }}
              >
                Statistiques
              </button>
              <button
                className={`text-sm font-medium pb-4 border-b-2 border-transparent ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Pages
              </button>
            </nav>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            <div
              className={`relative flex items-center ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              } rounded-lg px-3 py-2`}
            >
              <Search
                className={`w-4 h-4 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } mr-2`}
              />
              <input
                type="text"
                placeholder="Search"
                className={`bg-transparent text-sm outline-none ${
                  darkMode
                    ? "text-white placeholder-gray-400"
                    : "text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>

            <button
              className={`p-2 rounded-lg ${
                darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
            >
              <Bell
                className={`w-5 h-5 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </button>

            <ThemeToggle />
            <UserProfile />
          </div>
        </div>
      </div>

      {/* Navigation secondaire avec vue des tâches */}
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Dashboard
            </span>
            <span
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              /
            </span>
            <span
              className={`text-sm font-medium ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              To Do List
            </span>
          </div>

          <div className="flex items-center space-x-3">
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
                {/* <button
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
                </button> */}
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

            <div className="flex items-center space-x-1">
              <button
                className={`p-2 rounded ${
                  darkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                className={`p-2 rounded ${
                  darkMode
                    ? "hover:bg-gray-800 text-gray-400"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal historique */}
      {showHistoryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowHistoryModal(false);
            }
          }}
        >
          <div
            className={`relative w-full max-w-lg p-6 rounded-lg shadow-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <button
              className="absolute text-xl text-gray-500 transition-colors top-2 right-2 hover:text-red-500"
              onClick={() => setShowHistoryModal(false)}
              aria-label="Fermer"
            >
              &times;
            </button>
            {loadingHistory ? (
              <div className="py-8 text-center text-blue-600">
                Chargement...
              </div>
            ) : errorHistory ? (
              <div className="py-8 text-center text-red-500">
                {errorHistory}
              </div>
            ) : (
              <SimpleTodoHistory history={historyData} />
            )}
          </div>
        </div>
      )}

      {/* Widget des utilisateurs */}
      <div className="px-6 pb-4">
        <TeamMembersList
          isExpanded={showUsersWidget}
          onToggle={() => setShowUsersWidget(!showUsersWidget)}
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
