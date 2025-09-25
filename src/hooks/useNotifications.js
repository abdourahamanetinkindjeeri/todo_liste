import { useState, useCallback } from "react";

/**
 * Hook pour gérer les notifications dans l'application
 * @returns {Object} Objet contenant les méthodes et l'état des notifications
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  /**
   * Supprime une notification par son ID
   * @param {number} id - ID de la notification à supprimer
   */
  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  /**
   * Ajoute une nouvelle notification
   * @param {string} type - Type de notification (success, error, warning, info)
   * @param {string} message - Message à afficher
   * @param {number} [duration=5000] - Durée d'affichage en millisecondes
   */
  const addNotification = useCallback(
    (type, message, duration = 5000) => {
      const id = Date.now() + Math.random();
      const notification = {
        id,
        type,
        message,
        duration,
      };

      setNotifications((prev) => [...prev, notification]);

      // Auto-suppression après la durée spécifiée
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }

      return id;
    },
    [removeNotification]
  );

  /**
   * Supprime toutes les notifications
   */
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  /**
   * Raccourcis pour les différents types de notifications
   */
  const showSuccess = useCallback(
    (message, duration) => addNotification("success", message, duration),
    [addNotification]
  );

  const showError = useCallback(
    (message, duration) => addNotification("error", message, duration),
    [addNotification]
  );

  const showWarning = useCallback(
    (message, duration) => addNotification("warning", message, duration),
    [addNotification]
  );

  const showInfo = useCallback(
    (message, duration) => addNotification("info", message, duration),
    [addNotification]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default useNotifications;
