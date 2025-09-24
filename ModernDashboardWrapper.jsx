import React from "react";
import { TodoProvider } from "../../context/TodoProvider.jsx";
import { UserProvider } from "../../context/UserProvider.jsx";
import { ThemeProvider } from "../../context/ThemeProvider.jsx";
import ModernDashboard from "../dashboard/ModernDashboard.jsx";
// import ModernDashboard from "./ModernDashboard.jsx";

/**
 * Wrapper qui encapsule ModernDashboard avec tous les providers nécessaires
 */
const ModernDashboardWrapper = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <TodoProvider>
          <ModernDashboard />
        </TodoProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default ModernDashboardWrapper;
