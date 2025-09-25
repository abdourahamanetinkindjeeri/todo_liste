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
