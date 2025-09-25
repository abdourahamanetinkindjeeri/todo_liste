// import { Router } from "express";
// import TodoController from "../controllers/TodoController.js";
// import { configStorage } from "../middleware/uploadFile.js";
// import authMiddleware from "../middleware/authMiddleware.js";
// import { auditTodoAction } from "../middleware/auditTodo.js";
//
// const router = Router();
// const controller = new TodoController();
// // Route pour récupérer l'historique des Todo par userId
// const upload = configStorage();
//
// router.use(authMiddleware);
// router.get("/history/user/:userId", controller.getHistoryByUserId);
//
// router.post(
//   "/",
//   upload.single("photo"),
//   controller.create,
//   auditTodoAction("CREATION")
// );
// router.get("/", controller.findAll);
// router.get("/non-acheve", controller.findNotCompleted);
// router.get("/status/:status", controller.findByStatus);
//
// router.put(
//   "/:id/terminee",
//   auditTodoAction("MODIFICATION"),
//   controller.marquerTerminer
// );
// router.put(
//   "/:id/en-attente",
//   auditTodoAction("MODIFICATION"),
//   controller.marquerEnAttente
// );
// router.put(
//   "/:id/en-cours",
//   auditTodoAction("MODIFICATION"),
//   controller.marquerEnCours
// );
// router.put(
//   "/:id/complete",
//   auditTodoAction("MODIFICATION"),
//   controller.completeTodo
// );
//
// router.get("/:id", controller.findById);
// router.get("/:id/history", controller.getHistory);
//
// router.put(
//   "/:id",
//   upload.single("photo"),
//   controller.update,
//   auditTodoAction("MODIFICATION")
// );
// router.patch(
//   "/:id",
//   upload.single("photo"),
//   controller.update,
//   auditTodoAction("MODIFICATION")
// );
//
// router.post(
//   "/:id/delegate",
//   controller.delegate,
//   auditTodoAction("DELEGATION")
// );
// router.delete("/:id", controller.delete, auditTodoAction("SUPPRESSION"));
// router.delete("/:id/delegate", controller.removeDelegate);
//
// export default router;

import { Router, Request, Response } from "express";
import TodoController from "../controllers/TodoController.js";
import { configStorage } from "../middleware/uploadFile.js";
import {
  multiUpload,
  handlePhotoUpload,
  multerErrorHandler,
} from "../middleware/multiUpload.js";
// import { debugMiddleware } from "../middleware/debugMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { auditTodoAction } from "../middleware/auditTodo.js";

import cloudinaryUpload from "./../middleware/upload.js"; // Upload Cloudinary (vocaux)
import cloudinary from "../config/cloudinary";

// Type custom pour Cloudinary/Multer
interface CloudinaryFile extends Express.Multer.File {
  path: string; // URL Cloudinary
  filename: string; // public_id
}

const router = Router();
const controller = new TodoController();

// Upload local pour photos (par ex. avec multer.diskStorage)
const photoUpload = configStorage();

router.use(authMiddleware);

// Historique
router.get("/history/user/:userId", controller.getHistoryByUserId);

// CRUD Todo avec upload photo et vocal
router.post(
  "/",
  multiUpload,
  multerErrorHandler,
  handlePhotoUpload,
  controller.create,
  auditTodoAction("CREATION")
);
router.get("/", controller.findAll);
router.get("/non-acheve", controller.findNotCompleted);
router.get("/status/:status", controller.findByStatus);

router.put(
  "/:id/terminee",
  auditTodoAction("MODIFICATION"),
  controller.marquerTerminer
);
router.put(
  "/:id/en-attente",
  auditTodoAction("MODIFICATION"),
  controller.marquerEnAttente
);
router.put(
  "/:id/en-cours",
  auditTodoAction("MODIFICATION"),
  controller.marquerEnCours
);
router.put(
  "/:id/complete",
  auditTodoAction("MODIFICATION"),
  controller.completeTodo
);

router.get("/:id", controller.findById);
router.get("/:id/history", controller.getHistory);

router.put(
  "/:id",
  multiUpload,
  handlePhotoUpload,
  controller.update,
  auditTodoAction("MODIFICATION")
);
router.patch(
  "/:id",
  multiUpload,
  handlePhotoUpload,
  controller.update,
  auditTodoAction("MODIFICATION")
);
router.post(
  "/:id/delegate",
  controller.delegate,
  auditTodoAction("DELEGATION")
);
router.delete("/:id", controller.delete, auditTodoAction("SUPPRESSION"));
router.delete("/:id/delegate", controller.removeDelegate);

// ✅ Upload de vocaux (max 30s) avec Cloudinary
router.post(
  "/audio",
  cloudinaryUpload.single("file"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Aucun fichier reçu" });
      }

      const file = req.file as CloudinaryFile;

      // Vérification via Cloudinary (audio = video)
      const result = await cloudinary.api.resource(file.filename, {
        resource_type: "video",
      });

      if (result.duration && result.duration > 30) {
        await cloudinary.uploader.destroy(file.filename, {
          resource_type: "video",
        });
        return res
          .status(400)
          .json({ error: "La durée du vocal dépasse 30 secondes" });
      }

      return res.json({
        url: file.path,
        public_id: file.filename,
        duration: result.duration,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
