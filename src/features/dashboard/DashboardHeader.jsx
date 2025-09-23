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

      {/* Toggle vue personnelle/équipe + bouton historique */}
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
          <button
            onClick={() => {
              setShowHistoryModal(true);
              fetchHistory();
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ml-2 ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-blue-600"
                : "bg-gray-100 text-blue-600 hover:bg-blue-100"
            }`}
          >
            Historique
          </button>
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
            <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
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