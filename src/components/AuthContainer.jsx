import { useState } from "react";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

const AuthContainer = () => {
  const [currentView, setCurrentView] = useState("login"); // "login" ou "signup"

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
