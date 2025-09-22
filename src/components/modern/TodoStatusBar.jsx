import React from "react";
import { useTheme } from "../../context/useTheme";
import { FiClock, FiPlay, FiCheckCircle } from "react-icons/fi";

const TodoStatusBar = ({ todo, TODO_STATUSES }) => {
  const { darkMode } = useTheme();
  const getStatusInfo = () => {
    switch (todo.status) {
      case TODO_STATUSES.EN_ATTENTE:
        return {
          progress: 0,
          color: "amber",
          icon: FiClock,
          label: "En attente",
          bgColor: darkMode ? "bg-amber-500/20" : "bg-amber-100",
          textColor: darkMode ? "text-amber-400" : "text-amber-600",
          borderColor: darkMode ? "border-amber-500/30" : "border-amber-200",
        };
      case TODO_STATUSES.EN_COURS:
        return {
          progress: 50,
          color: "blue",
          icon: FiPlay,
          label: "En cours",
          bgColor: darkMode ? "bg-blue-500/20" : "bg-blue-100",
          textColor: darkMode ? "text-blue-400" : "text-blue-600",
          borderColor: darkMode ? "border-blue-500/30" : "border-blue-200",
        };
      case TODO_STATUSES.TERMINEE:
        return {
          progress: 100,
          color: "emerald",
          icon: FiCheckCircle,
          label: "Terminée",
          bgColor: darkMode ? "bg-emerald-500/20" : "bg-emerald-100",
          textColor: darkMode ? "text-emerald-400" : "text-emerald-600",
          borderColor: darkMode
            ? "border-emerald-500/30"
            : "border-emerald-200",
        };
      default:
        return {
          progress: 0,
          color: "gray",
          icon: FiClock,
          label: "Non défini",
          bgColor: darkMode ? "bg-gray-500/20" : "bg-gray-100",
          textColor: darkMode ? "text-gray-400" : "text-gray-600",
          borderColor: darkMode ? "border-gray-500/30" : "border-gray-200",
        };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  return (
    <div className="space-y-2">
      {/* Étiquette de statut */}
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full border ${statusInfo.bgColor} ${statusInfo.borderColor}`}
        >
          <Icon size={12} className={statusInfo.textColor} />
          <span className={`text-xs font-medium ${statusInfo.textColor}`}>
            {statusInfo.label}
          </span>
        </div>
        <span
          className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}
        >
          {statusInfo.progress}%
        </span>
      </div>

      {/* Barre de progression */}
      <div
        className={`relative h-2 rounded-full overflow-hidden ${
          darkMode ? "bg-gray-700" : "bg-gray-200"
        }`}
      >
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${
            statusInfo.color === "amber"
              ? "bg-gradient-to-r from-amber-400 to-yellow-500"
              : statusInfo.color === "blue"
              ? "bg-gradient-to-r from-blue-400 to-indigo-500"
              : "bg-gradient-to-r from-emerald-400 to-green-500"
          }`}
          style={{ width: `${statusInfo.progress}%` }}
        />

        {/* Effet de brillance */}
        {statusInfo.progress > 0 && (
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
            style={{ width: `${statusInfo.progress}%` }}
          />
        )}
      </div>
    </div>
  );
};

export default TodoStatusBar;
