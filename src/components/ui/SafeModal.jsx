import React from "react";

/**
 * Hook personnalisé pour gérer les événements clavier de manière sécurisée
 */
const useKeyboardHandler = (onEscape) => {
  const handleKeyDown = React.useCallback(
    (e) => {
      if (e.key === "Escape" && typeof onEscape === "function") {
        onEscape();
      }
    },
    [onEscape]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return handleKeyDown;
};

/**
 * Composant modal réutilisable avec gestion d'erreur robuste
 * @param {Object} props
 * @param {boolean} props.isOpen - État d'ouverture de la modal
 * @param {Function} props.onClose - Fonction appelée lors de la fermeture
 * @param {string} [props.title] - Titre de la modal
 * @param {React.ReactNode} props.children - Contenu de la modal
 * @param {string} [props.size] - Taille de la modal (sm, md, lg, xl)
 * @param {boolean} [props.closeOnOverlay] - Fermer en cliquant sur l'overlay
 */
const SafeModal = ({
  isOpen = false,
  onClose,
  title,
  children,
  size = "md",
  closeOnOverlay = true,
}) => {
  // Validation et fonction de fermeture sécurisée
  const safeClose = React.useCallback(() => {
    if (typeof onClose === "function") {
      try {
        onClose();
      } catch (error) {
        console.error("Erreur lors de l'exécution de onClose:", error);
      }
    } else {
      console.warn("Modal: onClose n'est pas une fonction valide");
    }
  }, [onClose]);

  // Gestion des événements clavier
  useKeyboardHandler(safeClose);

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
      safeClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "safe-modal-title" : undefined}
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
              id="safe-modal-title"
              className="text-xl font-semibold text-gray-900 dark:text-white"
            >
              {title}
            </h2>
            <button
              onClick={safeClose}
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

export default SafeModal;
