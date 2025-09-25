import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserProvider.jsx";
import { ThemeProvider } from "./context/ThemeProvider.jsx";
import AppRoutes from "./routes.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
}
