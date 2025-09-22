import React from "react";

/**
 * Layout principal du dashboard
 * Principe: Single Responsibility - Gère uniquement la mise en page et le thème
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu à afficher
 * @param {boolean} props.darkMode - Mode sombre activé
 */
const DashboardLayout = ({ children, darkMode }) => {
  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900"
          : "bg-gradient-to-br from-gray-50 via-white to-blue-50"
      }`}
    >
      {/* Motif de fond subtil */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#3b82f6,transparent)]"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default DashboardLayout;