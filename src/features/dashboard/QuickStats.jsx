import React from "react";
import { useTheme } from "../../context/useTheme.jsx";
import { useTodoContext } from "../../context/useTodoContext.jsx";
import { FiCheckCircle, FiClock, FiTrendingUp, FiUsers } from "react-icons/fi";

/**
 * Composant affichant les statistiques rapides des tâches
 */
const QuickStats = () => {
  const { darkMode } = useTheme();
  const { todosByStatus, currentUserTodos, showAllTodos, TODO_STATUSES } =
    useTodoContext();

  const stats = [
    {
      icon: FiCheckCircle,
      label: "Terminées",
      value: todosByStatus[TODO_STATUSES.TERMINEE]?.length || 0,
      color: "emerald",
      bgColor: darkMode ? "bg-emerald-500/20" : "bg-emerald-100",
      textColor: darkMode ? "text-emerald-400" : "text-emerald-600",
      borderColor: darkMode ? "border-emerald-500/30" : "border-emerald-200",
    },
    {
      icon: FiTrendingUp,
      label: "En cours",
      value: todosByStatus[TODO_STATUSES.EN_COURS]?.length || 0,
      color: "blue",
      bgColor: darkMode ? "bg-blue-500/20" : "bg-blue-100",
      textColor: darkMode ? "text-blue-400" : "text-blue-600",
      borderColor: darkMode ? "border-blue-500/30" : "border-blue-200",
    },
    {
      icon: FiClock,
      label: "En attente",
      value: todosByStatus[TODO_STATUSES.EN_ATTENTE]?.length || 0,
      color: "amber",
      bgColor: darkMode ? "bg-amber-500/20" : "bg-amber-100",
      textColor: darkMode ? "text-amber-400" : "text-amber-600",
      borderColor: darkMode ? "border-amber-500/30" : "border-amber-200",
    },
    {
      icon: FiUsers,
      label: showAllTodos ? "Total équipe" : "Mes tâches",
      value: showAllTodos
        ? Object.values(todosByStatus).reduce(
            (acc, todos) => acc + todos.length,
            0
          )
        : currentUserTodos.length,
      color: "purple",
      bgColor: darkMode ? "bg-purple-500/20" : "bg-purple-100",
      textColor: darkMode ? "text-purple-400" : "text-purple-600",
      borderColor: darkMode ? "border-purple-500/30" : "border-purple-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`p-4 rounded-xl border transition-all duration-200 hover:scale-105 ${
              stat.bgColor
            } ${stat.borderColor} ${darkMode ? "bg-opacity-50" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={stat.textColor} size={20} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuickStats;