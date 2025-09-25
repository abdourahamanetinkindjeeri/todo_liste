import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

/**
 * Composant de pagination personnalisé moderne
 * @param {Object} props
 * @param {number} props.currentPage - Page actuelle
 * @param {number} props.totalPages - Nombre total de pages
 * @param {Function} props.onPageChange - Fonction appelée lors du changement de page
 * @param {string} props.className - Classes CSS additionnelles
 * @param {boolean} props.showFirstLast - Afficher les boutons première/dernière page
 * @param {number} props.siblingCount - Nombre de pages à afficher autour de la page actuelle
 */
const CustomPagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  className = "",
  showFirstLast = true,
  siblingCount = 1,
}) => {
  // Génération de la liste des pages à afficher
  const generatePageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3; // Pages autour + première + dernière + actuelle
    const totalBlocks = totalNumbers + 2; // + 2 pour les ellipses

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Cas 1: Pas de points à gauche, points à droite
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "...", totalPages];
    }

    // Cas 2: Points à gauche, pas de points à droite
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, "...", ...rightRange];
    }

    // Cas 3: Points des deux côtés
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }

    return [];
  };

  const pageNumbers = generatePageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className={`flex items-center justify-center space-x-1 ${className}`}
      role="navigation"
      aria-label="Pagination"
    >
      {/* Bouton première page */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          title="Première page"
        >
          <ChevronsLeft size={16} />
        </button>
      )}

      {/* Bouton page précédente */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        title="Page précédente"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Pages */}
      {pageNumbers.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex items-center justify-center w-10 h-10 text-white/60"
            >
              ...
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all ${
              isActive
                ? "bg-gradient-to-r from-red-400 to-teal-400 text-white shadow-lg scale-110"
                : "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-105"
            }`}
            title={`Page ${page}`}
          >
            {page}
          </button>
        );
      })}

      {/* Bouton page suivante */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        title="Page suivante"
      >
        <ChevronRight size={16} />
      </button>

      {/* Bouton dernière page */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          title="Dernière page"
        >
          <ChevronsRight size={16} />
        </button>
      )}
    </nav>
  );
};

export default CustomPagination;
