// import React, { useState, useEffect } from "react";
// import { useTodoContext } from "../../context/useTodoContext";
// import { useUserContext } from "../../context/useUserContext";
// import ModernTodoColumn from "./ModernTodoColumn";
// import CreateTodoForm from "./delete/CreateTodoForm";
// import EditTodoForm from "./delete/EditTodoForm";
// import ModernNavbar from "./delete/ModernNavbar";
// import StatsWidget from "./StatsWidget";
// import QuickActionsWidget from "./QuickActionsWidget";
// import NotificationToast from "./NotificationToast";
// import SearchAndFilters from "./SearchAndFilters";
// import UsersListWidget from "./UsersListWidget";
// import {
//   FiPlus,
//   FiRefreshCw,
//   FiAlertCircle,
//   FiInfo,
//   FiTrendingUp,
//   FiUsers,
//   FiClock,
//   FiCheckCircle,
//   FiFilter,
//   FiSearch,
//   FiGrid,
//   FiList,
//   FiSettings,
// } from "react-icons/fi";

// const ModernTodoBoard = ({ darkMode, toggleDarkMode }) => {
//   const {
//     todosByStatus,
//     isLoading,
//     error,
//     setError,
//     fetchTodos,
//     fetchUsers,
//     showAllTodos,
//     TODO_STATUSES,
//     currentUserTodos,
//     otherUsersTodos,
//   } = useTodoContext();

//   const { user } = useUserContext();

//   useEffect(() => {
//     const loadInitialData = async () => {
//       await fetchTodos();
//       await fetchUsers();
//     };
//     loadInitialData();
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [editingTodo, setEditingTodo] = useState(null);
//   const [viewMode, setViewMode] = useState("kanban"); // kanban | list
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [filterUser, setFilterUser] = useState("all");
//   const [notification, setNotification] = useState(null);
//   const [isStatsExpanded, setIsStatsExpanded] = useState(true);
//   const [showUsersWidget, setShowUsersWidget] = useState(false);

//   // Calculer les statistiques
//   const stats = {
//     total: currentUserTodos.length + otherUsersTodos.length,
//     myTodos: currentUserTodos.length,
//     completed: todosByStatus[TODO_STATUSES.TERMINEE]?.length || 0,
//     inProgress: todosByStatus[TODO_STATUSES.EN_COURS]?.length || 0,
//     pending: todosByStatus[TODO_STATUSES.EN_ATTENTE]?.length || 0,
//     completionRate:
//       currentUserTodos.length > 0
//         ? Math.round(
//             (currentUserTodos.filter((t) => t.status === TODO_STATUSES.TERMINEE)
//               .length /
//               currentUserTodos.length) *
//               100
//           )
//         : 0,
//   };

//   const showNotification = (type, message) => {
//     setNotification({ type, message, id: Date.now() });
//     setTimeout(() => setNotification(null), 4000);
//   };

//   const handleCreateTodo = () => {
//     setShowCreateForm(true);
//   };

//   const handleCloseCreateForm = () => {
//     setShowCreateForm(false);
//   };

//   const handleEditTodo = (todo) => {
//     setEditingTodo(todo);
//   };

//   const handleCloseEditForm = () => {
//     setEditingTodo(null);
//   };

//   const handleRefresh = async () => {
//     await fetchTodos();
//     showNotification("success", "Données actualisées avec succès");
//   };

//   const dismissError = () => {
//     setError(null);
//   };

//   const toggleViewMode = () => {
//     setViewMode(viewMode === "kanban" ? "list" : "kanban");
//   };

//   const columns = [
//     {
//       status: TODO_STATUSES.EN_ATTENTE,
//       title: "En Attente",
//       color: "amber",
//       gradient: "from-amber-500 to-yellow-500",
//       icon: FiClock,
//       todos: todosByStatus[TODO_STATUSES.EN_ATTENTE] || [],
//     },
//     {
//       status: TODO_STATUSES.EN_COURS,
//       title: "En Cours",
//       color: "blue",
//       gradient: "from-blue-500 to-indigo-500",
//       icon: FiTrendingUp,
//       todos: todosByStatus[TODO_STATUSES.EN_COURS] || [],
//     },
//     {
//       status: TODO_STATUSES.TERMINEE,
//       title: "Terminées",
//       color: "emerald",
//       gradient: "from-emerald-500 to-green-500",
//       icon: FiCheckCircle,
//       todos: todosByStatus[TODO_STATUSES.TERMINEE] || [],
//     },
//   ];

//   const totalTodos = Object.values(todosByStatus).reduce(
//     (acc, todos) => acc + todos.length,
//     0
//   );

//   return (
//     <div className="relative min-h-screen">
//       {notification && (
//         <NotificationToast
//           type={notification.type}
//           message={notification.message}
//           onClose={() => setNotification(null)}
//         />
//       )}

//       {/* Navigation moderne */}
//       <ModernNavbar
//         darkMode={darkMode}
//         toggleDarkMode={toggleDarkMode}
//         showAllTodos={showAllTodos}
//         user={user}
//       />

//       {/* Contenu principal */}
//       <div className="relative z-10 px-4 py-8 space-y-8 sm:px-6 lg:px-8">
//         {/* En-tête avec statistiques */}
//         <div className="space-y-6">
//           {/* Titre et actions principales */}
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div className="space-y-1">
//               <h1
//                 className={`text-3xl font-bold ${
//                   darkMode ? "text-white" : "text-gray-900"
//                 }`}
//               >
//                 {showAllTodos
//                   ? "Tableau de bord équipe"
//                   : "Mon espace de travail"}
//               </h1>
//               <p
//                 className={`text-sm ${
//                   darkMode ? "text-gray-300" : "text-gray-600"
//                 }`}
//               >
//                 {showAllTodos
//                   ? "Vue d'ensemble de toutes les tâches de l'équipe"
//                   : "Gérez vos tâches et suivez votre progression"}
//               </p>
//             </div>

//             <div className="flex items-center gap-3">
//               {/* Toggle view mode */}
//               <button
//                 onClick={toggleViewMode}
//                 className={`p-2 rounded-lg transition-all duration-200 ${
//                   darkMode
//                     ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
//                     : "bg-white hover:bg-gray-50 text-gray-600"
//                 } shadow-lg hover:shadow-xl`}
//                 title={viewMode === "kanban" ? "Vue liste" : "Vue Kanban"}
//               >
//                 {viewMode === "kanban" ? (
//                   <FiList size={20} />
//                 ) : (
//                   <FiGrid size={20} />
//                 )}
//               </button>

//               {/* Refresh */}
//               <button
//                 onClick={handleRefresh}
//                 disabled={isLoading}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
//                   darkMode
//                     ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
//                     : "bg-white hover:bg-gray-50 text-gray-600"
//                 } shadow-lg hover:shadow-xl disabled:opacity-50`}
//               >
//                 <FiRefreshCw
//                   size={16}
//                   className={isLoading ? "animate-spin" : ""}
//                 />
//                 <span className="hidden sm:inline">Actualiser</span>
//               </button>

//               {/* Users Widget Toggle */}
//               <button
//                 onClick={() => setShowUsersWidget(!showUsersWidget)}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
//                   showUsersWidget
//                     ? darkMode
//                       ? "bg-blue-600 hover:bg-blue-700 text-white"
//                       : "bg-blue-500 hover:bg-blue-600 text-white"
//                     : darkMode
//                     ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
//                     : "bg-white hover:bg-gray-50 text-gray-600"
//                 } shadow-lg hover:shadow-xl`}
//                 title="Afficher les utilisateurs"
//               >
//                 <FiUsers size={16} />
//                 <span className="hidden text-sm font-medium sm:inline">
//                   Utilisateurs
//                 </span>
//               </button>

//               {/* Nouvelle tâche */}
//               <button
//                 onClick={handleCreateTodo}
//                 className="flex items-center gap-2 px-6 py-2 text-white transition-all duration-200 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-xl hover:scale-105"
//               >
//                 <FiPlus size={16} />
//                 <span className="hidden sm:inline">Nouvelle Tâche</span>
//               </button>
//             </div>
//           </div>

//           {/* Widgets de statistiques */}
//           <StatsWidget
//             stats={stats}
//             darkMode={darkMode}
//             isExpanded={isStatsExpanded}
//             onToggle={() => setIsStatsExpanded(!isStatsExpanded)}
//           />

//           {/* Widget des utilisateurs */}
//           {showUsersWidget && (
//             <div className="mb-6">
//               <UsersListWidget darkMode={darkMode} />
//             </div>
//           )}
//         </div>

//         {/* Recherche et filtres */}
//         <SearchAndFilters
//           darkMode={darkMode}
//           searchTerm={searchTerm}
//           setSearchTerm={setSearchTerm}
//           filterStatus={filterStatus}
//           setFilterStatus={setFilterStatus}
//           filterUser={filterUser}
//           setFilterUser={setFilterUser}
//           showAllTodos={showAllTodos}
//         />

//         {/* Message d'erreur stylisé */}
//         {error && (
//           <div
//             className={`relative overflow-hidden rounded-xl p-4 ${
//               darkMode
//                 ? "bg-red-900/20 border border-red-800/30"
//                 : "bg-red-50 border border-red-200"
//             } backdrop-blur-sm`}
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div
//                   className={`p-2 rounded-lg ${
//                     darkMode ? "bg-red-900/30" : "bg-red-100"
//                   }`}
//                 >
//                   <FiAlertCircle
//                     className={`${darkMode ? "text-red-400" : "text-red-600"}`}
//                     size={20}
//                   />
//                 </div>
//                 <div>
//                   <h3
//                     className={`font-medium ${
//                       darkMode ? "text-red-400" : "text-red-800"
//                     }`}
//                   >
//                     Erreur
//                   </h3>
//                   <p
//                     className={`text-sm ${
//                       darkMode ? "text-red-300" : "text-red-700"
//                     }`}
//                   >
//                     {error}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={dismissError}
//                 className={`p-1 rounded-lg transition-colors ${
//                   darkMode
//                     ? "hover:bg-red-900/30 text-red-400"
//                     : "hover:bg-red-100 text-red-600"
//                 }`}
//               >
//                 ×
//               </button>
//             </div>
//           </div>
//         )}

//         {/* État vide stylisé */}
//         {totalTodos === 0 && !isLoading && (
//           <div
//             className={`relative overflow-hidden rounded-xl p-8 text-center ${
//               darkMode
//                 ? "bg-gray-800/50 border border-gray-700/50"
//                 : "bg-white/70 border border-gray-200"
//             } backdrop-blur-sm`}
//           >
//             <div className="max-w-md mx-auto space-y-4">
//               <div
//                 className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
//                   darkMode ? "bg-blue-900/30" : "bg-blue-100"
//                 }`}
//               >
//                 <FiInfo
//                   className={`${darkMode ? "text-blue-400" : "text-blue-600"}`}
//                   size={32}
//                 />
//               </div>
//               <div>
//                 <h3
//                   className={`text-lg font-semibold ${
//                     darkMode ? "text-white" : "text-gray-900"
//                   }`}
//                 >
//                   {showAllTodos
//                     ? "Aucune tâche dans l'équipe"
//                     : "Commencez votre premier projet"}
//                 </h3>
//                 <p
//                   className={`text-sm mt-2 ${
//                     darkMode ? "text-gray-400" : "text-gray-600"
//                   }`}
//                 >
//                   Créez votre première tâche pour commencer à organiser votre
//                   travail
//                 </p>
//               </div>
//               <button
//                 onClick={handleCreateTodo}
//                 className="inline-flex items-center gap-2 px-6 py-3 text-white transition-all duration-200 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-xl hover:scale-105"
//               >
//                 <FiPlus size={16} />
//                 Créer une tâche
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Tableau Kanban ou Liste */}
//         {totalTodos > 0 && (
//           <div
//             className={`transition-all duration-500 ${
//               viewMode === "kanban"
//                 ? "grid grid-cols-1 lg:grid-cols-3 gap-6"
//                 : "space-y-4"
//             }`}
//           >
//             {columns.map((column) => (
//               <ModernTodoColumn
//                 key={column.status}
//                 status={column.status}
//                 title={column.title}
//                 todos={column.todos}
//                 color={column.color}
//                 gradient={column.gradient}
//                 icon={column.icon}
//                 darkMode={darkMode}
//                 viewMode={viewMode}
//                 onEdit={handleEditTodo}
//                 searchTerm={searchTerm}
//                 filterStatus={filterStatus}
//                 filterUser={filterUser}
//                 showNotification={showNotification}
//               />
//             ))}
//           </div>
//         )}

//         {/* Quick Actions Widget */}
//         <QuickActionsWidget
//           darkMode={darkMode}
//           onCreateTodo={handleCreateTodo}
//           onRefresh={handleRefresh}
//           stats={stats}
//         />

//         {/* Formulaires modaux */}
//         {showCreateForm && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//             <div className="w-full max-w-md">
//               <CreateTodoForm onClose={handleCloseCreateForm} />
//             </div>
//           </div>
//         )}

//         {editingTodo && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//             <div className="w-full max-w-md">
//               <EditTodoForm todo={editingTodo} onClose={handleCloseEditForm} />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ModernTodoBoard;
