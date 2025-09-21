import React from "react";
import {
  FiPlus,
  FiRefreshCw,
  FiTrendingUp,
  FiTarget,
  FiZap,
  FiCalendar,
} from "react-icons/fi";

const QuickActionsWidget = ({ darkMode, onCreateTodo, onRefresh, stats }) => {
  const quickActions = [
    {
      icon: FiPlus,
      label: "Nouvelle tâche",
      action: onCreateTodo,
      color: "from-blue-500 to-indigo-600",
      description: "Créer une nouvelle tâche",
    },
    {
      icon: FiRefreshCw,
      label: "Actualiser",
      action: onRefresh,
      color: "from-gray-500 to-gray-600",
      description: "Recharger les données",
    },
    {
      icon: FiTarget,
      label: "Objectifs",
      action: () => console.log("Objectifs"), // Placeholder
      color: "from-purple-500 to-pink-600",
      description: "Voir mes objectifs",
    },
    {
      icon: FiCalendar,
      label: "Planifier",
      action: () => console.log("Planifier"), // Placeholder
      color: "from-emerald-500 to-green-600",
      description: "Planifier ma journée",
    },
  ];

  const tips = [
    "💡 Glissez-déposez vos tâches pour changer leur statut instantanément",
    "🖱️ Seules vos tâches (avec l'étoile ⭐) peuvent être déplacées",
    "⚡ Utilisez Ctrl+N pour créer une nouvelle tâche rapidement",
    "🎯 Organisez vos tâches par priorité pour être plus efficace",
    "📊 Consultez vos statistiques pour suivre votre progression",
    "🔄 Déplacez facilement vos tâches entre En Attente → En Cours → Terminées",
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div
      className={`rounded-xl p-6 ${
        darkMode
          ? "bg-gray-800/50 border border-gray-700/50"
          : "bg-white/70 border border-gray-200/50"
      } backdrop-blur-sm space-y-6`}
    >
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <FiZap
          className={`${darkMode ? "text-yellow-400" : "text-yellow-600"}`}
          size={24}
        />
        <div>
          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Actions rapides
          </h3>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Accédez rapidement aux fonctionnalités principales
          </p>
        </div>
      </div>

      {/* Grille d'actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`group p-4 rounded-xl border transition-all duration-200 hover:scale-105 ${
              darkMode
                ? "bg-gray-900/50 border-gray-700/50 hover:border-gray-600"
                : "bg-gray-50/50 border-gray-200/50 hover:border-gray-300"
            }`}
          >
            <div className="space-y-3">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow`}
              >
                <action.icon className="text-white" size={20} />
              </div>
              <div className="text-center">
                <p
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {action.label}
                </p>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {action.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Section conseils et résumé */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Conseil du jour */}
        <div
          className={`p-4 rounded-lg ${
            darkMode
              ? "bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-800/30"
              : "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200"
          }`}
        >
          <h4
            className={`text-sm font-medium mb-2 ${
              darkMode ? "text-blue-400" : "text-blue-700"
            }`}
          >
            💡 Conseil du jour
          </h4>
          <p
            className={`text-sm ${
              darkMode ? "text-blue-300" : "text-blue-600"
            }`}
          >
            {randomTip}
          </p>
        </div>

        {/* Résumé rapide */}
        <div
          className={`p-4 rounded-lg ${
            darkMode
              ? "bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-800/30"
              : "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200"
          }`}
        >
          <h4
            className={`text-sm font-medium mb-2 ${
              darkMode ? "text-purple-400" : "text-purple-700"
            }`}
          >
            📈 Résumé rapide
          </h4>
          <div className="flex items-center justify-between text-sm">
            <span
              className={`${darkMode ? "text-purple-300" : "text-purple-600"}`}
            >
              {stats.myTodos} tâches actives
            </span>
            <span
              className={`font-medium ${
                stats.completionRate > 75
                  ? darkMode
                    ? "text-green-400"
                    : "text-green-600"
                  : stats.completionRate > 50
                  ? darkMode
                    ? "text-yellow-400"
                    : "text-yellow-600"
                  : darkMode
                  ? "text-red-400"
                  : "text-red-600"
              }`}
            >
              {stats.completionRate}% terminé
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsWidget;
