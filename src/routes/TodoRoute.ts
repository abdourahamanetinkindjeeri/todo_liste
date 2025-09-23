import { Router } from "express";
import TodoController from "../controllers/TodoController.js";
import { configStorage } from "../middleware/uploadFile.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { auditTodoAction } from "../middleware/auditTodo.js";

const router = Router();
const controller = new TodoController();
// Route pour récupérer l'historique des Todo par userId
const upload = configStorage();
router.get("/history/user/:userId", controller.getHistoryByUserId);

router.use(authMiddleware);

router.post(
  "/",
  upload.single("photo"),
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
  upload.single("photo"),
  controller.update,
  auditTodoAction("MODIFICATION")
);
router.patch(
  "/:id",
  upload.single("photo"),
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

export default router;
