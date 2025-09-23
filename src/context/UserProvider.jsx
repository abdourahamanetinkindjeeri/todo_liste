import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import {
  decodeJWT,
  isTokenExpired,
  setToken,
  getToken,
  removeToken,
} from "../utils/tokenUtils";

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier le token au chargement de l'application
  useEffect(() => {
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
    setIsLoading(false);
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
        return {
          success: false,
          error: errorData.message || "Erreur de connexion",
        };
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      return { success: false, error: "Erreur de réseau" };
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 border-blue-600 rounded-full animate-spin"></div>
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
