import { Router } from "express";
import TodoController from "../controllers/TodoController.js";
import { configStorage } from "../middleware/uploadFile.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { auditTodoAction } from "../middleware/auditTodo.js";
import { taskProgressMiddleware } from "../middleware/taskDurationMiddleware.js";
import {
  handlePhotoUpload,
  multerErrorHandler,
  multiUpload,
} from "../middleware/multiUpload.js";

const router = Router();
const controller = new TodoController();
const upload = configStorage();

router.use(authMiddleware);
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

router.get("/:id/progression", taskProgressMiddleware, (req, res) => {
  res.json({ progression: res.locals.progression });
});

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

router.put("/:id/delegate", controller.delegate, auditTodoAction("DELEGATION"));
// Marque lu
router.put("/:userId/readAll", controller.readAllNotifications);
export default router;
