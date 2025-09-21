import React, { useState, useEffect } from "react";
import { useTodoContext } from "../context/useTodoContext";
import DelegateConfirmModal from "./DelegateConfirmModal";
import RemoveDelegateConfirmModal from "./RemoveDelegateConfirmModal";
import { FiUser, FiX, FiUserPlus, FiUserMinus, FiSearch } from "react-icons/fi";

const DelegateModal = ({ todo, isOpen, onClose, onDelegate, darkMode }) => {
  const { users, fetchUsers } = useTodoContext();
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset les états quand la modal s'ouvre
      setSelectedUser(null);
      setSearchTerm("");
      setIsLoading(false);
      setShowConfirmModal(false);
      setShowRemoveConfirmModal(false);

      // Charger les utilisateurs si nécessaire
      if (users.length === 0) {
        fetchUsers();
      }

      // Gérer la touche Échap pour fermer la modal
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, users.length, fetchUsers, onClose]);

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  const confirmDelegate = async () => {
    setIsLoading(true);
    setShowConfirmModal(false);
    try {
      await onDelegate(selectedUser.id);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la délégation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDelegate = async () => {
    setShowRemoveConfirmModal(true);
  };

  const confirmRemoveDelegate = async () => {
    setIsLoading(true);
    setShowRemoveConfirmModal(false);
    try {
      await onDelegate(null); // null pour supprimer la délégation
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression de délégation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`w-full max-w-2xl rounded-xl shadow-xl transition-all duration-300 ${
          darkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
        style={{
          maxHeight: "90vh",
          animation: "modalSlideIn 0.2s ease-out",
        }}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200/50">
          <div>
            <h3
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Déléguer la tâche
            </h3>
            <p
              className={`text-base mt-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              "{todo.libelle}"
            </p>
            <p
              className={`text-sm mt-1 ${
                darkMode ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Assignez cette tâche à un membre de votre équipe
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-3 rounded-xl transition-colors ${
              darkMode
                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-300"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-8 space-y-6">
          {/* État actuel */}
          {(todo.delegatedUser || todo.delegatedTo) && (
            <div
              className={`p-4 rounded-xl ${
                darkMode
                  ? "bg-blue-900/20 border border-blue-800/30"
                  : "bg-blue-50 border border-blue-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiUserPlus
                    className={darkMode ? "text-blue-400" : "text-blue-600"}
                    size={20}
                  />
                  <span
                    className={`text-base font-medium ${
                      darkMode ? "text-blue-300" : "text-blue-700"
                    }`}
                  >
                    Actuellement délégué à:
                  </span>
                </div>
                <button
                  onClick={handleRemoveDelegate}
                  disabled={isLoading}
                  className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                    darkMode
                      ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                      : "bg-red-100 text-red-600 hover:bg-red-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <FiUserMinus size={14} className="inline mr-1" />
                  {isLoading ? "..." : "Retirer"}
                </button>
              </div>
              <p
                className={`text-base mt-2 ml-8 ${
                  darkMode ? "text-blue-200" : "text-blue-800"
                }`}
              >
                {todo.delegatedUser?.username ||
                  todo.delegatedTo?.username ||
                  todo.delegatedUser?.email ||
                  todo.delegatedTo?.email ||
                  "Utilisateur délégué"}
              </p>
            </div>
          )}

          {/* Sélection d'utilisateur */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <FiUserPlus
                className={darkMode ? "text-gray-400" : "text-gray-500"}
                size={20}
              />
              <h4
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Déléguer à un utilisateur
              </h4>
            </div>

            {/* Champ de recherche */}
            <div className="relative mb-6">
              <FiSearch
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
                size={16}
              />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>

            {/* Liste des utilisateurs */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div
                  className={`text-center py-12 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <FiUser size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">
                    {searchTerm
                      ? "Aucun utilisateur trouvé"
                      : "Chargement des utilisateurs..."}
                  </p>
                  <p className="text-sm mt-2">
                    {searchTerm
                      ? "Essayez avec un autre terme de recherche"
                      : "Veuillez patienter pendant que nous chargeons la liste"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className={`p-4 rounded-xl border-2 transition-all text-left hover:shadow-lg transform hover:scale-[1.02] ${
                        darkMode
                          ? "border-gray-600 hover:border-blue-500 hover:bg-gray-700 text-white"
                          : "border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                          <FiUser className="text-white" size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-base truncate`}>
                            {user.username || "Utilisateur"}
                          </p>
                          <p
                            className={`text-sm truncate ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {user.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiUserPlus
                            className={
                              darkMode ? "text-blue-400" : "text-blue-600"
                            }
                            size={20}
                          />
                          <span
                            className={`text-sm font-medium ${
                              darkMode ? "text-blue-400" : "text-blue-600"
                            }`}
                          >
                            Déléguer
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 p-8 border-t border-gray-200/50">
          <button
            onClick={onClose}
            className={`w-full px-6 py-3 rounded-xl transition-all font-semibold ${
              darkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md"
            }`}
          >
            Fermer
          </button>
        </div>
      </div>

      {/* Modal de confirmation de délégation */}
      <DelegateConfirmModal
        isOpen={showConfirmModal}
        onConfirm={confirmDelegate}
        onCancel={() => setShowConfirmModal(false)}
        darkMode={darkMode}
        todoTitle={todo.libelle}
        selectedUser={selectedUser}
      />

      {/* Modal de confirmation de suppression de délégation */}
      <RemoveDelegateConfirmModal
        isOpen={showRemoveConfirmModal}
        onConfirm={confirmRemoveDelegate}
        onCancel={() => setShowRemoveConfirmModal(false)}
        darkMode={darkMode}
        todoTitle={todo.libelle}
        currentDelegate={todo.delegatedUser || todo.delegatedTo}
      />

      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
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

export default DelegateModal;
