// import React from "react";
// import { useTheme } from "../../context/useTheme";
// import { useTodoContext } from "../../context/useTodoContext";
// import SimpleTodoCard from "./SimpleTodoCard";
// import { FiCheckCircle, FiClock, FiTrendingUp, FiInfo } from "react-icons/fi";

// /**
//  * Tableau Kanban simplifié
//  * Principe: Single Responsibility - Affiche uniquement les colonnes de todos
//  */
// const SimpleTodoBoard = ({
//   searchTerm,
//   onEditTodo,
//   showNotification,
//   isLoading,
// }) => {
//   const { darkMode } = useTheme();
//   const { todosByStatus, TODO_STATUSES } = useTodoContext();

//   // Configuration des colonnes
//   const columns = [
//     {
//       status: TODO_STATUSES.EN_ATTENTE,
//       title: "À faire",
//       icon: FiClock,
//       color: "amber",
//       todos: todosByStatus[TODO_STATUSES.EN_ATTENTE] || [],
//     },
//     {
//       status: TODO_STATUSES.EN_COURS,
//       title: "En cours",
//       icon: FiTrendingUp,
//       color: "blue",
//       todos: todosByStatus[TODO_STATUSES.EN_COURS] || [],
//     },
//     {
//       status: TODO_STATUSES.TERMINEE,
//       title: "Terminé",
//       icon: FiCheckCircle,
//       color: "emerald",
//       todos: todosByStatus[TODO_STATUSES.TERMINEE] || [],
//     },
//   ];

//   // Filtrer les todos selon la recherche
//   const filterTodos = (todos) => {
//     if (!searchTerm) return todos;
//     return todos.filter(
//       (todo) =>
//         todo.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         todo.description?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   };

//   const totalTodos = Object.values(todosByStatus).reduce(
//     (acc, todos) => acc + todos.length,
//     0
//   );

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div
//           className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
//             darkMode ? "border-blue-400" : "border-blue-600"
//           }`}
//         ></div>
//       </div>
//     );
//   }

//   if (totalTodos === 0) {
//     return (
//       <div
//         className={`text-center py-12 rounded-xl border ${
//           darkMode
//             ? "bg-gray-800/30 border-gray-700/50 text-gray-400"
//             : "bg-white/50 border-gray-200 text-gray-600"
//         }`}
//       >
//         <FiInfo className="mx-auto mb-4" size={48} />
//         <h3
//           className={`text-lg font-semibold mb-2 ${
//             darkMode ? "text-white" : "text-gray-900"
//           }`}
//         >
//           Aucune tâche pour le moment
//         </h3>
//         <p>Créez votre première tâche pour commencer</p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//       {columns.map((column) => {
//         const Icon = column.icon;
//         const filteredTodos = filterTodos(column.todos);

//         return (
//           <div key={column.status} className="space-y-4">
//             {/* En-tête de colonne */}
//             <div
//               className={`flex items-center gap-3 p-4 rounded-xl border ${
//                 darkMode
//                   ? "bg-gray-800/30 border-gray-700/50"
//                   : "bg-white/50 border-gray-200"
//               }`}
//             >
//               <div
//                 className={`p-2 rounded-lg ${
//                   column.color === "amber"
//                     ? darkMode
//                       ? "bg-amber-500/20 text-amber-400"
//                       : "bg-amber-100 text-amber-600"
//                     : column.color === "blue"
//                     ? darkMode
//                       ? "bg-blue-500/20 text-blue-400"
//                       : "bg-blue-100 text-blue-600"
//                     : darkMode
//                     ? "bg-emerald-500/20 text-emerald-400"
//                     : "bg-emerald-100 text-emerald-600"
//                 }`}
//               >
//                 <Icon size={20} />
//               </div>
//               <div className="flex-1">
//                 <h3
//                   className={`font-semibold ${
//                     darkMode ? "text-white" : "text-gray-900"
//                   }`}
//                 >
//                   {column.title}
//                 </h3>
//                 <p
//                   className={`text-sm ${
//                     darkMode ? "text-gray-400" : "text-gray-600"
//                   }`}
//                 >
//                   {filteredTodos.length} tâche
//                   {filteredTodos.length !== 1 ? "s" : ""}
//                 </p>
//               </div>
//             </div>

//             {/* Liste des todos */}
//             <div className="space-y-3 min-h-[200px]">
//               {filteredTodos.map((todo) => (
//                 <SimpleTodoCard
//                   key={todo.id}
//                   todo={todo}
//                   onEdit={onEditTodo}
//                   showNotification={showNotification}
//                 />
//               ))}

//               {filteredTodos.length === 0 && (
//                 <div
//                   className={`text-center py-8 border-2 border-dashed rounded-xl ${
//                     darkMode
//                       ? "border-gray-700 text-gray-500"
//                       : "border-gray-300 text-gray-400"
//                   }`}
//                 >
//                   <Icon className="mx-auto mb-2" size={24} />
//                   <p className="text-sm">Aucune tâche</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default SimpleTodoBoard;
