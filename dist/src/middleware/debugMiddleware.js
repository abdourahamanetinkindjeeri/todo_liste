"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugMiddleware = void 0;
// Middleware de débogage pour voir les détails de la requête
const debugMiddleware = (req, res, next) => {
    console.log("=== DEBUG REQUÊTE ===");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Headers:", Object.keys(req.headers));
    console.log("Body keys:", req.body ? Object.keys(req.body) : "No body");
    // Vérifier si c'est bien du multipart
    const contentType = req.headers["content-type"];
    if (contentType && contentType.includes("multipart/form-data")) {
        console.log("✅ Requête multipart détectée");
    }
    else {
        console.log("❌ Pas de multipart/form-data détecté");
    }
    console.log("=== FIN DEBUG REQUÊTE ===");
    next();
};
exports.debugMiddleware = debugMiddleware;
