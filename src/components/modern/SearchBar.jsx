import React from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useTheme } from "../../context/useTheme";

/**
 * Barre de recherche simple et moderne
 * Principe: Single Responsibility - Gère uniquement la recherche
 */
const SearchBar = ({ searchTerm, onSearchChange }) => {
  const { darkMode } = useTheme();
  return (
    <div className="relative max-w-md">
      <div className="relative">
        <FiSearch
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
          size={20}
        />
        <input
          type="text"
          placeholder="Rechercher une tâche..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full pl-10 pr-10 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${
            darkMode
              ? "bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50"
              : "bg-white/70 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-400"
          }`}
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
              darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FiX size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
