import React, { useEffect } from "react";
import { FiCheckCircle, FiX, FiAlertCircle, FiInfo, FiAlertTriangle } from "react-icons/fi";
import { NOTIFICATION_TYPES, NOTIFICATION_DURATION } from "../../constants/index.js";

/**
 * Composant de notification toast
 * @param {Object} props
 * @param {string} props.type - Type de notification (success, error, warning, info)
 * @param {string} props.message - Message à afficher
 * @param {Function} props.onClose - Fonction appelée lors de la fermeture
 * @param {number} [props.duration] - Durée d'affichage en millisecondes
 */
const NotificationToast = ({ type, message, onClose, duration = NOTIFICATION_DURATION }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return <FiCheckCircle size={20} />;
      case NOTIFICATION_TYPES.ERROR:
        return <FiAlertCircle size={20} />;
      case NOTIFICATION_TYPES.WARNING:
        return <FiAlertTriangle size={20} />;
      case NOTIFICATION_TYPES.INFO:
        return <FiInfo size={20} />;
      default:
        return <FiInfo size={20} />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return "bg-green-500 text-white border-green-600";
      case NOTIFICATION_TYPES.ERROR:
        return "bg-red-500 text-white border-red-600";
      case NOTIFICATION_TYPES.WARNING:
        return "bg-yellow-500 text-white border-yellow-600";
      case NOTIFICATION_TYPES.INFO:
        return "bg-blue-500 text-white border-blue-600";
      default:
        return "bg-gray-500 text-white border-gray-600";
    }
  };

  return (
    <div className="fixed z-50 top-4 right-4 animate-slide-in-right">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border ${getStyles()}`}
        role="alert"
        aria-live="polite"
      >
        <div className="flex-shrink-0" aria-hidden="true">
          {getIcon()}
        </div>
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 transition-colors rounded hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Fermer la notification"
        >
          <FiX size={16} />
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;