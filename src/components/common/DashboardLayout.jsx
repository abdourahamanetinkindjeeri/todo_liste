import React from "react";

/**
 * Layout principal du dashboard style Quantum
 * Principe: Single Responsibility - Gère uniquement la mise en page et le thème
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu à afficher
 * @param {boolean} props.darkMode - Mode sombre activé
 */
const DashboardLayout = ({ children, darkMode }) => {
  return (
    <div
      className={`min-h-screen h-screen overflow-hidden transition-all duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
      style={{ overflow: "hidden" }}
    >
      {/* Contenu principal sans scroll */}
      <div className="relative z-10 h-full" style={{ overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
