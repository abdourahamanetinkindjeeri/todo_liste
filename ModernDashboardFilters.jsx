import React from "react";
import { Search } from "lucide-react";
import { TODO_STATUSES, TODO_STATUS_LABELS } from "../../constants/todoStatuses.js";

const ModernDashboardFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  teamFilter,
  setTeamFilter,
  progressFilter,
  setProgressFilter,
  userCols,
  userRows,
  handleGridChange,
  showGridSettings,
  toggleGridSettings,
  gridConfig,
  clearFilters,
}) => {
  const progressFilters = [
    { value: "high", label: "80%+", active: progressFilter === "high" },
    { value: "medium", label: "50-79%", active: progressFilter === "medium" },
    { value: "low", label: "<50%", active: progressFilter === "low" },
  ];

  return (
    <div className="space-y-3">
      {/* Recherche */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute transform -translate-y-1/2 left-3 top-1/2 text-white/60" size={14} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 text-sm text-white transition-all border rounded-full bg-white/20 border-white/30 placeholder-white/60 focus:outline-none focus:bg-white/30 focus:border-white/50"
          />
        </div>
        <button
          onClick={clearFilters}
          className="px-3 py-2 text-xs font-medium text-red-300 transition-all border rounded-full bg-red-500/30 border-red-500/50 hover:bg-red-500/50 whitespace-nowrap"
        >
          Effacer filtres
        </button>
      </div>

      {/* Statut & équipe */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex-1 px-3 py-2 text-sm text-white border rounded-full bg-white/20 border-white/30 focus:outline-none focus:bg-white/30"
        >
          <option value="" className="bg-gray-800">Tous les statuts</option>
          <option value={TODO_STATUSES.EN_ATTENTE} className="bg-gray-800">{TODO_STATUS_LABELS[TODO_STATUSES.EN_ATTENTE]}</option>
          <option value={TODO_STATUSES.EN_COURS} className="bg-gray-800">{TODO_STATUS_LABELS[TODO_STATUSES.EN_COURS]}</option>
          <option value={TODO_STATUSES.TERMINEE} className="bg-gray-800">{TODO_STATUS_LABELS[TODO_STATUSES.TERMINEE]}</option>
        </select>
        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          className="flex-1 px-3 py-2 text-sm text-white border rounded-full bg-white/20 border-white/30 focus:outline-none focus:bg-white/30"
        >
          <option value="" className="bg-gray-800">Toutes les équipes</option>
          <option value="alpha" className="bg-gray-800">Équipe Alpha</option>
          <option value="beta" className="bg-gray-800">Équipe Beta</option>
          <option value="gamma" className="bg-gray-800">Équipe Gamma</option>
          <option value="delta" className="bg-gray-800">Équipe Delta</option>
        </select>
      </div>

      {/* Progression */}
      <div className="flex flex-wrap justify-start gap-2">
        {progressFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setProgressFilter(filter.active ? "" : filter.value)}
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

      {/* Paramètres Grille */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
        <span className="text-xs font-medium text-white/75">Configuration Grille:</span>
        <div className="flex items-center gap-2">
          <label className="text-xs text-white/60">Colonnes:</label>
          <select
            value={userCols}
            onChange={(e) => handleGridChange(parseInt(e.target.value), userRows)}
            className="px-2 py-1 text-xs text-white border rounded bg-white/20 border-white/30 focus:outline-none focus:bg-white/30"
          >
            {[1,2,3,4,5,6].map((col) => (
              <option key={col} value={col} className="bg-gray-800">{col}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-white/60">Lignes:</label>
          <select
            value={userRows}
            onChange={(e) => handleGridChange(userCols, parseInt(e.target.value))}
            className="px-2 py-1 text-xs text-white border rounded bg-white/20 border-white/30 focus:outline-none focus:bg-white/30"
          >
            {[1,2,3,4,5].map((row) => (
              <option key={row} value={row} className="bg-gray-800">{row}</option>
            ))}
          </select>
        </div>

        <button
          onClick={toggleGridSettings}
          className="px-3 py-1 text-xs font-medium text-blue-300 transition-all border rounded-full bg-blue-500/30 border-blue-500/50 hover:bg-blue-500/50"
        >
          {showGridSettings ? "Masquer" : "Avancé"}
        </button>
      </div>

      {showGridSettings && (
        <div className="p-3 space-y-2 border rounded-lg bg-white/5 border-white/10">
          <h4 className="mb-2 text-xs font-semibold text-white/80">Configurations Prédéfinies</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { name: "Compact", cols: 4, rows: 3, desc: "12 éléments" },
              { name: "Standard", cols: 3, rows: 2, desc: "6 éléments" },
              { name: "Large", cols: 2, rows: 2, desc: "4 éléments" },
              { name: "Liste", cols: 1, rows: 5, desc: "5 éléments" },
            ].map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleGridChange(preset.cols, preset.rows)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  gridConfig.cols === preset.cols && gridConfig.rows === preset.rows
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
  );
};

export default ModernDashboardFilters;
