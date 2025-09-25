import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/useUserContext.jsx";
import { Button, Input } from "../../components/ui/index.js";

/**
 * Page d'inscription
 * @param {Object} props
 * @param {Function} props.onSwitchToLogin - Fonction pour passer à la connexion
 */
const SignupPage = ({ onSwitchToLogin }) => {
  const { signup } = useUserContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmez votre mot de passe";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms =
        "Vous devez accepter les conditions d'utilisation";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setErrors({});
      setSuccessMessage("");

      try {
        const userData = {
          prenom: formData.prenom,
          nom: formData.nom,
          email: formData.email,
          password: formData.password,
        };

        const result = await signup(userData);

        if (result.success) {
          setSuccessMessage(
            "Inscription réussie ! Vous allez être redirigé vers la page de connexion."
          );
          setFormData({
            prenom: "",
            nom: "",
            email: "",
            password: "",
            confirmPassword: "",
            agreeToTerms: false,
          });
          setTimeout(() => {
            onSwitchToLogin(); // Garde le switch visuel
            navigate("/login"); // Assure la redirection
          }, 2000);
        } else {
          setErrors({ general: result.message });
        }
      } catch (error) {
        console.error("Erreur inscription", error);
        setErrors({ general: "Une erreur est survenue lors de l'inscription" });
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
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="flex flex-col w-full max-w-4xl overflow-hidden bg-white shadow-2xl rounded-2xl md:flex-row">
        {/* Section illustration */}
        <div className="flex-col items-center justify-center hidden p-12 text-white md:w-1/2 bg-gradient-to-br from-green-600 to-green-800 md:flex">
          <img
            src="https://images.unsplash.com/photo-1560472355-536de3962603"
            alt="Organisation des tâches"
            className="object-cover w-32 h-32 mb-8 transition-transform duration-300 rounded-full hover:scale-110"
          />
          <h2 className="mb-4 text-3xl font-bold">Rejoignez-nous</h2>
          <p className="text-lg text-center opacity-90">
            Créez votre compte pour accéder à votre gestionnaire de tâches et
            commencez à organiser vos journées efficacement.
          </p>
        </div>

        {/* Section formulaire */}
        <div className="p-8 md:w-1/2 md:p-12">
          <div className="mb-8 text-center">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf"
              alt="Logo Todo"
              className="w-16 h-16 mx-auto mb-4 transition-transform duration-300 rounded-full hover:scale-110"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              Créer un compte
            </h1>
            <p className="mt-2 text-gray-600">
              Inscrivez-vous pour gérer vos tâches
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div
                className="px-4 py-3 text-red-700 border border-red-300 rounded-lg bg-red-50"
                role="alert"
              >
                <p className="text-sm">{errors.general}</p>
              </div>
            )}
            {successMessage && (
              <div
                className="px-4 py-3 text-green-700 border border-green-300 rounded-lg bg-green-50"
                role="alert"
              >
                <p className="text-sm">{successMessage}</p>
              </div>
            )}

            {/* Prénom et Nom */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative">
                <FiUser
                  className="absolute text-gray-400 left-3 top-3"
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Prénom"
                  error={errors.prenom}
                  className="pl-10"
                  autoComplete="given-name"
                />
              </div>
              <div className="relative">
                <FiUser
                  className="absolute text-gray-400 left-3 top-3"
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Nom"
                  error={errors.nom}
                  className="pl-10"
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <FiMail
                className="absolute text-gray-400 left-3 top-3"
                aria-hidden="true"
              />
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

            {/* Mot de passe */}
            <div className="relative">
              <FiLock
                className="absolute text-gray-400 left-3 top-3"
                aria-hidden="true"
              />
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mot de passe"
                error={errors.password}
                className="pl-10 pr-10"
                autoComplete="new-password"
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
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Confirmation mot de passe */}
            <div className="relative">
              <FiLock
                className="absolute text-gray-400 left-3 top-3"
                aria-hidden="true"
              />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmer le mot de passe"
                error={errors.confirmPassword}
                className="pl-10 pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={
                  showConfirmPassword
                    ? "Masquer la confirmation"
                    : "Afficher la confirmation"
                }
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Conditions */}
            <div className="space-y-2">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  id="agreeToTerms"
                />
                <label
                  htmlFor="agreeToTerms"
                  className="ml-2 text-sm text-gray-600 cursor-pointer"
                >
                  J'accepte les{" "}
                  <button
                    type="button"
                    className="font-medium text-green-600 transition-colors hover:text-green-800"
                  >
                    conditions d'utilisation
                  </button>{" "}
                  et la{" "}
                  <button
                    type="button"
                    className="font-medium text-green-600 transition-colors hover:text-green-800"
                  >
                    politique de confidentialité
                  </button>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-500" role="alert">
                  {errors.agreeToTerms}
                </p>
              )}
            </div>

            <Button
              type="submit"
              loading={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900"
            >
              {isLoading ? "Création en cours..." : "Créer le compte"}
            </Button>

            <p className="mt-4 text-sm text-center text-gray-600">
              Vous avez déjà un compte ?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-medium text-green-600 transition-colors hover:text-green-800"
              >
                Se connecter
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
