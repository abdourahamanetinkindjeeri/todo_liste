import React, { useRef } from "react";
import SimpleTodoCard from "../../components/common/SimpleTodoCard.jsx";
import { Search, Plus } from "lucide-react";
import { Button } from "../../components/ui";

const ModernDashboardTodosGrid = ({
  currentData,
  gridConfig,
  handleEditTodo,
  handleCreateTodo,
  searchTerm,
  statusFilter,
  teamFilter,
  progressFilter,
}) => {
  const gridContainerRef = useRef(null);
  return (
    <div className="flex-1 overflow-hidden" ref={gridContainerRef}>
      {currentData.length > 0 ? (
        <div className="h-full">
          <div
            className={`grid gap-4 h-full`}
            style={{
              gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
              gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
            }}
          >
            {currentData.map((todo) => (
              <div
                key={todo.id}
                className="flex min-h-0 transition-transform duration-200 transform hover:scale-105"
              >
                <div className="flex flex-col w-full h-full overflow-hidden">
                  <div className="flex-1 min-h-0">
                    <SimpleTodoCard
                      todo={todo}
                      onEdit={handleEditTodo}
                      compact={gridConfig.itemsPerPage > 6}
                    />
                  </div>
                </div>
              </div>
            ))}
            {Array.from({ length: gridConfig.itemsPerPage - currentData.length }).map((_, index) => (
              <div key={`empty-${index}`} className="invisible" />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full py-8 text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-white/10">
            <Search className="text-white/60" size={24} />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">Aucune tâche trouvée</h3>
          <p className="mb-3 text-sm text-white/75">
            {searchTerm || statusFilter || teamFilter || progressFilter
              ? "Essayez d'ajuster vos filtres de recherche"
              : "Créez votre première tâche pour commencer"}
          </p>
          <Button
            onClick={handleCreateTodo}
            className="px-4 py-2 text-sm font-medium text-white transition-all rounded-full shadow-lg bg-gradient-to-r from-red-400 to-teal-400 hover:shadow-xl"
          >
            <Plus size={14} className="mr-1" />
            Créer une tâche
          </Button>
        </div>
      )}
    </div>
  );
};

export default ModernDashboardTodosGrid;
