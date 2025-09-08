import { Router } from "express";
import TodoController from "../controllers/TodoController";

const router = Router();
const controller = new TodoController();
router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/non-acheve", controller.findNotCompleted);
router.get("/status/:status", controller.findByStatus);
router.put("/:id/terminee", controller.marquerTerminer);
router.put("/:id/en-attente", controller.marquerEnAttente);
router.put("/:id/en-cours", controller.marquerEnCours);
router.put("/:id/complete", controller.completeTodo);
router.get("/:id", controller.findById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
