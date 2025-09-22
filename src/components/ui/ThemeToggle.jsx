import React from "react";
import { useTheme } from "../../context/useTheme.jsx";
import { FiSun, FiMoon } from "react-icons/fi";

/**
 * Composant pour basculer entre le mode clair et sombre
 */
const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className={`p-3 rounded-xl transition-all duration-200 ${
        darkMode
          ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30"
          : "bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200"
      }`}
      title={darkMode ? "Mode clair" : "Mode sombre"}
      aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
    >
      {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
};

export default ThemeToggle;