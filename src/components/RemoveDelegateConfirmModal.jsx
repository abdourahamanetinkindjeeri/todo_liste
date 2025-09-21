import React, { useEffect } from "react";
import {
  FiUserMinus,
  FiX,
  FiCheck,
  FiUser,
  FiAlertTriangle,
} from "react-icons/fi";

const RemoveDelegateConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
  darkMode,
  todoTitle,
  currentDelegate,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      } else if (e.key === "Enter") {
        onConfirm();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel, onConfirm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg mx-4 rounded-2xl shadow-2xl border transform transition-all duration-300 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
        style={{
          animation: "modalSlideIn 0.2s ease-out",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <FiAlertTriangle
                className="text-orange-600 dark:text-orange-400"
                size={24}
              />
            </div>
            <div>
              <h3
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Retirer la délégation
              </h3>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Reprendre la tâche
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? "hover:bg-gray-700 text-gray-400"
                : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center space-y-4">
            {/* Tâche */}
            <div
              className={`p-4 rounded-xl ${
                darkMode
                  ? "bg-gray-700/50 border border-gray-600"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <p
                className={`text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Tâche concernée :
              </p>
              <p
                className={`font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                "{todoTitle}"
              </p>
            </div>

            {/* Utilisateur actuel */}
            <div
              className={`p-4 rounded-xl ${
                darkMode
                  ? "bg-orange-900/20 border border-orange-800/30"
                  : "bg-orange-50 border border-orange-200"
              }`}
            >
              <p
                className={`text-sm font-medium mb-3 ${
                  darkMode ? "text-orange-400" : "text-orange-600"
                }`}
              >
                Actuellement assignée à :
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                  <FiUser className="text-white" size={18} />
                </div>
                <div className="text-left">
                  <p
                    className={`font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {currentDelegate?.username || "Utilisateur"}
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {currentDelegate?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Message de confirmation */}
            <div
              className={`p-4 rounded-xl ${
                darkMode
                  ? "bg-yellow-900/20 border border-yellow-800/30"
                  : "bg-yellow-50 border border-yellow-200"
              }`}
            >
              <FiAlertTriangle
                className={`mx-auto mb-2 ${
                  darkMode ? "text-yellow-400" : "text-yellow-600"
                }`}
                size={24}
              />
              <p
                className={`text-sm ${
                  darkMode ? "text-yellow-300" : "text-yellow-700"
                }`}
              >
                En retirant cette délégation, la tâche vous sera réassignée
                automatiquement. L'utilisateur actuel sera notifié de ce
                changement.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onCancel}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 hover:shadow-lg transform hover:scale-105"
          >
            <FiUserMinus size={16} />
            Retirer la délégation
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default RemoveDelegateConfirmModal;
