const LogoutConfirmModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h3 className="mb-2 text-lg font-bold">Déconnexion</h3>
        <p className="mb-4 text-sm text-gray-700">
          Voulez-vous vraiment vous déconnecter&nbsp;?
        </p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
