"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.photoUpload = exports.handlePhotoUpload = exports.multerErrorHandler = exports.multiUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const uploadFile_js_1 = require("./uploadFile.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Configuration pour les uploads multiples (photo + vocal en mémoire)
exports.multiUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(), // Utilise la mémoire pour gérer les deux types
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === "photo") {
            // Vérification pour les photos
            if (file.mimetype.startsWith("image/")) {
                cb(null, true);
            }
            else {
                cb(new Error("Seules les images sont acceptées pour le champ photo"));
            }
        }
        else if (file.fieldname === "vocal") {
            // Vérification pour les vocaux (formats étendus)
            const allowedMimes = [
                "audio/mpeg",
                "audio/mp3",
                "audio/wav",
                "audio/ogg",
                "audio/webm",
                "audio/m4a",
                "video/mp4",
            ];
            if (file.mimetype.startsWith("audio/") ||
                allowedMimes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new Error("Format audio non supporté. Formats acceptés: MP3, WAV, OGG, M4A, MP4"));
            }
        }
        else {
            cb(new Error("Champ de fichier non reconnu. Champs acceptés: photo, vocal"));
        }
    },
}).fields([
    { name: "photo", maxCount: 1 },
    { name: "vocal", maxCount: 1 },
]);
// Middleware pour capturer les erreurs multer
const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        console.error("Erreur Multer:", err.message, err.code);
        return res.status(400).json({
            error: `Erreur upload: ${err.message}`,
            code: err.code,
        });
    }
    else if (err) {
        console.error("Erreur middleware upload:", err.message);
        return res.status(400).json({
            error: `Erreur: ${err.message}`,
        });
    }
    next();
};
exports.multerErrorHandler = multerErrorHandler;
// Middleware pour gérer l'upload de photo en local
const handlePhotoUpload = (req, res, next) => {
    var _a;
    try {
        const files = req.files;
        // Gestion de la photo (upload local)
        if ((_a = files === null || files === void 0 ? void 0 : files.photo) === null || _a === void 0 ? void 0 : _a[0]) {
            const photoFile = files.photo[0];
            const filename = Date.now() + "_" + photoFile.originalname;
            // S'assurer que le dossier existe
            const uploadDir = "./public/data/uploads/";
            if (!fs_1.default.existsSync(uploadDir)) {
                fs_1.default.mkdirSync(uploadDir, { recursive: true });
            }
            const uploadPath = path_1.default.join(uploadDir, filename);
            fs_1.default.writeFileSync(uploadPath, photoFile.buffer);
            // Ajouter les infos de la photo à req.file (pour compatibilité)
            req.file = Object.assign(Object.assign({}, photoFile), { filename, path: uploadPath });
        }
        next();
    }
    catch (error) {
        console.error("Erreur upload photo:", error);
        res.status(500).json({ error: "Erreur lors de l'upload de la photo" });
    }
};
exports.handlePhotoUpload = handlePhotoUpload;
// Configuration pour photo uniquement (compatibilité)
exports.photoUpload = (0, uploadFile_js_1.configStorage)();
