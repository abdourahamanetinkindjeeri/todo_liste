// import React, { useState } from "react";
// import { useTodoContext } from "../../context/useTodoContext";
// import { useTheme } from "../../context/useTheme";
// import { FiX, FiUpload, FiImage, FiSave } from "react-icons/fi";


// const SimpleCreateTodoForm = ({ onClose, onSuccess }) => {
//   const { darkMode } = useTheme();
//   const { createTodo } = useTodoContext();

//   const [formData, setFormData] = useState({
//     titre: "",
//     description: "",
//   });
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setError(null); // Clear error when user types
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Validation du fichier
//     if (!file.type.startsWith("image/")) {
//       setError("Veuillez sélectionner une image valide");
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       setError("La taille de l'image ne doit pas dépasser 5MB");
//       return;
//     }

//     setSelectedFile(file);
//     setError(null);

//     // Créer la preview
//     const reader = new FileReader();
//     reader.onload = (e) => setPreviewUrl(e.target.result);
//     reader.readAsDataURL(file);
//   };

//   const handleRemoveFile = () => {
//     setSelectedFile(null);
//     setPreviewUrl(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.titre.trim()) {
//       setError("Le titre est obligatoire");
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);

//     try {
//       const todoData = {
//         titre: formData.titre.trim(),
//         description: formData.description.trim(),
//         photo: selectedFile,
//       };

//       const result = await createTodo(todoData);

//       if (result.success) {
//         onSuccess?.();
//       } else {
//         setError(result.error || "Erreur lors de la création de la tâche");
//       }
//     } catch (err) {
//       setError("Erreur inattendue lors de la création");
//       console.error("Erreur création todo:", err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div
//       className={`rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden ${
//         darkMode
//           ? "bg-gray-800 border border-gray-700"
//           : "bg-white border border-gray-200"
//       }`}
//     >
//       {/* En-tête moderne */}
//       <div
//         className={`px-6 py-4 border-b ${
//           darkMode ? "border-gray-700" : "border-gray-200"
//         }`}
//       >
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div
//               className={`p-2 rounded-lg ${
//                 darkMode ? "bg-blue-500/20" : "bg-blue-100"
//               }`}
//             >
//               <FiSave
//                 className={darkMode ? "text-blue-400" : "text-blue-600"}
//                 size={20}
//               />
//             </div>
//             <div>
//               <h2
//                 className={`text-lg font-semibold ${
//                   darkMode ? "text-white" : "text-gray-900"
//                 }`}
//               >
//                 Nouvelle tâche
//               </h2>
//               <p
//                 className={`text-sm ${
//                   darkMode ? "text-gray-400" : "text-gray-600"
//                 }`}
//               >
//                 Créez une nouvelle tâche pour votre projet
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className={`p-2 rounded-lg transition-colors ${
//               darkMode
//                 ? "hover:bg-gray-700 text-gray-400"
//                 : "hover:bg-gray-100 text-gray-500"
//             }`}
//           >
//             <FiX size={20} />
//           </button>
//         </div>
//       </div>

//       {/* Formulaire */}
//       <form onSubmit={handleSubmit} className="p-6 space-y-6">
//         {/* Message d'erreur */}
//         {error && (
//           <div
//             className={`p-3 rounded-lg border ${
//               darkMode
//                 ? "bg-red-900/20 border-red-800/30 text-red-400"
//                 : "bg-red-50 border-red-200 text-red-700"
//             }`}
//           >
//             <p className="text-sm">{error}</p>
//           </div>
//         )}

//         {/* Titre */}
//         <div className="space-y-2">
//           <label
//             className={`block text-sm font-medium ${
//               darkMode ? "text-gray-300" : "text-gray-700"
//             }`}
//           >
//             Titre de la tâche *
//           </label>
//           <input
//             type="text"
//             name="titre"
//             value={formData.titre}
//             onChange={handleInputChange}
//             className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
//               darkMode
//                 ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50"
//                 : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-400"
//             }`}
//             placeholder="Ex: Finaliser la présentation du projet"
//             required
//             disabled={isSubmitting}
//           />
//         </div>

//         {/* Description */}
//         <div className="space-y-2">
//           <label
//             className={`block text-sm font-medium ${
//               darkMode ? "text-gray-300" : "text-gray-700"
//             }`}
//           >
//             Description
//           </label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             rows={4}
//             className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 resize-none ${
//               darkMode
//                 ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50"
//                 : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-400"
//             }`}
//             placeholder="Ajoutez des détails sur cette tâche..."
//             disabled={isSubmitting}
//           />
//         </div>

//         {/* Upload de photo */}
//         <div className="space-y-2">
//           <label
//             className={`block text-sm font-medium ${
//               darkMode ? "text-gray-300" : "text-gray-700"
//             }`}
//           >
//             Image (optionnel)
//           </label>

//           {!selectedFile ? (
//             <div
//               className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
//                 darkMode
//                   ? "border-gray-600 hover:border-gray-500 bg-gray-700/30"
//                   : "border-gray-300 hover:border-gray-400 bg-gray-50"
//               }`}
//             >
//               <FiUpload
//                 className={`w-8 h-8 mx-auto mb-2 ${
//                   darkMode ? "text-gray-400" : "text-gray-500"
//                 }`}
//               />
//               <div>
//                 <label htmlFor="photo" className="cursor-pointer">
//                   <span
//                     className={`font-medium ${
//                       darkMode ? "text-blue-400" : "text-blue-600"
//                     } hover:underline`}
//                   >
//                     Choisir une image
//                   </span>
//                   <input
//                     id="photo"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="hidden"
//                     disabled={isSubmitting}
//                   />
//                 </label>
//               </div>
//               <p
//                 className={`text-xs mt-1 ${
//                   darkMode ? "text-gray-500" : "text-gray-600"
//                 }`}
//               >
//                 PNG, JPG, GIF jusqu'à 5MB
//               </p>
//             </div>
//           ) : (
//             <div className="relative">
//               <img
//                 src={previewUrl}
//                 alt="Preview"
//                 className="object-cover w-full h-32 rounded-lg"
//               />
//               <button
//                 type="button"
//                 onClick={handleRemoveFile}
//                 className="absolute p-1 text-white transition-colors bg-red-500 rounded-full top-2 right-2 hover:bg-red-600"
//                 disabled={isSubmitting}
//               >
//                 <FiX size={16} />
//               </button>
//               <div
//                 className={`flex items-center mt-2 text-sm ${
//                   darkMode ? "text-gray-400" : "text-gray-600"
//                 }`}
//               >
//                 <FiImage className="mr-2" size={16} />
//                 <span className="truncate">{selectedFile.name}</span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Boutons d'action */}
//         <div className="flex gap-3 pt-4">
//           <button
//             type="button"
//             onClick={onClose}
//             className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
//               darkMode
//                 ? "border-gray-600 text-gray-300 hover:bg-gray-700"
//                 : "border-gray-300 text-gray-700 hover:bg-gray-50"
//             }`}
//             disabled={isSubmitting}
//           >
//             Annuler
//           </button>
//           <button
//             type="submit"
//             className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
//               formData.titre.trim() && !isSubmitting
//                 ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
//                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
//             }`}
//             disabled={isSubmitting || !formData.titre.trim()}
//           >
//             {isSubmitting ? "Création..." : "Créer la tâche"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SimpleCreateTodoForm;
