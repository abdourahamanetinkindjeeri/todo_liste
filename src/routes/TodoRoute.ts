import { Router } from "express";
import TodoController from "../controllers/TodoController";
import { configStorage } from "../middleware/uploadFile";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();
const controller = new TodoController();
const upload = configStorage();
router.post("/", authMiddleware, upload.single("photo"), controller.create);
router.get("/", authMiddleware, controller.findAll);
router.get("/non-acheve", authMiddleware, controller.findNotCompleted);
router.get("/status/:status", authMiddleware, controller.findByStatus);
router.put("/:id/terminee", authMiddleware, controller.marquerTerminer);
router.put("/:id/en-attente", authMiddleware, controller.marquerEnAttente);
router.put("/:id/en-cours", authMiddleware, controller.marquerEnCours);
router.put("/:id/complete", authMiddleware, controller.completeTodo);
router.get("/:id", controller.findById);
router.put("/:id", authMiddleware, controller.update);
router.put("/:id", authMiddleware, upload.single("photo"), controller.update);
router.post("/:id/delegate", authMiddleware, controller.delegate);
router.patch("/:id", authMiddleware, upload.single("photo"), controller.update);
router.delete("/:id", authMiddleware, controller.delete);
router.delete("/:id/delegate", authMiddleware, controller.removeDelegate);

export default router;
