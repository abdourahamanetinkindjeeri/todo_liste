import { Modal, Button } from "../ui/index.js";

/**
 * Modal de confirmation de déconnexion
 * @param {Object} props
 * @param {Function} props.onClose - Fonction appelée pour fermer la modal
 * @param {Function} props.onConfirm - Fonction appelée pour confirmer la déconnexion
 */
const LogoutConfirmModal = ({ onClose, onConfirm }) => {
  return (
    <Modal isOpen={true} onClose={onClose} title="Déconnexion" size="sm">
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">
          Voulez-vous vraiment vous déconnecter ?
        </p>
        
        <div className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            color="error"
            onClick={onConfirm}
            className="flex-1"
          >
            Se déconnecter
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutConfirmModal;