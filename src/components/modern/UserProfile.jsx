// import React, { useState } from "react";
// import { useTheme } from "../../context/useTheme";

// import { FiUser, FiLogOut, FiSettings } from "react-icons/fi";
// import LogoutConfirmModal from "../LogoutConfirmModal";
// import { useUserContext } from "../../context/useUserContext";

// const UserProfile = () => {
//   const { darkMode } = useTheme();
//   const { user, logout } = useUserContext();
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);

//   const getUserInitials = () => {
//     if (user?.prenom && user?.nom) {
//       return `${user.prenom[0]}${user.nom[0]}`.toUpperCase();
//     }
//     if (user?.name) {
//       return user.name.slice(0, 2).toUpperCase();
//     }
//     return "U";
//   };

//   return (
//     <div className="relative">
//       {/* Avatar cliquable */}
//       <button
//         onClick={() => setShowDropdown(!showDropdown)}
//         className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-200 ${
//           darkMode
//             ? "bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50"
//             : "bg-white/70 hover:bg-white border border-gray-200"
//         }`}
//       >
//         <div
//           className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold ${
//             darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
//           }`}
//         >
//           {getUserInitials()}
//         </div>
//         <div className="hidden text-left sm:block">
//           <p
//             className={`text-sm font-medium ${
//               darkMode ? "text-white" : "text-gray-900"
//             }`}
//           >
//             {user?.prenom || user?.name || "Utilisateur"}
//           </p>
//           <p
//             className={`text-xs ${
//               darkMode ? "text-gray-400" : "text-gray-600"
//             }`}
//           >
//             {user?.email || ""}
//           </p>
//         </div>
//       </button>

//       {/* Menu déroulant */}
//       {showDropdown && (
//         <>
//           {/* Overlay pour fermer le menu */}
//           <div
//             className="fixed inset-0 z-10"
//             onClick={() => setShowDropdown(false)}
//           />

//           <div
//             className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl z-20 ${
//               darkMode
//                 ? "bg-gray-800 border border-gray-700"
//                 : "bg-white border border-gray-200"
//             }`}
//           >
//             <div className="p-2 space-y-1">
//               <button
//                 className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
//                   darkMode
//                     ? "hover:bg-gray-700 text-gray-300"
//                     : "hover:bg-gray-100 text-gray-700"
//                 }`}
//               >
//                 <FiUser size={16} />
//                 <span className="text-sm">Profil</span>
//               </button>

//               <button
//                 className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
//                   darkMode
//                     ? "hover:bg-gray-700 text-gray-300"
//                     : "hover:bg-gray-100 text-gray-700"
//                 }`}
//               >
//                 <FiSettings size={16} />
//                 <span className="text-sm">Paramètres</span>
//               </button>

//               <hr
//                 className={`my-2 ${
//                   darkMode ? "border-gray-700" : "border-gray-200"
//                 }`}
//               />

//               <button
//                 onClick={() => {
//                   setShowDropdown(false);
//                   setShowLogoutModal(true);
//                 }}
//                 className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
//                   darkMode
//                     ? "hover:bg-red-900/30 text-red-400"
//                     : "hover:bg-red-50 text-red-600"
//                 }`}
//               >
//                 <FiLogOut size={16} />
//                 <span className="text-sm">Déconnexion</span>
//               </button>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Modal de confirmation de déconnexion */}
//       {showLogoutModal && (
//         <LogoutConfirmModal
//           onClose={() => setShowLogoutModal(false)}
//           onConfirm={() => {
//             logout();
//             setShowLogoutModal(false);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default UserProfile;
