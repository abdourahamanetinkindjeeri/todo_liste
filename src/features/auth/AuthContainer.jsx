import { useState } from "react";
import LoginPage from "./LoginPage.jsx";
import SignupPage from "./SignupPage.jsx";

/**
 * Conteneur pour gérer l'authentification (login/signup)
 */
const AuthContainer = () => {
  const [currentView, setCurrentView] = useState("login");

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