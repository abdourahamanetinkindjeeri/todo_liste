import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import {
  decodeJWT,
  isTokenExpired,
  setToken,
  getToken,
  removeToken,
} from "../utils/tokenUtils";
import { AUTH_ERROR_MESSAGES } from "../constants/errorMessages.js";

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier le token au chargement de l'application
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getToken();
        if (token && !isTokenExpired(token)) {
          const userInfo = decodeJWT(token);
          if (userInfo) {
            setUser(userInfo);
            setAccessToken(token);
            setIsAuthenticated(true);
          } else {
            removeToken();
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors de l'initialisation de l'authentification:",
          error
        );
        removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8888/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const responseData = await response.json();

        // Extraire le token de la réponse
        const token =
          responseData.accessToken ||
          responseData.token ||
          responseData.access_token;

        if (token) {
          // Stocker le token
          setToken(token);
          setAccessToken(token);

          // Décoder le token pour obtenir les informations utilisateur
          const userInfo = decodeJWT(token);
          if (userInfo) {
            setUser(userInfo);
            setIsAuthenticated(true);
            return { success: true, user: userInfo };
          } else {
            // Si on ne peut pas décoder le token, utiliser les données de la réponse
            setUser(responseData);
            setIsAuthenticated(true);
            return { success: true, user: responseData };
          }
        } else {
          setUser(responseData);
          setIsAuthenticated(true);
          return { success: true, user: responseData };
        }
      } else {
        const errorData = await response.json();

        // Gestion spécifique des erreurs d'authentification
        let errorMessage = AUTH_ERROR_MESSAGES.LOGIN_FAILED;

        if (response.status === 401) {
          // Erreur d'authentification - analyser le message du serveur
          const serverMessage = errorData.message || "";

          if (
            serverMessage.toLowerCase().includes("email") ||
            serverMessage.toLowerCase().includes("utilisateur") ||
            serverMessage.toLowerCase().includes("user") ||
            serverMessage.toLowerCase().includes("not found") ||
            serverMessage.toLowerCase().includes("introuvable")
          ) {
            errorMessage = AUTH_ERROR_MESSAGES.EMAIL_NOT_FOUND;
          } else if (
            serverMessage.toLowerCase().includes("password") ||
            serverMessage.toLowerCase().includes("mot de passe") ||
            serverMessage.toLowerCase().includes("incorrect") ||
            serverMessage.toLowerCase().includes("invalid")
          ) {
            errorMessage = AUTH_ERROR_MESSAGES.PASSWORD_INCORRECT;
          } else {
            // Message générique pour les erreurs 401 non spécifiques
            errorMessage = AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
          }
        } else if (response.status === 404) {
          errorMessage = AUTH_ERROR_MESSAGES.EMAIL_NOT_FOUND;
        } else if (response.status === 400) {
          errorMessage = AUTH_ERROR_MESSAGES.INVALID_DATA;
        } else if (response.status >= 500) {
          errorMessage = AUTH_ERROR_MESSAGES.SERVER_ERROR;
        } else {
          // Utiliser le message du serveur s'il est disponible, sinon message générique
          errorMessage =
            errorData.message || AUTH_ERROR_MESSAGES.UNEXPECTED_ERROR;
        }

        return {
          success: false,
          error: errorMessage,
        };
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);

      // Gestion des erreurs réseau
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        return {
          success: false,
          error: AUTH_ERROR_MESSAGES.NETWORK_ERROR,
        };
      }

      return {
        success: false,
        error: AUTH_ERROR_MESSAGES.NETWORK_RETRY,
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await fetch("http://localhost:8888/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const responseData = await response.json();
        return { success: true, data: responseData };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || "Erreur lors de l'inscription",
        };
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      return { success: false, message: "Erreur de réseau" };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setAccessToken(null);
    removeToken();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-green-200 rounded-full border-t-green-600 animate-spin"></div>
          <p className="text-gray-600 animate-pulse">Initialisation...</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        accessToken,
        login,
        signup,
        logout,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
