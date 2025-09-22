// import React, { useState } from "react";
// import { useTodoContext } from "../../context/useTodoContext";
// import { useUserContext } from "../../context/useUserContext";
// import { useTheme } from "../../context/useTheme";
// import SimpleUserDelegateModal from "./SimpleUserDelegateModal";
// import RemoveDelegateConfirmModal from "../delete/RemoveDelegateConfirmModal";
// import TodoStatusButtons from "./TodoStatusButtons";
// import TodoStatusBar from "./TodoStatusBar";

// import {
//   FiEdit3,
//   FiTrash2,
//   FiUser,
//   FiClock,
//   FiImage,
//   FiMoreVertical,
// } from "react-icons/fi";
// import SimpleEditTodoForm from "./SimpleEditTodoForm";

// const SimpleTodoCard = ({ todo, showNotification }) => {
//   const { changeStatus, TODO_STATUSES, users } = useTodoContext();
//   const { user: currentUser } = useUserContext();
//   const { darkMode } = useTheme();

//   const [showDelegateModal, setShowDelegateModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showRemoveDelegateModal, setShowRemoveDelegateModal] = useState(false);
//   const [showEditingModel, setShowEditingModel] = useState(false);
//   const [isChangingStatus, setIsChangingStatus] = useState(false);

//   const isOwner =
//     todo.userId === currentUser?.id || todo.user?.id === currentUser?.id;
//   const isDelegate = todo.delegatedTo === currentUser?.id;
//   const canModify = isOwner || isDelegate;
//   // Délégation
//   const delegatedUser = users.find((u) => u.id === todo.delegatedTo);
//   const isDelegated =
//     !!todo.delegatedTo && todo.delegatedTo !== currentUser?.id;

//   const handleStatusChange = async (newStatus) => {
//     setIsChangingStatus(true);
//     const result = await changeStatus(todo.id, newStatus);
//     if (result.success) {
//       showNotification("success", "Statut mis à jour");
//     } else {
//       let errorMsg = result.error || "Erreur lors du changement de statut";
//       if (
//         errorMsg.includes("401") ||
//         errorMsg.toLowerCase().includes("unauthorized")
//       ) {
//         errorMsg = "Action non autorisée. Veuillez vous connecter.";
//       }
//       showNotification("error", errorMsg);
//     }
//     setIsChangingStatus(false);
//   };

//   return (
//     <div
//       className={`relative group p-4 rounded-xl border-l-4 hover:shadow-lg ${
//         darkMode
//           ? "bg-gray-800/50 border border-gray-700/50"
//           : "bg-white border border-gray-200"
//       }`}
//     >
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex-1 min-w-0">
//           <h4
//             className={`font-semibold text-sm ${
//               darkMode ? "text-white" : "text-gray-900"
//             }`}
//           >
//             {todo.libelle || todo.titre}
//           </h4>
//           {isDelegated && (
//             <div className="flex items-center gap-1 mt-1">
//               <FiUser
//                 size={12}
//                 className={darkMode ? "text-blue-400" : "text-blue-600"}
//               />
//               <span
//                 className={`text-xs ${
//                   darkMode ? "text-blue-400" : "text-blue-600"
//                 }`}
//               >
//                 Délégué à{" "}
//                 {delegatedUser ? (
//                   <>
//                     {delegatedUser.prenom ? delegatedUser.prenom : ""}
//                     {delegatedUser.nom ? ` ${delegatedUser.nom}` : ""}
//                     {delegatedUser.name &&
//                     !delegatedUser.prenom &&
//                     !delegatedUser.nom
//                       ? delegatedUser.name
//                       : ""}
//                     {delegatedUser.email ? ` (${delegatedUser.email})` : ""}
//                   </>
//                 ) : (
//                   "Utilisateur"
//                 )}
//               </span>
//             </div>
//           )}
//         </div>
//         <div className="flex gap-2">
//           {canModify && (
//             <>
//               <button
//                 onClick={() => setShowDelegateModal(true)}
//                 className="p-1 text-xs text-blue-600 rounded hover:bg-blue-100"
//               >
//                 Déléguer
//               </button>

//               <button
//                 onClick={() => setShowEditingModel(true)}
//                 className="p-1 text-xs text-gray-600 rounded hover:bg-gray-600 "
//               >
//                 Editer
//               </button>

//               {isDelegated && (
//                 <button
//                   onClick={() => setShowRemoveDelegateModal(true)}
//                   className="p-1 text-xs text-blue-600 rounded hover:bg-blue-100"
//                 >
//                   Retirer délégation
//                 </button>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       <TodoStatusBar todo={todo} TODO_STATUSES={TODO_STATUSES} />

//       {todo.description && (
//         <p
//           className={`text-xs mb-3 ${
//             darkMode ? "text-gray-400" : "text-gray-600"
//           }`}
//         >
//           {todo.description}
//         </p>
//       )}

//       {todo.photo && (
//         <img
//           src={`http://localhost:8888/${todo.photo}`}
//           alt="Illustration"
//           className="object-cover w-full h-20 mb-3 rounded-lg"
//         />
//       )}

//       <TodoStatusButtons
//         todo={todo}
//         onStatusChange={handleStatusChange}
//         isChangingStatus={isChangingStatus}
//         TODO_STATUSES={TODO_STATUSES}
//         disabled={!canModify}
//       />

//       <div className="flex items-center gap-2 text-xs">
//         <FiClock
//           size={12}
//           className={darkMode ? "text-gray-500" : "text-gray-400"}
//         />
//         <span className={darkMode ? "text-gray-500" : "text-gray-500"}>
//           {new Date(todo.createdAt || todo.created_at).toLocaleDateString()}
//         </span>
//         {todo.photo && (
//           <FiImage
//             size={12}
//             className={darkMode ? "text-blue-400" : "text-blue-600"}
//           />
//         )}
//       </div>

//       {showEditingModel && (
//         <SimpleEditTodoForm
//           todo={todo}
//           onClose={() => setShowEditingModel(false)}
//           onSuccess={(message) => {
//             setShowEditingModel(false);
//             showNotification("success", message);
//           }}
//         />
//       )}

//       {showDelegateModal && (
//         <SimpleUserDelegateModal
//           todo={todo}
//           onClose={() => setShowDelegateModal(false)}
//           onSuccess={(message) => {
//             setShowDelegateModal(false);
//             showNotification("success", message);
//           }}
//         />
//       )}

//       {showDeleteModal && (
//         <RemoveDelegateConfirmModal
//           todo={todo}
//           onClose={() => setShowDeleteModal(false)}
//           disabled={!canModify}
//         />
//       )}

//       {showRemoveDelegateModal && (
//         <RemoveDelegateConfirmModal
//           todo={todo}
//           onClose={() => setShowRemoveDelegateModal(false)}
//           disabled={!canModify}
//         />
//       )}
//     </div>
//   );
// };

// export default SimpleTodoCard;
