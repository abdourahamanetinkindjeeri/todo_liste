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
