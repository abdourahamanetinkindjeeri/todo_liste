import AuthContainer from "./components/AuthContainer";
import Dashboard from "./components/Dashboard";
import { UserProvider } from "./context/UserProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { useUserContext } from "./context/useUserContext";

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
