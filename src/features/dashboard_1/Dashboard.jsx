import React, { useState } from "react";
import SimpleDashboard from "./SimpleDashboard.jsx";
import ModernDashboardWrapper from "./ModernDashboardWrapper.jsx";
import { Settings } from "lucide-react";

/**
 * Composant Dashboard principal avec sélecteur de vue
 */
const Dashboard = () => {
  const [useModernView, setUseModernView] = useState(true);

  return (
    <>
      {/* Sélecteur de vue */}
      {/* <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setUseModernView(!useModernView)}
          className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-md text-white border border-white/20 rounded-full shadow-lg hover:bg-black/30 transition-all"
          title={
            useModernView
              ? "Passer à la vue classique"
              : "Passer à la vue moderne"
          }
        >
          <Settings size={16} />
          {useModernView ? "Vue Classique" : "Vue Moderne"}
        </button>
      </div> */}
      <ModernDashboardWrapper />
      {/* Rendu conditionnel */}
      {/* {useModernView ? <ModernDashboardWrapper /> : <SimpleDashboard />} */}
    </>
  );
};

export default Dashboard;
