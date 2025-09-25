import React from "react";
import ModernDashboardWrapper from "../features/dashboard/ModernDashboardWrapper.jsx";

/**
 * Page de démonstration du ModernDashboard
 * Utilise le wrapper qui inclut tous les providers nécessaires
 */
const ModernDashboardDemo = () => {
  return (
    <div className="min-h-screen">
      <ModernDashboardWrapper />
    </div>
  );
};

export default ModernDashboardDemo;
