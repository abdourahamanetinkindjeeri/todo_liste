import React, { forwardRef } from "react";

/**
 * Composant input réutilisable
 * @param {Object} props
 * @param {string} [props.label] - Label du champ
 * @param {string} [props.error] - Message d'erreur
 * @param {string} [props.placeholder] - Placeholder
 * @param {string} [props.type] - Type de l'input
 * @param {boolean} [props.required] - Champ requis
 * @param {string} [props.className] - Classes CSS supplémentaires
 */
const Input = forwardRef(({
  label,
  error,
  placeholder,
  type = "text",
  required = false,
  className = "",
  ...props
}, ref) => {
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    transition-colors duration-200
    ${error 
      ? "border-red-500 bg-red-50 dark:bg-red-900/20" 
      : "border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600"
    }
    dark:text-white placeholder-gray-500 dark:placeholder-gray-400
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={inputClasses}
        required={required}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;