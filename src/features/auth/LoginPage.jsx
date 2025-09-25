import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/useUserContext.jsx";
import { Button, Input } from "../../components/ui/index.js";
import { AUTH_ERROR_MESSAGES } from "../../constants/errorMessages.js";

/**
 * Page de connexion
 * @param {Object} props
 * @param {Function} props.onSwitchToSignup - Fonction pour passer à l'inscription
 */
const LoginPage = ({ onSwitchToSignup }) => {
  const { login } = useUserContext();
  const navigate = useNavigate();
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
      newErrors.email = AUTH_ERROR_MESSAGES.EMAIL_REQUIRED;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = AUTH_ERROR_MESSAGES.EMAIL_INVALID;
    }
    if (!formData.password) {
      newErrors.password = AUTH_ERROR_MESSAGES.PASSWORD_REQUIRED;
    } else if (formData.password.length < 6) {
      newErrors.password = AUTH_ERROR_MESSAGES.PASSWORD_MIN_LENGTH;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setErrors({}); // Réinitialiser les erreurs
      try {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          navigate("/dashboard"); // Redirection vers le dashboard
        } else {
          // Afficher le message d'erreur spécifique retourné par le service
          setErrors({
            general: result.error || AUTH_ERROR_MESSAGES.LOGIN_FAILED,
          });
        }
      } catch (error) {
        console.error("Échec connexion", error);
        // Message d'erreur pour les exceptions non gérées
        setErrors({
          general: AUTH_ERROR_MESSAGES.UNEXPECTED_ERROR,
        });
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
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    // Nettoyer l'erreur générale quand l'utilisateur modifie email ou password
    if ((name === "email" || name === "password") && errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex flex-col w-full max-w-4xl overflow-hidden bg-white shadow-2xl rounded-2xl md:flex-row">
        {/* Section illustration */}
        <div className="flex-col items-center justify-center hidden p-12 text-white md:w-1/2 bg-gradient-to-br from-green-500 to-green-700 md:flex">
          <div className="flex items-center justify-center w-32 h-32 mb-8 bg-white/20 rounded-full shadow-lg">
            <svg
              className="w-16 h-16 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
          </div>
          <h2 className="mb-4 text-3xl font-bold">Todo Manager</h2>
          <p className="text-lg text-center opacity-90">
            Organisez vos journées avec simplicité. Créez, suivez et complétez
            vos tâches en toute efficacité.
          </p>
        </div>

        {/* Section formulaire */}
        <div className="p-8 md:w-1/2 md:p-12">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-700 rounded-full shadow-md">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Connexion à Todo List
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div
                className="px-4 py-3 text-red-700 border border-red-300 rounded-lg bg-red-50"
                role="alert"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{errors.general}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Champ email */}
            <div className="relative">
              <svg
                className="absolute w-5 h-5 text-gray-400 left-3 top-3"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
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
              <svg
                className="absolute w-5 h-5 text-gray-400 left-3 top-3"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
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
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
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
                className="text-sm text-green-600 transition-colors hover:text-green-800"
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
                className="font-medium text-green-600 transition-colors hover:text-green-800"
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
