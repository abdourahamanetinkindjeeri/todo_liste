import React, { useState } from "react";
import Modal from "../components/ui/Modal.jsx";
import { Button } from "../components/ui/index.js";

/**
 * Page de test pour vérifier le composant Modal
 */
const ModalTest = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModalWithoutOnClose, setShowModalWithoutOnClose] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Test du composant Modal</h1>

      <div className="space-y-4">
        <Button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Ouvrir Modal Normale
        </Button>

        <Button
          onClick={() => setShowModalWithoutOnClose(true)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Ouvrir Modal Sans onClose (Test d'erreur)
        </Button>
      </div>

      {/* Modal normale */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Modal Test"
        >
          <p>Cette modal fonctionne normalement avec onClose</p>
          <Button
            onClick={() => setShowModal(false)}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Fermer
          </Button>
        </Modal>
      )}

      {/* Modal sans onClose pour tester l'erreur */}
      {showModalWithoutOnClose && (
        <Modal
          isOpen={showModalWithoutOnClose}
          onClose={undefined} // Ceci devrait être géré gracieusement
          title="Modal Sans onClose"
        >
          <p>Cette modal n'a pas de function onClose valide</p>
          <Button
            onClick={() => setShowModalWithoutOnClose(false)}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Fermer Manuellement
          </Button>
        </Modal>
      )}
    </div>
  );
};

export default ModalTest;
