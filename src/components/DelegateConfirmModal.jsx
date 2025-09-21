import React, { useEffect } from "react";
import { FiUserPlus, FiX, FiCheck, FiUser } from "react-icons/fi";

const DelegateConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
  darkMode,
  todoTitle,
  selectedUser,
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
        className={`relative w-full max-w-md mx-4 rounded-xl shadow-2xl border transform transition-all duration-300 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
        style={{
          animation: "modalSlideIn 0.2s ease-out",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h3
            className={`text-lg font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Déléguer la tâche ?
          </h3>
          <button
            onClick={onCancel}
            className={`p-1 rounded-lg transition-colors ${
              darkMode
                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-300"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          <div className="space-y-3 text-center">
            {/* Info compacte */}
            <div
              className={`p-3 rounded-lg ${
                darkMode ? "bg-gray-700/30" : "bg-gray-50"
              }`}
            >
              <p
                className={`text-sm mb-2 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                📋 <strong>"{todoTitle}"</strong>
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
                  <FiUser className="text-white" size={14} />
                </div>
                <div className="text-left">
                  <p
                    className={`text-sm font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedUser?.username}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 pt-2">
          <button
            onClick={onCancel}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 font-medium text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Déléguer
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

export default DelegateConfirmModal;
