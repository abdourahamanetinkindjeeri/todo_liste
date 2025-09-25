#!/bin/bash

# Crée les dossiers nécessaires
mkdir -p src/features/dashboard
mkdir -p src/components/ui
mkdir -p src/hooks
mkdir -p src/constants

# ----------------------------
# Composants du dashboard
# ----------------------------

cat > src/features/dashboard/DashboardHeader.jsx << 'EOF'
import React from "react";
import { Button } from "../../components/ui";

const DashboardHeader = ({ user, onRefresh, onLogout }) => {
  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-white/90">
        Tableau de bord {user?.prenom || user?.name}
      </h1>
      <div className="flex gap-2">
        <Button onClick={onRefresh}>Rafraîchir</Button>
        <Button onClick={onLogout}>Déconnexion</Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
EOF

cat > src/features/dashboard/DashboardStats.jsx << 'EOF'
import React from "react";

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="p-4 bg-white/20 rounded-lg text-center text-white">
        <h2 className="text-lg">Total</h2>
        <p className="text-2xl font-bold">{stats.total}</p>
      </div>
      <div className="p-4 bg-yellow-500/30 rounded-lg text-center text-white">
        <h2 className="text-lg">En attente</h2>
        <p className="text-2xl font-bold">{stats.pending}</p>
      </div>
      <div className="p-4 bg-blue-500/30 rounded-lg text-center text-white">
        <h2 className="text-lg">En cours</h2>
        <p className="text-2xl font-bold">{stats.active}</p>
      </div>
      <div className="p-4 bg-green-500/30 rounded-lg text-center text-white">
        <h2 className="text-lg">Terminées</h2>
        <p className="text-2xl font-bold">{stats.completed}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
EOF

cat > src/features/dashboard/TodoFilters.jsx << 'EOF'
import React from "react";
import { Input, Button } from "../../components/ui";
import { TODO_STATUSES } from "../../constants/todoStatuses.js";

const TodoFilters = ({ filters, setFilters }) => {
  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Rechercher..."
        value={filters.searchTerm}
        onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
      />
      <Button
        onClick={() => setFilters({ ...filters, statusFilter: TODO_STATUSES.EN_COURS })}
      >
        En cours
      </Button>
      <Button
        onClick={() => setFilters({ ...filters, statusFilter: TODO_STATUSES.TERMINEE })}
      >
        Terminées
      </Button>
    </div>
  );
};

export default TodoFilters;
EOF

cat > src/features/dashboard/GridSettings.jsx << 'EOF'
import React from "react";
import { GRID_PRESETS } from "../../constants/gridPresets.js";
import { Button } from "../../components/ui";

const GridSettings = ({ gridConfig, onChange }) => {
  return (
    <div className="flex gap-2 mb-6">
      {GRID_PRESETS.map((preset) => (
        <Button
          key={preset.name}
          onClick={() => onChange(preset.cols, preset.rows)}
        >
          {preset.name}
        </Button>
      ))}
    </div>
  );
};

export default GridSettings;
EOF

cat > src/features/dashboard/TodoGrid.jsx << 'EOF'
import React from "react";

const TodoGrid = ({ todos, gridConfig }) => {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${gridConfig.cols}, minmax(0, 1fr))`,
      }}
    >
      {todos.map((todo) => (
        <div key={todo.id} className="p-4 bg-white/20 rounded-lg text-white">
          <h3 className="font-bold">{todo.titre || todo.title}</h3>
          <p className="text-sm">{todo.description}</p>
        </div>
      ))}
    </div>
  );
};

export default TodoGrid;
EOF

cat > src/features/dashboard/FloatingCreateButton.jsx << 'EOF'
import React from "react";
import { Plus } from "lucide-react";

const FloatingCreateButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 p-4 bg-purple-600 rounded-full shadow-lg text-white hover:bg-purple-700"
    >
      <Plus size={24} />
    </button>
  );
};

export default FloatingCreateButton;
EOF

# ----------------------------
# Constantes
# ----------------------------
cat > src/constants/todoStatuses.js << 'EOF'
export const TODO_STATUSES = {
  EN_ATTENTE: "EN_ATTENTE",
  EN_COURS: "EN_COURS",
  TERMINEE: "TERMINEE",
};
EOF

cat > src/constants/gridPresets.js << 'EOF'
export const GRID_PRESETS = [
  { name: "Compact", cols: 4, rows: 3 },
  { name: "Standard", cols: 3, rows: 2 },
  { name: "Large", cols: 2, rows: 2 },
  { name: "Liste", cols: 1, rows: 5 },
];
EOF

# ----------------------------
# Composants UI
# ----------------------------
cat > src/components/ui/Button.jsx << 'EOF'
import React from "react";

export const Button = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={"px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 " + className}
    >
      {children}
    </button>
  );
};
EOF

cat > src/components/ui/SafeModal.jsx << 'EOF'
import React from "react";

export const SafeModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6">
        {children}
        <button
          className="mt-4 px-4 py-2 rounded bg-gray-300"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </div>
  );
};
EOF

cat > src/components/ui/index.js << 'EOF'
export { Button } from "./Button.jsx";
export { SafeModal } from "./SafeModal.jsx";
EOF

# ----------------------------
# Page principale
# ----------------------------
cat > src/features/dashboard/ModernDashboard.jsx << 'EOF'
import React, { useState, useEffect, useMemo } from "react";
import { useUserContext } from "../../context/useUserContext.jsx";
import { useTodoContext } from "../../context/useTodoContext.jsx";
import { useNotifications } from "../../hooks/useNotifications.js";
import { useNavigate } from "react-router-dom";

import DashboardHeader from "./DashboardHeader.jsx";
import DashboardStats from "./DashboardStats.jsx";
import TodoFilters from "./TodoFilters.jsx";
import GridSettings from "./GridSettings.jsx";
import TodoGrid from "./TodoGrid.jsx";
import FloatingCreateButton from "./FloatingCreateButton.jsx";

import { TODO_STATUSES } from "../../constants/todoStatuses.js";

const ModernDashboard = () => {
  const { user, logout } = useUserContext();
  const { todos, fetchTodos } = useTodoContext();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ searchTerm: "", statusFilter: "" });
  const [gridConfig, setGridConfig] = useState({ cols: 3, rows: 2, itemsPerPage: 6 });

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const stats = useMemo(() => {
    const total = todos.length;
    const active = todos.filter(t => t.status === TODO_STATUSES.EN_COURS).length;
    const pending = todos.filter(t => t.status === TODO_STATUSES.EN_ATTENTE).length;
    const completed = todos.filter(t => t.status === TODO_STATUSES.TERMINEE).length;
    return { total, active, pending, completed };
  }, [todos]);

  const confirmLogout = () => {
    logout();
    addNotification("error", "Déconnexion réussie");
    navigate("/login", { replace: true });
  };

  const filteredTodos = todos.filter((t) => {
    if (filters.searchTerm && !t.titre.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.statusFilter && t.status !== filters.statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col h-screen p-4 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      <DashboardHeader user={user} onRefresh={fetchTodos} onLogout={confirmLogout} />
      <DashboardStats stats={stats} />
      <TodoFilters filters={filters} setFilters={setFilters} />
      <GridSettings
        gridConfig={gridConfig}
        onChange={(cols, rows) => setGridConfig({ cols, rows, itemsPerPage: cols * rows })}
      />
      <TodoGrid todos={filteredTodos} gridConfig={gridConfig} />
      <FloatingCreateButton onClick={() => console.log("ouvrir modal création")} />
    </div>
  );
};

export default ModernDashboard;
EOF

echo "✅ Dashboard complet créé dans src/features/dashboard !"
