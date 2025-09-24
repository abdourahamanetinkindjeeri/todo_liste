import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useUserContext } from "../../context/useUserContext.jsx";
import { useTodoContext } from "../../context/useTodoContext.jsx";
import { usePagination } from "../../hooks/usePagination.js";
import { useNotifications } from "../../hooks/useNotifications.js";
import { Plus, X } from "lucide-react";
import { TODO_STATUSES } from "../../constants/todoStatuses.js";
import {
  SafeModal,
  Button,
  CustomPagination,
} from "../../components/ui/index.js";
import ModernDashboardHeader from "./ModernDashboardHeader.jsx";
import ModernDashboardStats from "./ModernDashboardStats.jsx";
import ModernDashboardFilters from "./ModernDashboardFilters.jsx";
import ModernDashboardTodosGrid from "./ModernDashboardTodosGrid.jsx";
import SimpleCreateTodoForm from "../../components/common/SimpleCreateTodoForm.jsx";
import SimpleEditTodoForm from "../../components/common/SimpleEditTodoForm.jsx";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ModernDashboard = () => {
  const { user, logout, isAuthenticated } = useUserContext();
  const { todos, fetchTodos, isLoading } = useTodoContext();
  const { notifications, addNotification, removeNotification } =
    useNotifications();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [progressFilter, setProgressFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [gridConfig, setGridConfig] = useState({
    cols: 3,
    rows: 2,
    itemsPerPage: 6,
  });
  const [showGridSettings, setShowGridSettings] = useState(false);
  const [userCols, setUserCols] = useState(3);
  const [userRows, setUserRows] = useState(2);

  // Notification helper
  const showNotification = useCallback(
    (type, message, duration = 5000) => {
      addNotification(type, message, duration);
    },
    [addNotification]
  );

  // Filtrage des todos
  const filteredTodos = useMemo(() => {
    if (!Array.isArray(todos)) return [];
    return todos.filter((todo) => {
      const title = todo.titre || todo.libelle || todo.title || "";
      const description = todo.description || "";
      const status =
        todo.statut ||
        todo.status ||
        (todo.termine ? TODO_STATUSES.TERMINEE : TODO_STATUSES.EN_ATTENTE);

      const matchesSearch =
        !searchTerm ||
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || status === statusFilter;
      const matchesTeam =
        !teamFilter ||
        todo.user?.prenom?.toLowerCase().includes(teamFilter.toLowerCase()) ||
        todo.user?.name?.toLowerCase().includes(teamFilter.toLowerCase());

      const progress =
        status === TODO_STATUSES.TERMINEE
          ? 100
          : status === TODO_STATUSES.EN_COURS
          ? 60
          : 30;
      const matchesProgress =
        !progressFilter ||
        (progressFilter === "high" && progress >= 80) ||
        (progressFilter === "medium" && progress >= 50 && progress < 80) ||
        (progressFilter === "low" && progress < 50);

      return matchesSearch && matchesStatus && matchesTeam && matchesProgress;
    });
  }, [todos, searchTerm, statusFilter, teamFilter, progressFilter]);

  // Pagination & grid
  const calculateGridConfig = useCallback(
    (cols = userCols, rows = userRows) => {
      if (typeof window !== "undefined" && window.innerWidth < 768)
        cols = Math.min(cols, 2);
      return { cols, rows, itemsPerPage: cols * rows };
    },
    [userCols, userRows]
  );

  const applyGridSettings = useCallback(() => {
    setGridConfig(calculateGridConfig(userCols, userRows));
  }, [calculateGridConfig, userCols, userRows]);

  useEffect(() => {
    applyGridSettings();
  }, [applyGridSettings]);

  const handleGridChange = (cols, rows) => {
    setUserCols(cols);
    setUserRows(rows);
    setGridConfig(calculateGridConfig(cols, rows));
  };

  const { currentData, currentPage, totalPages, goToPage } = usePagination(
    filteredTodos,
    gridConfig.itemsPerPage
  );

  const stats = useMemo(() => {
    if (!Array.isArray(todos))
      return { total: 0, active: 0, pending: 0, completed: 0 };
    const total = todos.length;
    const active = todos.filter(
      (t) =>
        t.statut === TODO_STATUSES.EN_COURS ||
        t.status === TODO_STATUSES.EN_COURS
    ).length;
    const pending = todos.filter(
      (t) =>
        t.statut === TODO_STATUSES.EN_ATTENTE ||
        t.status === TODO_STATUSES.EN_ATTENTE
    ).length;
    const completed = todos.filter(
      (t) =>
        t.statut === TODO_STATUSES.TERMINEE ||
        t.status === TODO_STATUSES.TERMINEE
    ).length;
    return { total, active, pending, completed };
  }, [todos]);

  // Fetch todos
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Vérifier l'authentification et rediriger si nécessaire
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Logout
  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = async () => {
    setShowLogoutModal(false);

    try {
      // Appeler logout
      logout();

      // Attendre un court moment pour que le logout soit traité
      // await new Promise((resolve) => setTimeout(resolve, 100));

      // Notification et navigation
      showNotification("success", "Déconnexion réussie");

      // Navigation avec nettoyage de l'historique
      navigate("/login", { replace: true });

      // Force le rechargement pour nettoyer complètement l'état
      window.location.replace("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // En cas d'erreur, forcer la redirection
      window.location.replace("/login");
    }
  };
  const cancelLogout = () => setShowLogoutModal(false);

  // Handlers for todo modals
  const handleCreateTodo = () => setShowCreateModal(true);
  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setShowEditModal(true);
  };
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setTeamFilter("");
    setProgressFilter("");
  };
  const handleRefresh = () => {
    fetchTodos();
    showNotification("success", "Données actualisées");
  };
  const toggleGridSettings = () => setShowGridSettings(!showGridSettings);

  // Loading state
  if (isLoading && todos.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
        <div className="w-12 h-12 border-b-2 border-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen p-4 overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed z-50 space-y-2 top-4 right-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-lg backdrop-blur-md border border-white/20 shadow-lg animate-slide-in ${
                n.type === "success"
                  ? "bg-green-500/80 text-white"
                  : n.type === "error"
                  ? "bg-red-500/80 text-white"
                  : "bg-blue-500/80 text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{n.message}</span>
                <button
                  onClick={() => removeNotification(n.id)}
                  className="ml-2 text-white/80 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="w-full max-w-7xl h-full max-h-[95vh] mx-auto bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-6 overflow-hidden flex flex-col">
        <ModernDashboardHeader
          user={user}
          onRefresh={handleRefresh}
          onLogout={handleLogout}
          isLoading={isLoading}
        />
        <ModernDashboardStats stats={stats} />

        <section className="flex flex-col flex-1 min-h-0 p-4 border bg-white/10 backdrop-blur-md rounded-2xl border-white/20">
          <div className="flex flex-col flex-shrink-0 gap-4 mb-4">
            <h2 className="text-xl font-semibold text-white">
              Tâches Récentes
            </h2>
            <ModernDashboardFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              teamFilter={teamFilter}
              setTeamFilter={setTeamFilter}
              progressFilter={progressFilter}
              setProgressFilter={setProgressFilter}
              userCols={userCols}
              userRows={userRows}
              handleGridChange={handleGridChange}
              showGridSettings={showGridSettings}
              toggleGridSettings={toggleGridSettings}
              gridConfig={gridConfig}
              clearFilters={clearFilters}
            />
          </div>

          <ModernDashboardTodosGrid
            currentData={currentData}
            gridConfig={gridConfig}
            handleEditTodo={handleEditTodo}
            handleCreateTodo={handleCreateTodo}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            teamFilter={teamFilter}
            progressFilter={progressFilter}
          />

          <div className="flex flex-col items-center flex-shrink-0 gap-2 pt-3 border-t border-white/10">
            {totalPages > 1 && (
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                showFirstLast
                siblingCount={1}
              />
            )}
            <div className="mt-1 text-xs text-center text-white/75">
              {totalPages > 1
                ? `Page ${currentPage} sur ${totalPages} • ${filteredTodos.length} tâche(s) au total`
                : `${filteredTodos.length} tâche${
                    filteredTodos.length !== 1 ? "s" : ""
                  } au total`}
              <div className="mt-1 text-white/60">
                Grille personnalisée {gridConfig.cols}×{gridConfig.rows} •{" "}
                {gridConfig.itemsPerPage} éléments/page
                {currentData.length < gridConfig.itemsPerPage && (
                  <span className="ml-2 text-white/50">
                    • {gridConfig.itemsPerPage - currentData.length} cases vides
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bouton flottant */}
      <button
        onClick={handleCreateTodo}
        className="fixed z-40 flex items-center justify-center w-16 h-16 text-white transition-all duration-300 transform rounded-full shadow-2xl bottom-8 right-8 bg-gradient-to-r from-red-400 to-teal-400 hover:shadow-3xl hover:scale-110"
        title="Créer une nouvelle tâche"
      >
        <Plus size={24} />
      </button>

      {/* Modals */}
      {showCreateModal && (
        <SafeModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        >
          <SimpleCreateTodoForm
            onSuccess={() => {
              setShowCreateModal(false);
              fetchTodos();
              showNotification("success", "Tâche créée avec succès");
            }}
            onCancel={() => setShowCreateModal(false)}
            showNotification={showNotification}
          />
        </SafeModal>
      )}

      {showEditModal && editingTodo && (
        <SafeModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
        >
          <SimpleEditTodoForm
            todo={editingTodo}
            onSuccess={() => {
              setShowEditModal(false);
              setEditingTodo(null);
              fetchTodos();
              showNotification("success", "Tâche modifiée avec succès");
            }}
            onCancel={() => {
              setShowEditModal(false);
              setEditingTodo(null);
            }}
            showNotification={showNotification}
          />
        </SafeModal>
      )}

      {showLogoutModal && (
        <SafeModal isOpen={showLogoutModal} onClose={cancelLogout}>
          <div className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <Logout className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Confirmer la déconnexion
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              Êtes-vous sûr de vouloir vous déconnecter ?
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={cancelLogout}>
                Annuler
              </Button>
              <Button
                onClick={confirmLogout}
                className="text-white bg-red-600 hover:bg-red-700"
              >
                Se déconnecter
              </Button>
            </div>
          </div>
        </SafeModal>
      )}
    </div>
  );
};

export default ModernDashboard;
