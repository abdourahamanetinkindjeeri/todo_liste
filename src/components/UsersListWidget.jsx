import React, { useState, useEffect, useCallback } from "react";
import { useTodoContext } from "../context/useTodoContext";
import { FiUser, FiMail, FiUsers, FiRefreshCw, FiSearch } from "react-icons/fi";

const UsersListWidget = ({ darkMode, onSelectUser }) => {
  const { users, fetchUsers } = useTodoContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRefreshUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchUsers();
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsers]);

  useEffect(() => {
    if (users.length === 0) {
      handleRefreshUsers();
    }
  }, [users.length, handleRefreshUsers]);

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`rounded-xl p-6 ${
        darkMode
          ? "bg-gray-800/50 border border-gray-700/50"
          : "bg-white/70 border border-gray-200/50"
      } backdrop-blur-sm space-y-6`}
    >
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiUsers
            className={`${darkMode ? "text-blue-400" : "text-blue-600"}`}
            size={24}
          />
          <div>
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Utilisateurs de l'équipe
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {filteredUsers.length} utilisateur
              {filteredUsers.length !== 1 ? "s" : ""} trouvé
              {filteredUsers.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <button
          onClick={handleRefreshUsers}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
              : "bg-gray-100 hover:bg-gray-200 text-gray-600"
          } disabled:opacity-50`}
        >
          <FiRefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          <span className="hidden sm:inline">Actualiser</span>
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <FiSearch
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
          size={16}
        />
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />
      </div>

      {/* Liste des utilisateurs */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="w-8 h-8 mx-auto mb-2 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Chargement des utilisateurs...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-8 text-center">
            <FiUsers
              className={`mx-auto mb-2 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
              size={32}
            />
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {searchTerm
                ? "Aucun utilisateur trouvé"
                : "Aucun utilisateur disponible"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  onSelectUser ? "cursor-pointer hover:scale-105" : ""
                } ${
                  darkMode
                    ? "border-gray-600 bg-gray-700/50 hover:bg-gray-700/80"
                    : "border-gray-200 bg-gray-50/50 hover:bg-gray-50/80"
                }`}
                onClick={() => onSelectUser && onSelectUser(user)}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0`}
                  >
                    <FiUser className="text-white" size={18} />
                  </div>

                  {/* Informations utilisateur */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-medium truncate ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {user.nom + " " + user.prenom || "Utilisateur"}
                    </h4>
                    <div className="flex items-center gap-1 mt-1">
                      <FiMail
                        className={`${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                        size={12}
                      />
                      <p
                        className={`text-sm truncate ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {user.email}
                      </p>
                    </div>

                    {/* ID utilisateur pour debug */}
                    <p
                      className={`text-xs mt-1 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      ID: {user.id}
                    </p>
                  </div>
                </div>

                {/* Indicateur de statut (si disponible) */}
                {user.isOnline !== undefined && (
                  <div className="flex items-center gap-1 mt-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        user.isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></div>
                    <span
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {user.isOnline ? "En ligne" : "Hors ligne"}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistiques */}
      {filteredUsers.length > 0 && (
        <div
          className={`pt-4 border-t ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="text-center">
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total: <span className="font-medium">{users.length}</span>{" "}
              utilisateur{users.length !== 1 ? "s" : ""} dans l'équipe
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersListWidget;
