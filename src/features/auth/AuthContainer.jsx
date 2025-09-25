import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/useUserContext.jsx";
import LoginPage from "./LoginPage.jsx";
import SignupPage from "./SignupPage.jsx";

/**
 * Conteneur pour gérer l'authentification (login/signup)
 */
const AuthContainer = () => {
  const [currentView, setCurrentView] = useState("login");
  const { isAuthenticated } = useUserContext();
  const navigate = useNavigate();

  // Rediriger vers le dashboard si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const switchToLogin = () => {
    setCurrentView("login");
  };

  const switchToSignup = () => {
    setCurrentView("signup");
  };

  if (currentView === "signup") {
    return <SignupPage onSwitchToLogin={switchToLogin} />;
  }

  return <LoginPage onSwitchToSignup={switchToSignup} />;
};

export default AuthContainer;
