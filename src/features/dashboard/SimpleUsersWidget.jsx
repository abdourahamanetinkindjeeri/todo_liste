import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/useTheme.jsx";
import { FiUsers, FiChevronDown, FiChevronUp } from "react-icons/fi";

/**
 * Widget simplifié d'affichage des utilisateurs
 * @param {Object} props
 * @param {boolean} props.isExpanded - État d'expansion du widget
 * @param {Function} props.onToggle - Fonction pour basculer l'expansion
 */
const SimpleUsersWidget = ({ isExpanded, onToggle }) => {
  const { darkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      fetchUsers();
    }
  }, [isExpanded]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Simuler un appel API - à remplacer par le vrai service
      setTimeout(() => {
        setUsers([
          { id: 1, prenom: "John", nom: "Doe", email: "john@example.com" },
          { id: 2, prenom: "Jane", nom: "Smith", email: "jane@example.com" },
        ]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        darkMode
          ? "bg-gray-800/50 border-gray-700/50"
          : "bg-white/70 border-gray-200"
      }`}
    >
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 text-left hover:bg-opacity-80 transition-colors ${
          darkMode ? "hover:bg-gray-700/30" : "hover:bg-gray-50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              darkMode
                ? "bg-blue-500/20 text-blue-400"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            <FiUsers size={20} />
          </div>
          <div>
            <h3
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Équipe
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {users.length} membre{users.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <FiChevronUp className={darkMode ? "text-gray-400" : "text-gray-600"} />
        ) : (
          <FiChevronDown className={darkMode ? "text-gray-400" : "text-gray-600"} />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4">
          {isLoading ? (
            <div className="text-center py-4">
              <div
                className={`animate-spin rounded-full h-6 w-6 border-b-2 mx-auto ${
                  darkMode ? "border-blue-400" : "border-blue-600"
                }`}
              ></div>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    darkMode
                      ? "hover:bg-gray-700/30"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                    }`}
                  >
                    {user.prenom[0]}{user.nom[0]}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {user.prenom} {user.nom}
                    </p>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {user.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimpleUsersWidget;