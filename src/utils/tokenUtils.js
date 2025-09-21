/**
 * Décode un token JWT et retourne le payload
 * @param {string} token - Le token JWT à décoder
 * @returns {object|null} - Le payload décodé ou null si erreur
 */
export const decodeJWT = (token) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Token JWT invalide");

    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");

    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Erreur lors du décodage du token:", error);
    return null;
  }
};

/**
 * Vérifie si un token JWT est expiré
 * @param {string} token - Le token JWT à vérifier
 * @returns {boolean} - true si le token est expiré
 */
export const isTokenExpired = (token) => {
  const payload = decodeJWT(token);
  if (!payload?.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * Stocke le token dans un cookie sécurisé (maxAge en secondes)
 * @param {string} token - Le token à stocker
 * @param {number} maxAge - Durée de vie du cookie en secondes (ex: exp - now)
 */
export const setToken = (token, maxAge = 3600) => {
  document.cookie = `accessToken=${token}; Max-Age=${maxAge}; Secure; SameSite=Strict; Path=/`;
};

/**
 * Récupère le token depuis les cookies
 * @returns {string|null} - Le token ou null s'il n'existe pas
 */
export const getToken = () => {
  const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key] = value;
    return acc;
  }, {});
  return cookies.accessToken || null;
};

/**
 * Supprime le token du cookie
 */
export const removeToken = () => {
  document.cookie = "accessToken=; Max-Age=0; Path=/; Secure; SameSite=Strict";
};
