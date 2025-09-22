import { AuthContainer } from "./features/auth/index.js";
import { Dashboard } from "./features/dashboard/index.js";
import { UserProvider } from "./context/UserProvider.jsx";
import { ThemeProvider } from "./context/ThemeProvider.jsx";
import { useUserContext } from "./context/useUserContext.jsx";

function AppContent() {
  const { isAuthenticated } = useUserContext();

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return <AuthContainer />;
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  );
}
