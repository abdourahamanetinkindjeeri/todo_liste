import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useUserContext } from "../../context/useUserContext.jsx";
import "./ModernDashboard.css";
import { useTodoContext } from "../../context/useTodoContext.jsx";
import { usePagination } from "../../hooks/usePagination.js";
import { useNotifications } from "../../hooks/useNotifications.js";
import {
  Button,
  CustomPagination,
  SafeModal,
} from "../../components/ui/index.js";
import {
  TODO_STATUSES,
  TODO_STATUS_LABELS,
} from "../../constants/todoStatuses.js";
import SimpleTodoCard from "../../components/common/SimpleTodoCard.jsx";
import SimpleCreateTodoForm from "../../components/common/SimpleCreateTodoForm.jsx";
import SimpleEditTodoForm from "../../components/common/SimpleEditTodoForm.jsx";
import {
  Search,
  Filter,
  Plus,
  RefreshCw,
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  X,
  LogOut,
} from "lucide-react";

/**
 * Dashboard moderne avec design glassmorphism et fonctionnalités complètes
 */
const ModernDashboard = () => {
  const { user, logout } = useUserContext();
  const { todos, fetchTodos, isLoading } = useTodoContext();
  const { notifications, addNotification, removeNotification } =
    useNotifications();

  // Fonction générique pour les notifications
  const showNotification = useCallback(
    (type, message, duration = 5000) => {
      addNotification(type, message, duration);
    },
    [addNotification]
  );

  // États locaux pour les filtres et la recherche
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [progressFilter, setProgressFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // États pour la grille personnalisable
  const [gridConfig, setGridConfig] = useState({
    cols: 3,
    rows: 2,
    itemsPerPage: 6,
  });
  const [showGridSettings, setShowGridSettings] = useState(false);
  const [userCols, setUserCols] = useState(3);
  const [userRows, setUserRows] = useState(2);
  const gridContainerRef = useRef(null);

  // Données filtrées
  const filteredTodos = useMemo(() => {
    if (!Array.isArray(todos)) return [];

    return todos.filter((todo) => {
      // Normalisation des propriétés du todo
      const todoTitle = todo.titre || todo.libelle || todo.title || "";
      const todoDescription = todo.description || "";
      const todoStatus =
        todo.statut ||
        todo.status ||
        (todo.termine ? TODO_STATUSES.TERMINEE : TODO_STATUSES.EN_ATTENTE);

      const matchesSearch =
        !searchTerm ||
        todoTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todoDescription.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || todoStatus === statusFilter;

      const matchesTeam =
        !teamFilter ||
        todo.user?.prenom?.toLowerCase().includes(teamFilter.toLowerCase()) ||
        todo.user?.name?.toLowerCase().includes(teamFilter.toLowerCase());

      // Calcul du pourcentage de progression basé sur le statut
      const progress =
        todoStatus === TODO_STATUSES.TERMINEE
          ? 100
          : todoStatus === TODO_STATUSES.EN_COURS
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

  // Calcul de la grille basé sur les choix utilisateur
  const calculateGridConfig = useCallback(
    (cols = userCols, rows = userRows) => {
      // Adaptation responsives pour mobile
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        cols = Math.min(cols, 2); // Maximum 2 colonnes sur mobile
      }

      const itemsPerPage = cols * rows;
      return { cols, rows, itemsPerPage };
    },
    [userCols, userRows]
  );

  // Fonction pour appliquer les paramètres de grille
  const applyGridSettings = useCallback(() => {
    const config = calculateGridConfig(userCols, userRows);
    setGridConfig(config);
  }, [calculateGridConfig, userCols, userRows]);

  // Effet pour appliquer la configuration initiale et lors des changements
  useEffect(() => {
    applyGridSettings();
  }, [applyGridSettings]);

  // Gestionnaire pour changer la configuration de grille
  const handleGridChange = (newCols, newRows) => {
    setUserCols(newCols);
    setUserRows(newRows);
    const config = calculateGridConfig(newCols, newRows);
    setGridConfig(config);
  };

  // Pagination avec nombre d'éléments dynamique
  const { currentData, currentPage, totalPages, goToPage } = usePagination(
    filteredTodos,
    gridConfig.itemsPerPage
  );

  // Statistiques
  const stats = useMemo(() => {
    if (!Array.isArray(todos))
      return { total: 0, active: 0, pending: 0, completed: 0 };

    const total = todos.length;
    const active = todos.filter((t) => {
      const status =
        t.statut ||
        t.status ||
        (t.termine ? TODO_STATUSES.TERMINEE : TODO_STATUSES.EN_ATTENTE);
      return status === TODO_STATUSES.EN_COURS;
    }).length;
    const pending = todos.filter((t) => {
      const status =
        t.statut ||
        t.status ||
        (t.termine ? TODO_STATUSES.TERMINEE : TODO_STATUSES.EN_ATTENTE);
      return status === TODO_STATUSES.EN_ATTENTE;
    }).length;
    const completed = todos.filter((t) => {
      const status =
        t.statut ||
        t.status ||
        (t.termine ? TODO_STATUSES.TERMINEE : TODO_STATUSES.EN_ATTENTE);
      return status === TODO_STATUSES.TERMINEE;
    }).length;

    return { total, active, pending, completed };
  }, [todos]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Gestionnaires d'événements
  const handleCreateTodo = () => {
    setShowCreateModal(true);
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setShowEditModal(true);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setTeamFilter("");
    setProgressFilter("");
  };

  const handleRefresh = () => {
    fetchTodos();
    showNotification("success", "Données actualisées");
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    setIsLoggingOut(true);

    // Déconnexion immédiate
    logout();

    // Afficher notification
    showNotification("error", "Déconnexion réussie");

    // Redirection qui marchait bien
    window.location.href = "/login";
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Rendu conditionnel pour la déconnexion
  if (isLoggingOut) {
    return (
      <div className="flex flex-col items-center justify-center h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
        <div className="w-12 h-12 mb-4 border-b-2 border-white rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-white">
          Déconnexion en cours...
        </p>
        <p className="mt-2 text-sm text-white/70">
          Redirection vers la page de connexion
        </p>
      </div>
    );
  }

  // Rendu conditionnel pour le loading
  if (isLoading && todos.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
        <div className="w-12 h-12 border-b-2 border-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen p-4 overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed z-50 space-y-2 top-4 right-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg backdrop-blur-md border border-white/20 shadow-lg animate-slide-in ${
                notification.type === "success"
                  ? "bg-green-500/80 text-white"
                  : notification.type === "error"
                  ? "bg-red-500/80 text-white"
                  : "bg-blue-500/80 text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{notification.message}</span>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="ml-2 text-white/80 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Container principal avec glassmorphism - centré et sans scroll */}
      <div className="w-full max-w-7xl h-full max-h-[95vh] mx-auto bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-6 overflow-hidden flex flex-col">
        {/* Header - plus compact */}
        <header className="flex items-center justify-between flex-shrink-0 mb-4">
          <div>
            <h1 className="mb-1 text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-white/75">
              Bienvenue, {user?.prenom || user?.name || "Utilisateur"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleRefresh}
              variant="ghost"
              className="px-3 py-2 text-white border-white/30 hover:bg-white/10"
              disabled={isLoading}
            >
              <RefreshCw
                size={14}
                className={`mr-1 ${isLoading ? "animate-spin" : ""}`}
              />
              Actualiser
            </Button>

            <Button
              onClick={handleLogout}
              variant="ghost"
              className="px-3 py-2 text-white border-red-400/30 hover:bg-red-500/10"
            >
              <LogOut size={14} className="mr-1" />
              Déconnexion
            </Button>
          </div>
        </header>

        {/* Statistiques - plus compactes */}
        <section className="grid flex-shrink-0 grid-cols-2 gap-4 mb-4 md:grid-cols-4">
          <div className="p-4 transition-all duration-300 border bg-white/15 backdrop-blur-md rounded-xl border-white/20 hover:bg-white/20 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 text-2xl font-bold text-white">
                  {stats.total}
                </div>
                <div className="text-xs tracking-wide uppercase text-white/75">
                  Total Tâches
                </div>
              </div>
              <TrendingUp className="text-white/60" size={24} />
            </div>
          </div>

          <div className="p-4 transition-all duration-300 border bg-white/15 backdrop-blur-md rounded-xl border-white/20 hover:bg-white/20 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 text-2xl font-bold text-white">
                  {stats.active}
                </div>
                <div className="text-xs tracking-wide uppercase text-white/75">
                  En Cours
                </div>
              </div>
              <Clock className="text-blue-300" size={24} />
            </div>
          </div>

          <div className="p-4 transition-all duration-300 border bg-white/15 backdrop-blur-md rounded-xl border-white/20 hover:bg-white/20 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 text-2xl font-bold text-white">
                  {stats.pending}
                </div>
                <div className="text-xs tracking-wide uppercase text-white/75">
                  En Attente
                </div>
              </div>
              <AlertCircle className="text-orange-300" size={24} />
            </div>
          </div>

          <div className="p-4 transition-all duration-300 border bg-white/15 backdrop-blur-md rounded-xl border-white/20 hover:bg-white/20 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 text-2xl font-bold text-white">
                  {stats.completed}
                </div>
                <div className="text-xs tracking-wide uppercase text-white/75">
                  Terminées
                </div>
              </div>
              <CheckCircle className="text-green-300" size={24} />
            </div>
          </div>
        </section>

        {/* Section des tâches récentes - flexibile et scrollable */}
        <section className="flex flex-col flex-1 min-h-0 p-4 border bg-white/10 backdrop-blur-md rounded-2xl border-white/20">
          {/* En-tête avec filtres */}
          <div className="flex flex-col flex-shrink-0 gap-4 mb-4">
            <h2 className="text-xl font-semibold text-white">
              Tâches Récentes
            </h2>

            {/* Contrôles de filtrage - plus compacts */}
            <div className="space-y-3">
              {/* Ligne 1: Recherche */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    className="absolute transform -translate-y-1/2 left-3 top-1/2 text-white/60"
                    size={14}
                  />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 text-sm text-white transition-all border rounded-full bg-white/20 border-white/30 placeholder-white/60 focus:outline-none focus:bg-white/30 focus:border-white/50"
                  />
                </div>
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-2 text-xs font-medium text-red-300 transition-all border rounded-full bg-red-500/30 border-red-500/50 hover:bg-red-500/50 whitespace-nowrap"
                >
                  Effacer filtres
                </button>
              </div>

              {/* Ligne 2: Filtres */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm text-white border rounded-full bg-white/20 border-white/30 focus:outline-none focus:bg-white/30"
                >
                  <option value="" className="bg-gray-800">
                    Tous les statuts
                  </option>
                  <option
                    value={TODO_STATUSES.EN_ATTENTE}
                    className="bg-gray-800"
                  >
                    {TODO_STATUS_LABELS[TODO_STATUSES.EN_ATTENTE]}
                  </option>
                  <option
                    value={TODO_STATUSES.EN_COURS}
                    className="bg-gray-800"
                  >
                    {TODO_STATUS_LABELS[TODO_STATUSES.EN_COURS]}
                  </option>
                  <option
                    value={TODO_STATUSES.TERMINEE}
                    className="bg-gray-800"
                  >
                    {TODO_STATUS_LABELS[TODO_STATUSES.TERMINEE]}
                  </option>
                </select>

                <select
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm text-white border rounded-full bg-white/20 border-white/30 focus:outline-none focus:bg-white/30"
                >
                  <option value="" className="bg-gray-800">
                    Toutes les équipes
                  </option>
                  <option value="alpha" className="bg-gray-800">
                    Équipe Alpha
                  </option>
                  <option value="beta" className="bg-gray-800">
                    Équipe Beta
                  </option>
                  <option value="gamma" className="bg-gray-800">
                    Équipe Gamma
                  </option>
                  <option value="delta" className="bg-gray-800">
                    Équipe Delta
                  </option>
                </select>
              </div>

              {/* Ligne 3: Filtres de progression */}
              <div className="flex flex-wrap justify-start gap-2">
                {[
                  {
                    value: "high",
                    label: "80%+",
                    active: progressFilter === "high",
                  },
                  {
                    value: "medium",
                    label: "50-79%",
                    active: progressFilter === "medium",
                  },
                  {
                    value: "low",
                    label: "<50%",
                    active: progressFilter === "low",
                  },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() =>
                      setProgressFilter(filter.active ? "" : filter.value)
                    }
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      filter.active
                        ? "bg-gradient-to-r from-red-400 to-teal-400 text-white shadow-lg"
                        : "bg-white/15 text-white/85 hover:bg-white/25"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Ligne 4: Paramètres de grille */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
                <span className="text-xs font-medium text-white/75">
                  Configuration Grille:
                </span>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-white/60">Colonnes:</label>
                  <select
                    value={userCols}
                    onChange={(e) =>
                      handleGridChange(parseInt(e.target.value), userRows)
                    }
                    className="px-2 py-1 text-xs text-white border rounded bg-white/20 border-white/30 focus:outline-none focus:bg-white/30"
                  >
                    <option value={1} className="bg-gray-800">
                      1
                    </option>
                    <option value={2} className="bg-gray-800">
                      2
                    </option>
                    <option value={3} className="bg-gray-800">
                      3
                    </option>
                    <option value={4} className="bg-gray-800">
                      4
                    </option>
                    <option value={5} className="bg-gray-800">
                      5
                    </option>
                    <option value={6} className="bg-gray-800">
                      6
                    </option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-white/60">Lignes:</label>
                  <select
                    value={userRows}
                    onChange={(e) =>
                      handleGridChange(userCols, parseInt(e.target.value))
                    }
                    className="px-2 py-1 text-xs text-white border rounded bg-white/20 border-white/30 focus:outline-none focus:bg-white/30"
                  >
                    <option value={1} className="bg-gray-800">
                      1
                    </option>
                    <option value={2} className="bg-gray-800">
                      2
                    </option>
                    <option value={3} className="bg-gray-800">
                      3
                    </option>
                    <option value={4} className="bg-gray-800">
                      4
                    </option>
                    <option value={5} className="bg-gray-800">
                      5
                    </option>
                  </select>
                </div>

                <button
                  onClick={() => setShowGridSettings(!showGridSettings)}
                  className="px-3 py-1 text-xs font-medium text-blue-300 transition-all border rounded-full bg-blue-500/30 border-blue-500/50 hover:bg-blue-500/50"
                >
                  {showGridSettings ? "Masquer" : "Avancé"}
                </button>
              </div>

              {/* Options avancées */}
              {showGridSettings && (
                <div className="p-3 space-y-2 border rounded-lg bg-white/5 border-white/10">
                  <h4 className="mb-2 text-xs font-semibold text-white/80">
                    Configurations Prédéfinies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        name: "Compact",
                        cols: 4,
                        rows: 3,
                        desc: "12 éléments",
                      },
                      {
                        name: "Standard",
                        cols: 3,
                        rows: 2,
                        desc: "6 éléments",
                      },
                      { name: "Large", cols: 2, rows: 2, desc: "4 éléments" },
                      { name: "Liste", cols: 1, rows: 5, desc: "5 éléments" },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() =>
                          handleGridChange(preset.cols, preset.rows)
                        }
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          gridConfig.cols === preset.cols &&
                          gridConfig.rows === preset.rows
                            ? "bg-gradient-to-r from-red-400 to-teal-400 text-white shadow-lg"
                            : "bg-white/10 text-white/80 hover:bg-white/20"
                        }`}
                      >
                        <div>{preset.name}</div>
                        <div className="text-xs opacity-75">{preset.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grille des tâches - dynamique selon l'espace disponible */}
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
                            showNotification={showNotification}
                            compact={gridConfig.itemsPerPage > 6}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Cases vides pour compléter la grille et maintenir la taille uniforme */}
                  {Array.from({
                    length: gridConfig.itemsPerPage - currentData.length,
                  }).map((_, index) => (
                    <div key={`empty-${index}`} className="invisible"></div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-white/10">
                  <Search className="text-white/60" size={24} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Aucune tâche trouvée
                </h3>
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

          {/* Pagination - toujours visible */}
          <div className="flex flex-col items-center flex-shrink-0 gap-2 pt-3 border-t border-white/10">
            {totalPages > 1 && (
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                showFirstLast={true}
                siblingCount={1}
              />
            )}
            <div className="text-center">
              <span className="text-xs text-white/75">
                {totalPages > 1 ? (
                  <>
                    Page {currentPage} sur {totalPages} • {filteredTodos.length}{" "}
                    tâche{filteredTodos.length !== 1 ? "s" : ""} au total
                  </>
                ) : (
                  <>
                    {filteredTodos.length} tâche
                    {filteredTodos.length !== 1 ? "s" : ""} au total
                  </>
                )}
              </span>
              <div className="mt-1 text-xs text-white/60">
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

      {/* Bouton flottant d'ajout */}
      <button
        onClick={handleCreateTodo}
        className="fixed z-40 flex items-center justify-center w-16 h-16 text-white transition-all duration-300 transform rounded-full shadow-2xl bottom-8 right-8 bg-gradient-to-r from-red-400 to-teal-400 hover:shadow-3xl hover:scale-110"
        title="Créer une nouvelle tâche"
      >
        <Plus size={24} />
      </button>

      {/* Modals */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md max-h-screen overflow-auto bg-white shadow-2xl rounded-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Créer une tâche
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <SimpleCreateTodoForm
                onSuccess={() => {
                  setShowCreateModal(false);
                  fetchTodos();
                  showNotification("success", "Tâche créée avec succès");
                }}
                onCancel={() => setShowCreateModal(false)}
                showNotification={showNotification}
              />
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingTodo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md max-h-screen overflow-auto bg-white shadow-2xl rounded-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Modifier la tâche
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
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
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de déconnexion */}
      {showLogoutModal && (
        <SafeModal isOpen={showLogoutModal} onClose={cancelLogout}>
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-center text-gray-900">
              Confirmer la déconnexion
            </h3>
            <p className="mb-6 text-sm text-center text-gray-600">
              Êtes-vous sûr de vouloir vous déconnecter ? Votre session sera
              terminée et vous devrez vous reconnecter pour accéder au
              dashboard.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={cancelLogout}
                className="px-4 py-2"
              >
                Annuler
              </Button>
              <Button
                onClick={confirmLogout}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700"
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
