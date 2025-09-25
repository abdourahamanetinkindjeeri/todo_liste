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
