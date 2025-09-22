import React, { useState, useEffect } from "react";
import { useTodoContext } from "../../context/useTodoContext.jsx";
import { useUserContext } from "../../context/useUserContext.jsx";
import { useTheme } from "../../context/useTheme.jsx";
import { Button } from "../ui/index.js";
import {
  FiEdit3,
  FiTrash2,
  FiUser,
  FiClock,
  FiImage,
  FiMoreVertical,
} from "react-icons/fi";
import { API_BASE_URL, API_ENDPOINTS } from "../../constants/api.js";
import ReactDOM from "react-dom";

/**
 * Carte de tâche simplifiée
 * @param {Object} props
 * @param {Object} props.todo - Objet tâche
 * @param {Function} props.onEdit - Fonction appelée pour éditer la tâche
 * @param {Function} props.showNotification - Fonction pour afficher les notifications
 */
const SimpleTodoCard = ({ todo, onEdit, showNotification }) => {
  const [showDelegateModal, setShowDelegateModal] = useState(false);
  const [delegateUser, setDelegateUser] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState("");

  const { user: currentUser, token } = useUserContext();

  useEffect(() => {
    if (showDelegateModal) {
      setLoadingUsers(true);
      setUsersError("");
      const authToken = token || localStorage.getItem("token");
      fetch(API_BASE_URL + API_ENDPOINTS.USERS.BASE, {
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.data) && data.data.length > 0) {
            setUsersList(data.data);
          } else {
            setUsersList([]);
            setUsersError("Aucun utilisateur disponible");
          }
        })
        .catch(() => {
          setUsersList([]);
          setUsersError("Erreur lors du chargement des utilisateurs");
        })
        .finally(() => setLoadingUsers(false));
    }
  }, [showDelegateModal, token]);

  const handleDelegate = () => {
    setShowDelegateModal(true);
  };

  const { changeStatus, deleteTodo, TODO_STATUSES, delegateTodo } =
    useTodoContext();
  const { darkMode } = useTheme();

  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner =
    todo.userId === currentUser?.id || todo.user?.id === currentUser?.id;
  const canModify = isOwner;

  const handleStatusChange = async (newStatus) => {
    if (!canModify) {
      showNotification(
        "error",
        "Vous n'êtes pas autorisé à modifier cette tâche"
      );
      return;
    }

    setIsChangingStatus(true);
    try {
      const result = await changeStatus(todo.id, newStatus);
      if (result.success) {
        showNotification("success", "Statut mis à jour");
      } else {
        showNotification(
          "error",
          result.error || "Erreur lors du changement de statut"
        );
      }
    } catch (error) {
      showNotification("error", "Erreur lors du changement de statut" + error);
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!canModify) {
      showNotification(
        "error",
        "Vous n'êtes pas autorisé à supprimer cette tâche"
      );
      return;
    }
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setShowDeleteConfirm(false);
    try {
      const result = await deleteTodo(todo.id);
      if (result.success) {
        showNotification("success", "Tâche supprimée");
      } else {
        showNotification(
          "error",
          result.error || "Erreur lors de la suppression"
        );
      }
    } catch (error) {
      showNotification("error", "Erreur lors de la suppression" + error);
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelegate = async () => {
    if (!delegateUser) {
      showNotification("error", "Veuillez choisir un utilisateur");
      return;
    }
    setShowDelegateModal(false);
    try {
      const result = await delegateTodo(todo.id, delegateUser);
      if (result.success) {
        showNotification(
          "success",
          `Tâche déléguée à ${
            usersList.find((u) => u.id === Number(delegateUser))?.name ||
            delegateUser
          }`
        );
      } else {
        showNotification(
          "error",
          result.error || "Erreur lors de la délégation"
        );
      }
    } catch (error) {
      showNotification("error", "Erreur lors de la délégation" + error);
    }
  };

  const getStatusColor = () => {
    switch (todo.statut) {
      case TODO_STATUSES.EN_ATTENTE:
        return darkMode ? "text-amber-400" : "text-amber-600";
      case TODO_STATUSES.EN_COURS:
        return darkMode ? "text-blue-400" : "text-blue-600";
      case TODO_STATUSES.TERMINEE:
        return darkMode ? "text-emerald-400" : "text-emerald-600";
      default:
        return darkMode ? "text-gray-400" : "text-gray-600";
    }
  };

  const getStatusLabel = () => {
    switch (todo.statut) {
      case TODO_STATUSES.EN_ATTENTE:
        return "En attente";
      case TODO_STATUSES.EN_COURS:
        return "En cours";
      case TODO_STATUSES.TERMINEE:
        return "Terminée";
      default:
        return "Inconnu";
    }
  };

  // Remplacement du rendu direct des modals par ReactDOM.createPortal
  function ModalOverlay({ children }) {
    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
        {children}
        <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s; }
        @keyframes pop-in { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop-in { animation: pop-in 0.25s cubic-bezier(.4,2,.3,1); }
      `}</style>
      </div>,
      document.body
    );
  }

  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
        darkMode
          ? "bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70"
          : "bg-white/70 border-gray-200 hover:bg-white"
      }`}
    >
      {/* Modal de confirmation suppression */}
      {showDeleteConfirm && (
        <ModalOverlay>
          <div
            className={`p-6 rounded-2xl shadow-2xl w-full max-w-sm border ${
              darkMode
                ? "bg-gray-900 text-white border-gray-700"
                : "bg-white text-gray-900 border-gray-200"
            } animate-pop-in`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`mb-3 flex items-center justify-center w-12 h-12 rounded-full ${
                  darkMode ? "bg-red-900/30" : "bg-red-100"
                }`}
              >
                <FiTrash2
                  size={28}
                  className={darkMode ? "text-red-400" : "text-red-600"}
                />
              </div>
              <h3 className="mb-1 text-lg font-bold text-center">
                Suppression de la tâche
              </h3>
              <p
                className={`mb-5 text-sm text-center ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action
                est{" "}
                <span className="font-semibold text-red-500">irréversible</span>
                .
              </p>
              <div className="flex justify-center w-full gap-3">
                <Button
                  variant="danger"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 font-semibold rounded-lg shadow-sm"
                >
                  {isDeleting ? "Suppression..." : "Oui, supprimer"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 font-semibold rounded-lg"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </ModalOverlay>
      )}
      {/* En-tête avec titre */}
      <div className="flex items-start justify-between mb-3">
        <h4
          className={`font-semibold text-sm ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {todo.titre || todo.libelle}
        </h4>
      </div>

      {/* Boutons d'action visibles */}
      {canModify && (
        <div className="flex justify-end gap-2 mb-3">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 px-3 py-1 rounded-lg font-medium ${
              darkMode
                ? "text-blue-300 hover:bg-blue-900/30"
                : "text-blue-700 hover:bg-blue-50"
            }`}
            onClick={() => onEdit(todo)}
          >
            <FiEdit3 size={14} /> Modifier
          </Button>
          <Button
            variant="danger"
            size="sm"
            className={`flex items-center gap-1 px-3 py-1 rounded-lg font-medium ${
              darkMode
                ? "text-red-300 hover:bg-red-900/30"
                : "text-red-600 hover:bg-red-50"
            }`}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <FiTrash2 size={14} /> {isDeleting ? "..." : "Supprimer"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 px-3 py-1 rounded-lg font-medium ${
              darkMode
                ? "text-amber-300 hover:bg-amber-900/30"
                : "text-amber-600 hover:bg-amber-50"
            }`}
            onClick={handleDelegate}
          >
            <FiUser size={14} /> Déléguer
          </Button>
          {/* Modal de délégation moderne */}
          {showDelegateModal && (
            <ModalOverlay>
              <div
                className={`p-6 rounded-2xl shadow-2xl w-full max-w-sm border ${
                  darkMode
                    ? "bg-gray-900 text-white border-gray-700"
                    : "bg-white text-gray-900 border-gray-200"
                } animate-pop-in`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`mb-3 flex items-center justify-center w-12 h-12 rounded-full ${
                      darkMode ? "bg-amber-900/30" : "bg-amber-100"
                    }`}
                  >
                    <FiUser
                      size={28}
                      className={darkMode ? "text-amber-300" : "text-amber-600"}
                    />
                  </div>
                  <h3 className="mb-1 text-lg font-bold text-center">
                    Déléguer la tâche
                  </h3>
                  <p
                    className={`mb-5 text-sm text-center ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Choisissez l'utilisateur à qui déléguer cette tâche.
                  </p>
                  <select
                    className={`mb-4 w-full px-3 py-2 rounded-lg border outline-none ${
                      darkMode
                        ? "bg-gray-800 text-white border-gray-700"
                        : "bg-gray-100 text-gray-900 border-gray-300"
                    }`}
                    value={delegateUser}
                    onChange={(e) => setDelegateUser(e.target.value)}
                    disabled={loadingUsers || !!usersError}
                  >
                    <option value="">
                      {loadingUsers
                        ? "Chargement..."
                        : "Sélectionner un utilisateur"}
                    </option>
                    {usersList.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.prenom || user.name || user.email}
                      </option>
                    ))}
                  </select>
                  {usersError && (
                    <div className="mb-2 text-sm text-center text-red-500">
                      {usersError}
                    </div>
                  )}
                  <div className="flex justify-center w-full gap-3">
                    <Button
                      variant="primary"
                      onClick={confirmDelegate}
                      className="px-4 py-2 font-semibold rounded-lg shadow-sm"
                    >
                      Valider
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowDelegateModal(false)}
                      className="px-4 py-2 font-semibold rounded-lg"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </div>
            </ModalOverlay>
          )}
        </div>
      )}

      {/* Description */}
      {todo.description && (
        <p
          className={`text-sm mb-3 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {todo.description.length > 100
            ? `${todo.description.substring(0, 100)}...`
            : todo.description}
        </p>
      )}

      {/* Photo si disponible */}
      {todo.photo && (
        <img
          src={`http://localhost:8888/${todo.photo}`}
          alt="Illustration"
          className="object-cover w-full h-20 mb-3 rounded-lg"
        />
      )}

      {/* Informations supplémentaires */}
      <div className="flex items-center gap-2 mb-3 text-xs">
        <FiUser
          size={12}
          className={darkMode ? "text-gray-400" : "text-gray-500"}
        />
        <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
          {todo.user?.prenom || todo.user?.name || "Utilisateur"}
        </span>

        <FiClock
          size={12}
          className={darkMode ? "text-gray-400" : "text-gray-500"}
        />
        <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
          {new Date(todo.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Statut */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${getStatusColor()}`}>
          {getStatusLabel()}
        </span>

        {canModify && (
          <div className="flex gap-1">
            {todo.statut !== TODO_STATUSES.EN_ATTENTE && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleStatusChange(TODO_STATUSES.EN_ATTENTE)}
                disabled={isChangingStatus}
                className="text-xs"
              >
                À faire
              </Button>
            )}
            {todo.statut !== TODO_STATUSES.EN_COURS && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleStatusChange(TODO_STATUSES.EN_COURS)}
                disabled={isChangingStatus}
                className="text-xs"
              >
                En cours
              </Button>
            )}
            {todo.statut !== TODO_STATUSES.TERMINEE && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleStatusChange(TODO_STATUSES.TERMINEE)}
                disabled={isChangingStatus}
                className="text-xs"
              >
                Terminé
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleTodoCard;
