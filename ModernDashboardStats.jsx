import React from "react";
import { TrendingUp, Clock, AlertCircle, CheckCircle } from "lucide-react";

const ModernDashboardStats = ({ stats }) => (
  <section className="grid flex-shrink-0 grid-cols-2 gap-4 mb-4 md:grid-cols-4">
    {[
      { label: "Total Tâches", value: stats.total, icon: <TrendingUp className="text-white/60" size={24} /> },
      { label: "En Cours", value: stats.active, icon: <Clock className="text-blue-300" size={24} /> },
      { label: "En Attente", value: stats.pending, icon: <AlertCircle className="text-orange-300" size={24} /> },
      { label: "Terminées", value: stats.completed, icon: <CheckCircle className="text-green-300" size={24} /> }
    ].map(({ label, value, icon }) => (
      <div
        key={label}
        className="p-4 transition-all duration-300 border bg-white/15 backdrop-blur-md rounded-xl border-white/20 hover:bg-white/20 hover:transform hover:scale-105"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 text-2xl font-bold text-white">{value}</div>
            <div className="text-xs tracking-wide uppercase text-white/75">{label}</div>
          </div>
          {icon}
        </div>
      </div>
    ))}
  </section>
);

export default ModernDashboardStats;
