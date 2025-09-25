import React from "react";
import { FiSearch } from "react-icons/fi";
import { useTheme } from "../../context/useTheme";

const SearchBar = ({ value, onChange, placeholder }) => {
  const { darkMode } = useTheme();

  return (
    <div className="relative w-full max-w-md">
      <FiSearch
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Rechercher..."}
        className={`w-full py-2 pl-10 pr-4 text-sm rounded-lg outline-none transition-all duration-300 focus:ring-2 ${
          darkMode
            ? "bg-gray-800 text-white placeholder-gray-400 focus:ring-blue-500"
            : "bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-400"
        }`}
        aria-label="Rechercher des tâches"
      />
    </div>
  );
};

export default SearchBar;
