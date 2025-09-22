// import { useState } from "react";
// import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";
// import { useUserContext } from "../../context/useUserContext";

// const SignupPage = ({ onSwitchToLogin }) => {
//   const { signup } = useUserContext();
//   const [formData, setFormData] = useState({
//     prenom: "",
//     nom: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     agreeToTerms: false,
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState("");

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
//     if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";

//     if (!formData.email) {
//       newErrors.email = "L'email est requis";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Format d'email invalide";
//     }

//     if (!formData.password) {
//       newErrors.password = "Le mot de passe est requis";
//     } else if (formData.password.length < 6) {
//       newErrors.password =
//         "Le mot de passe doit contenir au moins 6 caractères";
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = "Confirmez votre mot de passe";
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
//     }

//     if (!formData.agreeToTerms) {
//       newErrors.agreeToTerms =
//         "Vous devez accepter les conditions d’utilisation";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       setIsLoading(true);
//       setErrors({});
//       setSuccessMessage("");

//       try {
//         const userData = {
//           prenom: formData.prenom,
//           nom: formData.nom,
//           email: formData.email,
//           password: formData.password,
//         };

//         const result = await signup(userData);

//         if (result.success) {
//           setSuccessMessage(
//             "Inscription réussie ! Vous pouvez maintenant vous connecter."
//           );
//           setFormData({
//             prenom: "",
//             nom: "",
//             email: "",
//             password: "",
//             confirmPassword: "",
//             agreeToTerms: false,
//           });
//           setTimeout(() => onSwitchToLogin(), 2000);
//         } else {
//           setErrors({ general: result.error });
//         }
//       } catch (error) {
//         console.error("Erreur inscription", error);
//         setErrors({ general: "Une erreur est survenue lors de l’inscription" });
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-50 to-green-50">
//       <div className="flex flex-col w-full max-w-4xl overflow-hidden bg-white shadow-2xl rounded-2xl md:flex-row">
//         {/* Partie gauche */}
//         <div className="flex-col items-center justify-center hidden p-12 text-white md:w-1/2 bg-gradient-to-br from-green-600 to-green-800 md:flex">
//           <img
//             src="https://images.unsplash.com/photo-1560472355-536de3962603"
//             alt="Organisation des tâches"
//             className="object-cover w-32 h-32 mb-8 transition-transform duration-300 rounded-full hover:scale-110"
//           />
//           <h2 className="mb-4 text-3xl font-bold">Rejoignez-nous</h2>
//           <p className="text-lg text-center opacity-90">
//             Créez votre compte pour accéder à votre gestionnaire de tâches et
//             commencez à organiser vos journées efficacement.
//           </p>
//         </div>

//         {/* Partie droite */}
//         <div className="p-8 md:w-1/2 md:p-12">
//           <div className="mb-8 text-center">
//             <img
//               src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf"
//               alt="Logo Todo"
//               className="w-16 h-16 mx-auto mb-4 transition-transform duration-300 rounded-full hover:scale-110"
//             />
//             <h1 className="text-2xl font-bold text-gray-800">
//               Créer un compte
//             </h1>
//             <p className="mt-2 text-gray-600">
//               Inscrivez-vous pour gérer vos tâches
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {errors.general && (
//               <div className="px-4 py-3 text-red-700 border border-red-300 rounded-lg bg-red-50">
//                 <p className="text-sm">{errors.general}</p>
//               </div>
//             )}
//             {successMessage && (
//               <div className="px-4 py-3 text-green-700 border border-green-300 rounded-lg bg-green-50">
//                 <p className="text-sm">{successMessage}</p>
//               </div>
//             )}

//             {/* Prénom et Nom */}
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <div className="relative">
//                 <FiUser className="absolute text-gray-400 left-3 top-3" />
//                 <input
//                   type="text"
//                   name="prenom"
//                   value={formData.prenom}
//                   onChange={handleChange}
//                   className={`block w-full pl-10 pr-3 py-2.5 border ${
//                     errors.prenom ? "border-red-500" : "border-gray-300"
//                   } rounded-lg focus:ring-2 focus:ring-green-500`}
//                   placeholder="Prénom"
//                 />
//                 {errors.prenom && (
//                   <p className="mt-1 text-sm text-red-500">{errors.prenom}</p>
//                 )}
//               </div>
//               <div className="relative">
//                 <FiUser className="absolute text-gray-400 left-3 top-3" />
//                 <input
//                   type="text"
//                   name="nom"
//                   value={formData.nom}
//                   onChange={handleChange}
//                   className={`block w-full pl-10 pr-3 py-2.5 border ${
//                     errors.nom ? "border-red-500" : "border-gray-300"
//                   } rounded-lg focus:ring-2 focus:ring-green-500`}
//                   placeholder="Nom"
//                 />
//                 {errors.nom && (
//                   <p className="mt-1 text-sm text-red-500">{errors.nom}</p>
//                 )}
//               </div>
//             </div>

//             {/* Email */}
//             <div className="relative">
//               <FiMail className="absolute text-gray-400 left-3 top-3" />
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`block w-full pl-10 pr-3 py-2.5 border ${
//                   errors.email ? "border-red-500" : "border-gray-300"
//                 } rounded-lg focus:ring-2 focus:ring-green-500`}
//                 placeholder="Adresse email"
//               />
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-500">{errors.email}</p>
//               )}
//             </div>

//             {/* Mot de passe */}
//             <div className="relative">
//               <FiLock className="absolute text-gray-400 left-3 top-3" />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={`block w-full pl-10 pr-10 py-2.5 border ${
//                   errors.password ? "border-red-500" : "border-gray-300"
//                 } rounded-lg focus:ring-2 focus:ring-green-500`}
//                 placeholder="Mot de passe"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-2.5"
//               >
//                 {showPassword ? (
//                   <FiEyeOff className="text-gray-400" />
//                 ) : (
//                   <FiEye className="text-gray-400" />
//                 )}
//               </button>
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-500">{errors.password}</p>
//               )}
//             </div>

//             {/* Confirmation mot de passe */}
//             <div className="relative">
//               <FiLock className="absolute text-gray-400 left-3 top-3" />
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className={`block w-full pl-10 pr-10 py-2.5 border ${
//                   errors.confirmPassword ? "border-red-500" : "border-gray-300"
//                 } rounded-lg focus:ring-2 focus:ring-green-500`}
//                 placeholder="Confirmer le mot de passe"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-2.5"
//               >
//                 {showConfirmPassword ? (
//                   <FiEyeOff className="text-gray-400" />
//                 ) : (
//                   <FiEye className="text-gray-400" />
//                 )}
//               </button>
//               {errors.confirmPassword && (
//                 <p className="mt-1 text-sm text-red-500">
//                   {errors.confirmPassword}
//                 </p>
//               )}
//             </div>

//             {/* Conditions */}
//             <div className="flex items-start">
//               <input
//                 type="checkbox"
//                 name="agreeToTerms"
//                 checked={formData.agreeToTerms}
//                 onChange={handleChange}
//                 className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded"
//               />
//               <label className="ml-2 text-sm text-gray-600">
//                 J’accepte les{" "}
//                 <a
//                   href="#"
//                   className="font-medium text-green-600 hover:text-green-800"
//                 >
//                   conditions d’utilisation
//                 </a>{" "}
//                 et la{" "}
//                 <a
//                   href="#"
//                   className="font-medium text-green-600 hover:text-green-800"
//                 >
//                   politique de confidentialité
//                 </a>
//               </label>
//             </div>
//             {errors.agreeToTerms && (
//               <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
//             )}

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-2.5 rounded-lg font-medium hover:opacity-90"
//             >
//               {isLoading ? "Création en cours..." : "Créer le compte"}
//             </button>

//             <p className="mt-4 text-sm text-center text-gray-600">
//               Vous avez déjà un compte ?{" "}
//               <button
//                 type="button"
//                 onClick={onSwitchToLogin}
//                 className="font-medium text-green-600 hover:text-green-800"
//               >
//                 Se connecter
//               </button>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;
