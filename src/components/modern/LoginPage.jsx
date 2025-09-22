// import { useState } from "react";
// import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
// import { useUserContext } from "../../context/useUserContext";

// const LoginPage = ({ onSwitchToSignup }) => {
//   const { login } = useUserContext();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     rememberMe: false,
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.email) {
//       newErrors.email = "Email requis";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Format email invalide";
//     }
//     if (!formData.password) {
//       newErrors.password = "Mot de passe requis";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Minimum 6 caractères";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       setIsLoading(true);
//       try {
//         const result = await login(formData.email, formData.password);
//         if (!result.success) {
//           setErrors({ general: result.error });
//         }
//       } catch (error) {
//         console.error("Échec connexion", error);
//         setErrors({ general: "Erreur lors de la connexion" });
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
//     <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-50 to-blue-50">
//       <div className="flex flex-col w-full max-w-4xl overflow-hidden bg-white shadow-2xl rounded-2xl md:flex-row">
//         <div className="flex-col items-center justify-center hidden p-12 text-white md:w-1/2 bg-gradient-to-br from-green-500 to-green-700 md:flex">
//           <img
//             src="https://images.unsplash.com/photo-1557683316-973673baf926"
//             alt="Todo Illustration"
//             className="object-cover w-32 h-32 mb-8 rounded-full shadow-lg"
//           />
//           <h2 className="mb-4 text-3xl font-bold">Todo Manager</h2>
//           <p className="text-lg text-center opacity-90">
//             Organisez vos journées avec simplicité. Créez, suivez et complétez
//             vos tâches en toute efficacité.
//           </p>
//         </div>

//         <div className="p-8 md:w-1/2 md:p-12">
//           <div className="mb-8 text-center">
//             <img
//               src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
//               alt="Todo Logo"
//               className="w-16 h-16 mx-auto mb-4 rounded-full shadow-md"
//             />
//             <h1 className="text-2xl font-bold text-gray-800">
//               Connexion à Todo List
//             </h1>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {errors.general && (
//               <div className="px-4 py-3 text-red-700 border border-red-300 rounded-lg bg-red-50">
//                 <p className="text-sm">{errors.general}</p>
//               </div>
//             )}

//             {/* Champ email */}
//             <div className="relative">
//               <FiMail className="absolute text-gray-400 left-3 top-3" />
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`block w-full pl-10 pr-3 py-2.5 border ${
//                   errors.email ? "border-red-500" : "border-gray-300"
//                 } rounded-lg focus:ring-2 focus:ring-green-500 transition-all`}
//                 placeholder="Adresse email"
//               />
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-500">{errors.email}</p>
//               )}
//             </div>

//             {/* Champ mot de passe */}
//             <div className="relative">
//               <FiLock className="absolute text-gray-400 left-3 top-3" />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={`block w-full pl-10 pr-10 py-2.5 border ${
//                   errors.password ? "border-red-500" : "border-gray-300"
//                 } rounded-lg focus:ring-2 focus:ring-green-500 transition-all`}
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

//             {/* Options */}
//             <div className="flex items-center justify-between">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="rememberMe"
//                   checked={formData.rememberMe}
//                   onChange={handleChange}
//                   className="w-4 h-4 text-green-600 border-gray-300 rounded"
//                 />
//                 <span className="ml-2 text-sm text-gray-600">
//                   Se souvenir de moi
//                 </span>
//               </label>
//               <a
//                 href="#"
//                 className="text-sm text-green-600 hover:text-green-800"
//               >
//                 Mot de passe oublié ?
//               </a>
//             </div>

//             {/* Bouton login */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2.5 rounded-lg font-medium hover:opacity-90 focus:ring-2 focus:ring-green-500 transition-all"
//             >
//               {isLoading ? "Connexion..." : "Accéder à mes todos"}
//             </button>

//             {/* Switch vers signup */}
//             <p className="mt-8 text-sm text-center text-gray-600">
//               Pas encore de compte ?{" "}
//               <button
//                 type="button"
//                 onClick={onSwitchToSignup}
//                 className="font-medium text-green-600 hover:text-green-800"
//               >
//                 Créer un compte
//               </button>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
