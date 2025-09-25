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
