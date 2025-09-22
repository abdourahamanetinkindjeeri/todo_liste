import React from "react";
import { useTheme } from "../../context/useTheme";
import { FiPlay, FiPause, FiCheckCircle, FiClock } from "react-icons/fi";

/**
 * Boutons de changement de statut plus visibles et intuitifs
 * Principe: Single Responsibility - Gère uniquement les changements de statut
 */
const TodoStatusButtons = ({
  todo,
  onStatusChange,
  isChangingStatus,
  TODO_STATUSES,
  disabled = false,
}) => {
  const { darkMode } = useTheme();
  // Configuration des boutons selon le statut actuel
  const getAvailableActions = () => {
    const actions = [];

    // Bouton "Démarrer" si pas en cours
    if (todo.status !== TODO_STATUSES.EN_COURS) {
      actions.push({
        id: "start",
        label: "Démarrer",
        icon: FiPlay,
        status: TODO_STATUSES.EN_COURS,
        color: "blue",
        priority: todo.status === TODO_STATUSES.EN_ATTENTE ? 1 : 2,
      });
    }

    // Bouton "Pause" si en cours
    if (todo.status === TODO_STATUSES.EN_COURS) {
      actions.push({
        id: "pause",
        label: "Pause",
        icon: FiPause,
        status: TODO_STATUSES.EN_ATTENTE,
        color: "amber",
        priority: 1,
      });
    }

    // Bouton "Terminer" si pas terminé
    if (todo.status !== TODO_STATUSES.TERMINEE) {
      actions.push({
        id: "complete",
        label: "Terminer",
        icon: FiCheckCircle,
        status: TODO_STATUSES.TERMINEE,
        color: "emerald",
        priority: todo.status === TODO_STATUSES.EN_COURS ? 1 : 3,
      });
    }

    // Bouton "Reprendre" si terminé
    if (todo.status === TODO_STATUSES.TERMINEE) {
      actions.push({
        id: "reopen",
        label: "Reprendre",
        icon: FiClock,
        status: TODO_STATUSES.EN_ATTENTE,
        color: "amber",
        priority: 2,
      });
    }

    return actions.sort((a, b) => a.priority - b.priority);
  };

  const actions = getAvailableActions();

  // Si une seule action, bouton principal
  if (actions.length === 1) {
    const action = actions[0];
    const Icon = action.icon;

    return (
      <button
        onClick={() => onStatusChange(action.status)}
        disabled={isChangingStatus || disabled}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 ${
          action.color === "blue"
            ? darkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
            : action.color === "amber"
            ? darkMode
              ? "bg-amber-600 hover:bg-amber-700 text-white"
              : "bg-amber-500 hover:bg-amber-600 text-white"
            : darkMode
            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
            : "bg-emerald-500 hover:bg-emerald-600 text-white"
        }`}
      >
        <Icon size={14} />
        <span>{action.label}</span>
      </button>
    );
  }

  // Si plusieurs actions, boutons compacts
  return (
    <div className="flex items-center gap-1">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={() => onStatusChange(action.status)}
            disabled={isChangingStatus || disabled}
            className={`p-2 rounded-lg transition-all duration-200 disabled:opacity-50 ${
              action.color === "blue"
                ? darkMode
                  ? "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                  : "bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-200"
                : action.color === "amber"
                ? darkMode
                  ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30"
                  : "bg-amber-100 hover:bg-amber-200 text-amber-600 border border-amber-200"
                : darkMode
                ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30"
                : "bg-emerald-100 hover:bg-emerald-200 text-emerald-600 border border-emerald-200"
            }`}
            title={action.label}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
};

export default TodoStatusButtons;
