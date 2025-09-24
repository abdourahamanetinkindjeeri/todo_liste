import React from "react";
import { Button } from "../../components/ui/index.js";
import { RefreshCw, LogOut } from "lucide-react";

const ModernDashboardHeader = ({ user, onRefresh, onLogout, isLoading }) => (
  <header className="flex items-center justify-between flex-shrink-0 mb-4">
    <div>
      <h1 className="mb-1 text-3xl font-bold text-white">Dashboard</h1>
      <p className="text-sm text-white/75">
        Bienvenue, {user?.prenom || user?.name || "Utilisateur"}
      </p>
    </div>
    <div className="flex gap-3">
      <Button
        onClick={onRefresh}
        variant="ghost"
        className="px-3 py-2 text-white border-white/30 hover:bg-white/10"
        disabled={isLoading}
      >
        <RefreshCw size={14} className={`mr-1 ${isLoading ? "animate-spin" : ""}`} />
        Actualiser
      </Button>

      <Button
        onClick={onLogout}
        variant="ghost"
        className="px-3 py-2 text-white border-red-400/30 hover:bg-red-500/10"
      >
        <LogOut size={14} className="mr-1" />
        Déconnexion
      </Button>
    </div>
  </header>
);

export default ModernDashboardHeader;
