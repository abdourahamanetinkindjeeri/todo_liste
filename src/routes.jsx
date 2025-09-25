import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContainer } from "./features/auth/index.js";
import { useUserContext } from "./context/useUserContext.jsx";
import Dashboard from "./features/dashboard/Dashboard.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useUserContext();

  // Si pas authentifié OU pas d'utilisateur, rediriger vers login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function HomeRoute() {
  const { isAuthenticated } = useUserContext();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
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
      <Route path="/" element={<HomeRoute />} />
      <Route path="*" element={<HomeRoute />} />
    </Routes>
  );
}
