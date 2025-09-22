// import React from "react";
// import { FiPlus, FiRefreshCw, FiZap } from "react-icons/fi";


// const SimpleFloatingActions = ({ onCreateTodo, onRefresh, isLoading }) => {
//   return (
//     <div className="fixed z-40 flex flex-col gap-3 bottom-6 right-6">
//       {/* Bouton d'actualisation */}
//       <button
//         onClick={onRefresh}
//         disabled={isLoading}
//         className="p-4 transition-all duration-200 bg-white border border-gray-200 rounded-full shadow-lg dark:bg-gray-800 hover:shadow-xl dark:border-gray-700 hover:scale-105 disabled:opacity-50"
//         title="Actualiser"
//       >
//         <FiRefreshCw
//           size={20}
//           className={`text-gray-600 dark:text-gray-400 ${
//             isLoading ? "animate-spin" : ""
//           }`}
//         />
//       </button>

//       {/* Bouton d'action rapide */}
//       <button
//         className="p-4 text-white transition-all duration-200 bg-purple-500 rounded-full shadow-lg dark:bg-purple-600 hover:shadow-xl hover:scale-105 hover:bg-purple-600 dark:hover:bg-purple-500"
//         title="Actions rapides"
//       >
//         <FiZap size={20} />
//       </button>

//       {/* Bouton principal de création */}
//       <button
//         onClick={onCreateTodo}
//         className="p-4 text-white transition-all duration-200 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-xl hover:scale-105"
//         title="Nouvelle tâche"
//       >
//         <FiPlus size={24} />
//       </button>
//     </div>
//   );
// };

// export default SimpleFloatingActions;
