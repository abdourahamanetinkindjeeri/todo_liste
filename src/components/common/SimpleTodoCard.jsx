import React, { useState, useEffect } from "react";
import { useTodoContext } from "../../context/useTodoContext.jsx";
import { useUserContext } from "../../context/useUserContext.jsx";
import { useTheme } from "../../context/useTheme.jsx";
import { Button, VoicePlayer, AudioPlayer } from "../ui/index.js";
import { Pencil, Trash2, User, Clock, Calendar } from "lucide-react";
import { API_BASE_URL, API_ENDPOINTS } from "../../constants/api.js";
import ReactDOM from "react-dom";

/**
 * Carte de tâche style Quantum
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

  // Définition du style et du texte du badge et de la bordure selon le statut
  let statusBadge = null;
  let borderColor = "";
  let borderStyle = "border-solid";
  if (todo.statut === TODO_STATUSES.EN_ATTENTE) {
    statusBadge = (
      <span className="absolute px-2 py-1 text-xs font-bold text-yellow-900 bg-yellow-400 rounded shadow top-2 right-2">
        En attente
      </span>
    );
    borderColor = "border-l-8 border-yellow-400";
  } else if (todo.statut === TODO_STATUSES.EN_COURS) {
    statusBadge = (
      <span className="absolute px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded shadow top-2 right-2">
        En cours
      </span>
    );
    borderColor = "border-l-8 border-blue-500";
  } else if (todo.statut === TODO_STATUSES.TERMINEE) {
    statusBadge = (
      <span className="absolute px-2 py-1 text-xs font-bold text-white bg-green-500 rounded shadow top-2 right-2">
        Terminée
      </span>
    );
    borderColor = "border-l-8 border-green-500";
  }

  return (
    <div
      className={`relative h-full w-full rounded-lg border ${borderStyle} transition-all duration-200 hover:shadow-md flex flex-col ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } ${borderColor}`}
    >
      {/* Badge de statut */}
      {statusBadge}
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
                <Trash2
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

      {/* Partie supérieure - Flexible */}
      <div className="flex flex-1 min-h-0">
        {/* Photo - Largeur 1/2 */}
        <div className="flex-shrink-0 w-1/2 overflow-hidden rounded-tl-lg">
          {todo.photo ? (
            <img
              src={`http://localhost:8888/${todo.photo}`}
              alt="Illustration"
              className="object-cover w-full h-full"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <div
                className={`text-2xl font-bold ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {(todo.titre || todo.libelle || "T").charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>

        {/* Informations principales - Largeur 1/2 */}
        <div className="flex flex-col justify-between w-1/2 min-h-0 p-3">
          {/* En-tête avec titre et actions */}
          <div className="flex items-start justify-between mb-2">
            <h4
              className={`font-semibold text-sm leading-tight flex-1 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {todo.titre || todo.libelle}
            </h4>

            {canModify && (
              <div className="flex gap-1 ml-2">
                <button
                  title="Éditer"
                  className={`p-1 rounded transition-colors ${
                    darkMode
                      ? "text-gray-400 hover:text-blue-400 hover:bg-gray-700"
                      : "text-gray-500 hover:text-blue-600 hover:bg-gray-100"
                  }`}
                  onClick={() => onEdit(todo)}
                >
                  <Pencil size={12} />
                </button>
                <button
                  title="Supprimer"
                  className={`p-1 rounded transition-colors ${
                    darkMode
                      ? "text-gray-400 hover:text-red-400 hover:bg-gray-700"
                      : "text-gray-500 hover:text-red-600 hover:bg-gray-100"
                  }`}
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 size={12} />
                </button>
                <button
                  title="Déléguer"
                  className={`p-1 rounded transition-colors ${
                    darkMode
                      ? "text-gray-400 hover:text-amber-400 hover:bg-gray-700"
                      : "text-gray-500 hover:text-amber-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setShowDelegateModal(true)}
                >
                  <User size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Informations utilisateur et date */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                  darkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {(todo.user?.prenom || todo.user?.name || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <span
                className={`text-xs ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {todo.user?.prenom || todo.user?.name || "Utilisateur"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar
                size={10}
                className={darkMode ? "text-gray-400" : "text-gray-500"}
              />
              <span
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {todo.createdAt
                  ? new Date(todo.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                    })
                  : ""}
              </span>
            </div>

            {/* Lecteurs audio et vocal */}
            <div className="mt-1 space-y-1">
              {/* Lecteur pour enregistrement vocal stocké */}
              {todo.vocal && (
                <AudioPlayer
                  audioUrl={todo.vocal}
                  compact={true}
                  darkMode={darkMode}
                />
              )}

              {/* Lecteur de synthèse vocale */}
              <VoicePlayer
                title={todo.titre || todo.libelle}
                description={todo.description}
                compact={true}
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Partie inférieure - Flexible */}
      <div className="flex flex-col flex-1 min-h-0 p-3">
        {/* Description */}
        <div className="flex-1 mb-2">
          {todo.description && (
            <p
              className={`text-xs leading-relaxed ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {todo.description.length > 60
                ? `${todo.description.substring(0, 60)}...`
                : todo.description}
            </p>
          )}
        </div>

        {/* Boutons d'action pour changement de statut */}
        {canModify && (
          <div className="flex gap-1 pt-2 border-t border-gray-200 dark:border-gray-700">
            {todo.statut !== TODO_STATUSES.EN_ATTENTE && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleStatusChange(TODO_STATUSES.EN_ATTENTE)}
                disabled={isChangingStatus}
                className="flex-1 py-1 text-xs"
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
                className="flex-1 py-1 text-xs"
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
                className="flex-1 py-1 text-xs"
              >
                Terminé
              </Button>
            )}
          </div>
        )}
      </div>

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
                <User
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
  );
};

export default SimpleTodoCard;
