import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContainer } from "./features/auth/index.js";
import { Dashboard } from "./features/dashboard/index.js";
import { useUserContext } from "./context/useUserContext.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useUserContext();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthContainer />} />
      <Route path="/signup" element={<AuthContainer />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
