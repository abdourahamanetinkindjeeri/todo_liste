import React from "react";

/**
 * Composant modal réutilisable
 * @param {Object} props
 * @param {boolean} props.isOpen - État d'ouverture de la modal
 * @param {Function} props.onClose - Fonction appelée lors de la fermeture
 * @param {string} [props.title] - Titre de la modal
 * @param {React.ReactNode} props.children - Contenu de la modal
 * @param {string} [props.size] - Taille de la modal (sm, md, lg, xl)
 * @param {boolean} [props.closeOnOverlay] - Fermer en cliquant sur l'overlay
 */
const Modal = ({
  isOpen = false,
  onClose = () => {},
  title,
  children,
  size = "md",
  closeOnOverlay = true,
}) => {
  // Validation et défaut pour onClose
  const handleClose =
    typeof onClose === "function"
      ? onClose
      : () => {
          console.warn("Modal: onClose is not a function");
        };

  if (!isOpen) return null;

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "max-w-md";
      case "lg":
        return "max-w-2xl";
      case "xl":
        return "max-w-4xl";
      default:
        return "max-w-lg";
    }
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className={`
          w-full ${getSizeClasses()} max-h-[90vh] overflow-y-auto
          bg-white dark:bg-gray-900 rounded-xl shadow-2xl
          transform transition-all duration-200
        `}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2
              id="modal-title"
              className="text-xl font-semibold text-gray-900 dark:text-white"
            >
              {title}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Fermer la modal"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        <div className={title ? "p-6" : "p-6"}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
