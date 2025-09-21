import React from "react";
import { TodoProvider } from "../context/TodoProvider";
import { useTheme } from "../context/useTheme";
import ModernTodoBoard from "./ModernTodoBoard";

const Dashboard = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <TodoProvider>
      <div
        className={`min-h-screen transition-all duration-500 ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900"
            : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        }`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3b82f6,transparent)]"></div>
        </div>

        {/* Main Content */}
        <ModernTodoBoard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </div>
    </TodoProvider>
  );
};

export default Dashboard;
