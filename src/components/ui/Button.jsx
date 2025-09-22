import React from "react";
import { SIZES, COLORS } from "../../constants/index.js";

/**
 * Composant bouton réutilisable
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu du bouton
 * @param {string} [props.variant] - Variante du bouton (primary, secondary, outline, ghost)
 * @param {string} [props.size] - Taille du bouton (sm, md, lg)
 * @param {string} [props.color] - Couleur du bouton
 * @param {boolean} [props.disabled] - Bouton désactivé
 * @param {boolean} [props.loading] - État de chargement
 * @param {Function} [props.onClick] - Fonction appelée au clic
 * @param {string} [props.type] - Type du bouton (button, submit, reset)
 * @param {string} [props.className] - Classes CSS supplémentaires
 */
const Button = ({
  children,
  variant = "primary",
  size = SIZES.MEDIUM,
  color = COLORS.PRIMARY,
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case SIZES.SMALL:
        return "px-3 py-1.5 text-sm";
      case SIZES.LARGE:
        return "px-6 py-3 text-lg";
      default:
        return "px-4 py-2 text-base";
    }
  };

  const getVariantClasses = () => {
    const baseClasses = "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    switch (variant) {
      case "secondary":
        return `${baseClasses} bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600`;
      case "outline":
        return `${baseClasses} border border-current bg-transparent hover:bg-current hover:text-white focus:ring-current`;
      case "ghost":
        return `${baseClasses} bg-transparent hover:bg-gray-100 focus:ring-gray-500 dark:hover:bg-gray-800`;
      default: // primary
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300`;
    }
  };

  const getColorClasses = () => {
    if (variant === "primary") {
      switch (color) {
        case COLORS.SUCCESS:
          return "bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300";
        case COLORS.ERROR:
          return "bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300";
        case COLORS.WARNING:
          return "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 disabled:bg-yellow-300";
        default:
          return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300";
      }
    }
    return "";
  };

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={`
        ${getSizeClasses()}
        ${getVariantClasses()}
        ${getColorClasses()}
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;