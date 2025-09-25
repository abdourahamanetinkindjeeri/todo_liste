import multer from "multer";
import { configStorage } from "./uploadFile.js";
import fs from "fs";
import path from "path";

// Configuration pour les uploads multiples (photo + vocal en mémoire)
export const multiUpload = multer({
  storage: multer.memoryStorage(), // Utilise la mémoire pour gérer les deux types
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "photo") {
      // Vérification pour les photos
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Seules les images sont acceptées pour le champ photo"));
      }
    } else if (file.fieldname === "vocal") {
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
      if (
        file.mimetype.startsWith("audio/") ||
        allowedMimes.includes(file.mimetype)
      ) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "Format audio non supporté. Formats acceptés: MP3, WAV, OGG, M4A, MP4"
          )
        );
      }
    } else {
      cb(
        new Error("Champ de fichier non reconnu. Champs acceptés: photo, vocal")
      );
    }
  },
}).fields([
  { name: "photo", maxCount: 1 },
  { name: "vocal", maxCount: 1 },
]);

// Middleware pour capturer les erreurs multer
export const multerErrorHandler = (err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    console.error("Erreur Multer:", err.message, err.code);
    return res.status(400).json({
      error: `Erreur upload: ${err.message}`,
      code: err.code,
    });
  } else if (err) {
    console.error("Erreur middleware upload:", err.message);
    return res.status(400).json({
      error: `Erreur: ${err.message}`,
    });
  }
  next();
};

// Middleware pour gérer l'upload de photo en local
export const handlePhotoUpload = (req: any, res: any, next: any) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Gestion de la photo (upload local)
    if (files?.photo?.[0]) {
      const photoFile = files.photo[0];
      const filename = Date.now() + "_" + photoFile.originalname;

      // S'assurer que le dossier existe
      const uploadDir = "./public/data/uploads/";
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uploadPath = path.join(uploadDir, filename);
      fs.writeFileSync(uploadPath, photoFile.buffer);

      // Ajouter les infos de la photo à req.file (pour compatibilité)
      req.file = {
        ...photoFile,
        filename,
        path: uploadPath,
      };
    }
    next();
  } catch (error) {
    console.error("Erreur upload photo:", error);
    res.status(500).json({ error: "Erreur lors de l'upload de la photo" });
  }
};

// Configuration pour photo uniquement (compatibilité)
export const photoUpload = configStorage();
