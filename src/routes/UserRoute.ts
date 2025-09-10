import { Router } from "express";
import UserController from "../controllers/UserController.js";
import hashPasswordMiddleware from "../middleware/hashPassword.js";

const router = Router();
const controller = new UserController();
router.post("/", hashPasswordMiddleware, controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
