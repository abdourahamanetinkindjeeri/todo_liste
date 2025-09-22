import React from "react";
import { TodoProvider } from "../../context/TodoProvider.jsx";
import { useTheme } from "../../context/useTheme.jsx";
import DashboardLayout from "../../components/common/DashboardLayout.jsx";
import DashboardHeader from "./DashboardHeader.jsx";
import TodoWorkspace from "../../components/common/TodoWorkspace.jsx";

/**
 * Dashboard principal de l'application
 */
const SimpleDashboard = () => {
  const { darkMode } = useTheme();

  return (
    <TodoProvider>
      <DashboardLayout darkMode={darkMode}>
        <DashboardHeader />
        <TodoWorkspace />
      </DashboardLayout>
    </TodoProvider>
  );
};

export default SimpleDashboard;