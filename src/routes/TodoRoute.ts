import { Router } from "express";
import TodoController from "../controllers/TodoController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();
const controller = new TodoController();
router.post("/", authMiddleware, controller.create);
router.get("/", authMiddleware, controller.findAll);
router.get("/non-acheve", authMiddleware, controller.findNotCompleted);
router.get("/status/:status", authMiddleware, controller.findByStatus);
router.put("/:id/terminee", authMiddleware, controller.marquerTerminer);
router.put("/:id/en-attente", authMiddleware, controller.marquerEnAttente);
router.put("/:id/en-cours", authMiddleware, controller.marquerEnCours);
router.put("/:id/complete", authMiddleware, controller.completeTodo);
router.get("/:id", controller.findById);
router.put("/:id", authMiddleware, controller.update);
router.delete("/:id", authMiddleware, controller.delete);

export default router;
