import React from "react";
import { TodoProvider } from "../../context/TodoProvider";
import { useTheme } from "../../context/useTheme";
import DashboardLayout from "./DashboardLayout";
import DashboardHeader from "./DashboardHeader";
import TodoWorkspace from "./TodoWorkspace";

/**
 * Dashboard principal ultra simple et moderne
 * Principe: Single Responsibility - Gère uniquement l'orchestration générale
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
