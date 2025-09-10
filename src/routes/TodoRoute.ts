import { Router } from "express";
import TodoController from "../controllers/TodoController.js";
import { configStorage } from "../middleware/uploadFile.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();
const controller = new TodoController();
const upload = configStorage();

router.use(authMiddleware);

router.post("/", upload.single("photo"), controller.create);
router.get("/", controller.findAll);
router.get("/non-acheve", controller.findNotCompleted);
router.get("/status/:status", controller.findByStatus);

router.put("/:id/terminee", controller.marquerTerminer);
router.put("/:id/en-attente", controller.marquerEnAttente);
router.put("/:id/en-cours", controller.marquerEnCours);
router.put("/:id/complete", controller.completeTodo);

router.get("/:id", controller.findById);
router.put("/:id", upload.single("photo"), controller.update);
router.post("/:id/delegate", controller.delegate);
router.patch("/:id", upload.single("photo"), controller.update);

router.delete("/:id", controller.delete);
router.delete("/:id/delegate", controller.removeDelegate);

export default router;
