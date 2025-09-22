import React from "react";
import { useState } from "react";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { useUserContext } from "../../context/useUserContext.jsx";
import { Button, Input } from "../../components/ui/index.js";

/**
 * Page de connexion
 * @param {Object} props
 * @param {Function} props.onSwitchToSignup - Fonction pour passer à l'inscription
 */
const LoginPage = ({ onSwitchToSignup }) => {
  const { login } = useUserContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email invalide";
    }
    if (!formData.password) {
      newErrors.password = "Mot de passe requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 caractères";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const result = await login(formData.email, formData.password);
        if (!result.success) {
          setErrors({ general: result.error });
        }
      } catch (error) {
        console.error("Échec connexion", error);
        setErrors({ general: "Erreur lors de la connexion" });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Nettoyer les erreurs lors de la saisie
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex flex-col w-full max-w-4xl overflow-hidden bg-white shadow-2xl rounded-2xl md:flex-row">
        {/* Section illustration */}
        <div className="flex-col items-center justify-center hidden p-12 text-white md:w-1/2 bg-gradient-to-br from-green-500 to-green-700 md:flex">
          <img
            src="https://images.unsplash.com/photo-1557683316-973673baf926"
            alt="Todo Illustration"
            className="object-cover w-32 h-32 mb-8 rounded-full shadow-lg"
          />
          <h2 className="mb-4 text-3xl font-bold">Todo Manager</h2>
          <p className="text-lg text-center opacity-90">
            Organisez vos journées avec simplicité. Créez, suivez et complétez
            vos tâches en toute efficacité.
          </p>
        </div>

        {/* Section formulaire */}
        <div className="p-8 md:w-1/2 md:p-12">
          <div className="mb-8 text-center">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
              alt="Todo Logo"
              className="w-16 h-16 mx-auto mb-4 rounded-full shadow-md"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              Connexion à Todo List
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="px-4 py-3 text-red-700 border border-red-300 rounded-lg bg-red-50" role="alert">
                <p className="text-sm">{errors.general}</p>
              </div>
            )}

            {/* Champ email */}
            <div className="relative">
              <FiMail className="absolute text-gray-400 left-3 top-3" aria-hidden="true" />
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Adresse email"
                error={errors.email}
                className="pl-10"
                autoComplete="email"
              />
            </div>

            {/* Champ mot de passe */}
            <div className="relative">
              <FiLock className="absolute text-gray-400 left-3 top-3" aria-hidden="true" />
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mot de passe"
                error={errors.password}
                className="pl-10 pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Se souvenir de moi
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-green-600 hover:text-green-800 transition-colors"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Bouton login */}
            <Button
              type="submit"
              loading={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
            >
              {isLoading ? "Connexion..." : "Accéder à mes todos"}
            </Button>

            {/* Switch vers signup */}
            <p className="mt-8 text-sm text-center text-gray-600">
              Pas encore de compte ?{" "}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="font-medium text-green-600 hover:text-green-800 transition-colors"
              >
                Créer un compte
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;