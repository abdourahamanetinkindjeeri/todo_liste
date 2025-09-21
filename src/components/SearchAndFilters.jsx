import React from "react";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

const SearchAndFilters = ({
  darkMode,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterUser,
  setFilterUser,
  showAllTodos,
}) => {
  const statusOptions = [
    { value: "all", label: "Tous les statuts" },
    { value: "EN_ATTENTE", label: "En attente" },
    { value: "EN_COURS", label: "En cours" },
    { value: "TERMINEE", label: "Terminées" },
  ];

  const userOptions = [
    { value: "all", label: "Tous les utilisateurs" },
    { value: "me", label: "Mes tâches" },
    { value: "others", label: "Autres utilisateurs" },
  ];

  const hasActiveFilters =
    searchTerm || filterStatus !== "all" || filterUser !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterUser("all");
  };

  return (
    <div
      className={`rounded-xl p-4 ${
        darkMode
          ? "bg-gray-800/50 border border-gray-700/50"
          : "bg-white/70 border border-gray-200/50"
      } backdrop-blur-sm space-y-4`}
    >
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiFilter
            className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
            size={18}
          />
          <h3
            className={`font-medium ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Recherche et filtres
          </h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
          >
            <FiX size={14} />
            Effacer
          </button>
        )}
      </div>

      {/* Contrôles de recherche et filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            placeholder="Rechercher une tâche..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
          />
        </div>

        {/* Filtre par statut */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Filtre par utilisateur (seulement si on voit toutes les tâches) */}
        {showAllTodos && (
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className={`px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            {userOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Indicateur de filtres actifs */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                darkMode
                  ? "bg-blue-900/30 text-blue-400 border border-blue-800/30"
                  : "bg-blue-100 text-blue-700 border border-blue-200"
              }`}
            >
              Recherche: "{searchTerm}"
              <button
                onClick={() => setSearchTerm("")}
                className="hover:bg-blue-500/20 rounded p-0.5"
              >
                <FiX size={10} />
              </button>
            </span>
          )}

          {filterStatus !== "all" && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                darkMode
                  ? "bg-purple-900/30 text-purple-400 border border-purple-800/30"
                  : "bg-purple-100 text-purple-700 border border-purple-200"
              }`}
            >
              Statut:{" "}
              {statusOptions.find((opt) => opt.value === filterStatus)?.label}
              <button
                onClick={() => setFilterStatus("all")}
                className="hover:bg-purple-500/20 rounded p-0.5"
              >
                <FiX size={10} />
              </button>
            </span>
          )}

          {filterUser !== "all" && showAllTodos && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                darkMode
                  ? "bg-green-900/30 text-green-400 border border-green-800/30"
                  : "bg-green-100 text-green-700 border border-green-200"
              }`}
            >
              Utilisateur:{" "}
              {userOptions.find((opt) => opt.value === filterUser)?.label}
              <button
                onClick={() => setFilterUser("all")}
                className="hover:bg-green-500/20 rounded p-0.5"
              >
                <FiX size={10} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;
