import React from "react";
import { useUserContext } from "../../context/useUserContext";

const SimpleUserDelegateModal = ({ todo, onClose }) => {
  const { user } = useUserContext();
  // Autorisation : propriétaire ou délégataire
  const isOwner = todo?.userId === user?.id || todo?.user?.id === user?.id;
  const isDelegate = todo?.delegatedTo === user?.id;
  const canDelegate = isOwner || isDelegate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="p-6 bg-white shadow-xl rounded-xl">
        <h2 className="mb-2 text-lg font-bold">Déléguer la tâche</h2>
        {!canDelegate ? (
          <p className="mb-4 font-semibold text-red-600">
            Vous n'avez pas le droit de déléguer cette tâche.
          </p>
        ) : (
          <p className="mb-4">
            Sélectionnez un utilisateur à qui déléguer cette tâche.
          </p>
        )}
        <button
          className={`px-4 py-2 rounded ${
            canDelegate
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={onClose}
          disabled={!canDelegate}
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default SimpleUserDelegateModal;
