import { TodoProvider } from "../../context/TodoProvider.jsx";
import { useTheme } from "../../context/useTheme.jsx";
import { useUserContext } from "../../context/useUserContext.jsx";
import DashboardLayout from "../../components/common/DashboardLayout.jsx";
import DashboardHeader from "./DashboardHeader.jsx";
import TodoWorkspace from "../../components/common/TodoWorkspace.jsx";
import React, { useState } from "react";

/**
 * Dashboard principal de l'application
 */
const SimpleDashboard = () => {
  const { darkMode } = useTheme();
  const { user, logout } = useUserContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("user"); 

  return (
    <TodoProvider>
      <DashboardLayout darkMode={darkMode}>
        <DashboardHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onLogout={logout}
          view={view}
          setView={setView}
        />
        <TodoWorkspace searchTerm={searchTerm} user={user} view={view} />
      </DashboardLayout>
    </TodoProvider>
  );
};

export default SimpleDashboard;
