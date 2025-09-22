import React from "react";
import { useTheme } from "../../context/useTheme.jsx";
import { FiClock, FiUser, FiFileText } from "react-icons/fi";

/**
 * Composant d'affichage de l'historique des tâches
 * @param {Object} props
 * @param {Array} props.history - Tableau de l'historique des tâches
 */
const SimpleTodoHistory = ({ history = [] }) => {
  const { darkMode } = useTheme();

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <FiFileText 
          className={`mx-auto mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`} 
          size={48} 
        />
        <h3
          className={`text-lg font-semibold mb-2 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Historique des tâches
        </h3>
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
          Aucun historique disponible pour le moment
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3
        className={`text-lg font-semibold ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Historique des tâches
      </h3>
      
      <div className="max-h-96 overflow-y-auto space-y-3">
        {history.map((item, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${
              darkMode
                ? "bg-gray-800/50 border-gray-700/50"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-1 rounded-full ${
                  darkMode
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                <FiClock size={12} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {item.action || "Action"}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {item.titre || item.libelle || "Tâche"}
                </p>
                
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <FiUser size={10} />
                  <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                    {item.user?.prenom || "Utilisateur"}
                  </span>
                  <span className={darkMode ? "text-gray-500" : "text-gray-400"}>•</span>
                  <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                    {item.date 
                      ? new Date(item.date).toLocaleDateString()
                      : "Date inconnue"
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleTodoHistory;