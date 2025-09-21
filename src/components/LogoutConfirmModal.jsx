import React from "react";
import { FiLogOut, FiX, FiAlertTriangle } from "react-icons/fi";

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm, darkMode }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
    if (e.key === "Enter") {
      onConfirm();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className={`w-full max-w-md rounded-xl shadow-2xl transform transition-all duration-300 scale-100 ${
          darkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        {/* En-tête avec icône d'alerte */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                darkMode ? "bg-orange-900/30" : "bg-orange-100"
              }`}
            >
              <FiAlertTriangle
                className={`${
                  darkMode ? "text-orange-400" : "text-orange-600"
                }`}
                size={20}
              />
            </div>
            <div>
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Confirmer la déconnexion
              </h3>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Cette action vous déconnectera
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-300"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
            aria-label="Fermer"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg ${
                darkMode
                  ? "bg-orange-900/20 border border-orange-800/30"
                  : "bg-orange-50 border border-orange-200"
              }`}
            >
              <p
                className={`text-sm ${
                  darkMode ? "text-orange-300" : "text-orange-700"
                }`}
              >
                <FiLogOut className="inline mr-2" size={16} />
                Êtes-vous sûr de vouloir vous déconnecter ?
              </p>
              <ul
                className={`text-xs mt-2 space-y-1 ${
                  darkMode ? "text-orange-400" : "text-orange-600"
                }`}
              >
                <li>• Votre session sera fermée</li>
                <li>
                  • Vous devrez vous reconnecter pour accéder à vos tâches
                </li>
                <li>• Les données non sauvegardées seront perdues</li>
              </ul>
            </div>

            <div
              className={`p-3 rounded-lg ${
                darkMode ? "bg-gray-900/50" : "bg-gray-50"
              }`}
            >
              <p
                className={`text-xs text-center ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                💡 Astuce : Vous pouvez utiliser Ctrl+Alt+L pour vous
                déconnecter rapidement
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          className={`flex gap-3 p-6 border-t ${
            darkMode ? "border-gray-700" : "border-gray-200/50"
          }`}
        >
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              darkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <FiLogOut className="inline mr-2" size={16} />
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
