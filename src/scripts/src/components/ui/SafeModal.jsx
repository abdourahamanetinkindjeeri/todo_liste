import React from "react";

export const SafeModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6">
        {children}
        <button
          className="mt-4 px-4 py-2 rounded bg-gray-300"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </div>
  );
};
