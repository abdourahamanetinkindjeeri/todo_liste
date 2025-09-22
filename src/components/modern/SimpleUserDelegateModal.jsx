// import React, { useState } from "react";
// import { useUserContext } from "../../context/useUserContext";
// import { useTodoContext } from "../../context/useTodoContext";

// const SimpleUserDelegateModal = ({ todo, onClose, onSuccess }) => {
//   const { user } = useUserContext();
//   const { users, delegateTodo, fetchUsers } = useTodoContext();
//   const [selectedUserId, setSelectedUserId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   React.useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   const isOwner = todo?.userId === user?.id || todo?.user?.id === user?.id;
//   const isDelegate = todo?.delegatedTo === user?.id;
//   const canDelegate = isOwner || isDelegate;

//   const handleDelegate = async () => {
//     if (!selectedUserId) return;
//     setLoading(true);
//     setError(null);
//     const result = await delegateTodo(todo.id, selectedUserId);
//     setLoading(false);
//     if (result.success) {
//       if (onSuccess) onSuccess("Tâche déléguée avec succès");
//       onClose();
//     } else {
//       setError(result.error || "Erreur lors de la délégation");
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
//       <div className="p-6 bg-white shadow-xl rounded-xl min-w-[320px]">
//         <h2 className="mb-2 text-lg font-bold">Déléguer la tâche</h2>
//         {!canDelegate ? (
//           <p className="mb-4 font-semibold text-red-600">
//             Vous n'avez pas le droit de déléguer cette tâche.
//           </p>
//         ) : (
//           <>
//             <p className="mb-4">
//               Sélectionnez un utilisateur à qui déléguer cette tâche.
//             </p>
//             <select
//               className="w-full p-2 mb-4 border rounded"
//               value={selectedUserId}
//               onChange={(e) => setSelectedUserId(e.target.value)}
//             >
//               <option value="">-- Choisir un utilisateur --</option>
//               {users
//                 .filter((u) => u.id !== user?.id)
//                 .map((u) => (
//                   <option key={u.id} value={u.id}>
//                     {u.prenom || u.name || "Utilisateur"} {u.nom || ""} (
//                     {u.email})
//                   </option>
//                 ))}
//             </select>
//             {error && <div className="mb-2 text-sm text-red-500">{error}</div>}
//             <button
//               className={`px-4 py-2 rounded bg-blue-600 text-white mr-2 ${
//                 loading ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//               onClick={handleDelegate}
//               disabled={!canDelegate || !selectedUserId || loading}
//             >
//               Déléguer
//             </button>
//           </>
//         )}
//         <button
//           className="px-4 py-2 mt-2 text-gray-700 bg-gray-300 rounded"
//           onClick={onClose}
//         >
//           Fermer
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SimpleUserDelegateModal;
