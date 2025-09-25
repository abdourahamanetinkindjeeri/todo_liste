import React from "react";
import NotificationToast from "../ui/NotificationToast.jsx";

/**
 * Container pour afficher toutes les notifications actives
 * @param {Object} props
 * @param {Array} props.notifications - Liste des notifications à afficher
 * @param {Function} props.onRemove - Fonction pour supprimer une notification
 */
const NotificationContainer = ({ notifications, onRemove }) => {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
