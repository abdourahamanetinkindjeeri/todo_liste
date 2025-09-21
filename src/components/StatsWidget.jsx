import React from "react";
import {
  FiTrendingUp,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiTarget,
  FiActivity,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const StatsWidget = ({ stats, darkMode, isExpanded, onToggle }) => {
  const StatCard = ({ icon: Icon, label, value, gradient, trend }) => (
    <div
      className={`relative overflow-hidden rounded-xl p-4 ${
        darkMode
          ? "bg-gray-800/50 border border-gray-700/50"
          : "bg-white/70 border border-gray-200/50"
      } backdrop-blur-sm hover:scale-105 transition-all duration-200 group`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {label}
          </p>
          <p
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {value}
          </p>
          {trend && (
            <p
              className={`text-xs flex items-center gap-1 ${
                trend > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              <FiTrendingUp size={12} />
              {trend > 0 ? "+" : ""}
              {trend}%
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
        >
          <Icon className="text-white" size={20} />
        </div>
      </div>

      {/* Ligne de progression pour le taux de completion */}
      {label === "Taux de completion" && (
        <div className="mt-3">
          <div
            className={`w-full h-2 rounded-full ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );

  if (!isExpanded) {
    return (
      <div
        className={`rounded-xl p-4 ${
          darkMode
            ? "bg-gray-800/50 border border-gray-700/50"
            : "bg-white/70 border border-gray-200/50"
        } backdrop-blur-sm`}
      >
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-3">
            <FiActivity
              className={`${darkMode ? "text-blue-400" : "text-blue-600"}`}
              size={20}
            />
            <span
              className={`font-medium ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Statistiques ({stats.total} tâches)
            </span>
          </div>
          <FiChevronDown
            className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
            size={20}
          />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl p-6 ${
        darkMode
          ? "bg-gray-800/50 border border-gray-700/50"
          : "bg-white/70 border border-gray-200/50"
      } backdrop-blur-sm space-y-6`}
    >
      {/* En-tête avec toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiActivity
            className={`${darkMode ? "text-blue-400" : "text-blue-600"}`}
            size={24}
          />
          <div>
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Tableau de bord
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Vue d'ensemble de vos tâches
            </p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`p-2 rounded-lg transition-colors ${
            darkMode
              ? "hover:bg-gray-700 text-gray-400"
              : "hover:bg-gray-100 text-gray-500"
          }`}
        >
          <FiChevronUp size={20} />
        </button>
      </div>

      {/* Grille de statistiques */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={FiTarget}
          label="Total tâches"
          value={stats.total}
          gradient="from-blue-500 to-indigo-600"
          trend={stats.total > 0 ? 12 : 0}
        />

        <StatCard
          icon={FiUsers}
          label="Mes tâches"
          value={stats.myTodos}
          gradient="from-purple-500 to-pink-600"
          trend={stats.myTodos > 0 ? 8 : 0}
        />

        <StatCard
          icon={FiCheckCircle}
          label="Terminées"
          value={stats.completed}
          gradient="from-emerald-500 to-green-600"
          trend={stats.completed > 0 ? 15 : 0}
        />

        <StatCard
          icon={FiTrendingUp}
          label="Taux de completion"
          value={stats.completionRate}
          gradient="from-amber-500 to-orange-600"
        />
      </div>

      {/* Détails supplémentaires */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Répartition par statut */}
        <div
          className={`p-4 rounded-lg ${
            darkMode ? "bg-gray-900/50" : "bg-gray-50/50"
          }`}
        >
          <h4
            className={`text-sm font-medium mb-3 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Répartition des tâches
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  En attente
                </span>
              </div>
              <span
                className={`text-sm font-medium ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.pending}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  En cours
                </span>
              </div>
              <span
                className={`text-sm font-medium ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.inProgress}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Terminées
                </span>
              </div>
              <span
                className={`text-sm font-medium ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.completed}
              </span>
            </div>
          </div>
        </div>

        {/* Métriques de performance */}
        <div
          className={`p-4 rounded-lg ${
            darkMode ? "bg-gray-900/50" : "bg-gray-50/50"
          }`}
        >
          <h4
            className={`text-sm font-medium mb-3 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Performance
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Productivité
              </span>
              <div className="flex items-center gap-2">
                <div
                  className={`w-16 h-1 rounded-full ${
                    darkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <div
                    className="h-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
                    style={{ width: `${Math.min(stats.completionRate, 100)}%` }}
                  />
                </div>
                <span
                  className={`text-xs font-medium ${
                    darkMode ? "text-green-400" : "text-green-600"
                  }`}
                >
                  {stats.completionRate > 75
                    ? "Excellent"
                    : stats.completionRate > 50
                    ? "Bon"
                    : "À améliorer"}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Charge de travail
              </span>
              <span
                className={`text-xs font-medium ${
                  stats.myTodos > 10
                    ? darkMode
                      ? "text-red-400"
                      : "text-red-600"
                    : stats.myTodos > 5
                    ? darkMode
                      ? "text-amber-400"
                      : "text-amber-600"
                    : darkMode
                    ? "text-green-400"
                    : "text-green-600"
                }`}
              >
                {stats.myTodos > 10
                  ? "Élevée"
                  : stats.myTodos > 5
                  ? "Modérée"
                  : "Faible"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsWidget;
