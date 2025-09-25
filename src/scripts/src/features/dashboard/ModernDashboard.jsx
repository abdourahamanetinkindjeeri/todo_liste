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
