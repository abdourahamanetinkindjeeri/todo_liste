import React from "react";

/**
 * Modal de confirmation pour retirer la délégation d'une tâche
 * Ultra simple pour débutant React
 */
const RemoveDelegateConfirmModal = ({ todo, onClose, onConfirm }) => {
  if (!todo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-bold mb-2">Retirer la délégation</h3>
        <p className="mb-4 text-sm text-gray-700">
          Voulez-vous vraiment retirer la délégation de cette tâche&nbsp;?
        </p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm && onConfirm(todo)}
            className="flex-1 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Retirer
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveDelegateConfirmModal;
