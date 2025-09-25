"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TodoController_js_1 = __importDefault(require("../controllers/TodoController.js"));
const uploadFile_js_1 = require("../middleware/uploadFile.js");
const multiUpload_js_1 = require("../middleware/multiUpload.js");
// import { debugMiddleware } from "../middleware/debugMiddleware.js";
const authMiddleware_js_1 = __importDefault(require("../middleware/authMiddleware.js"));
const auditTodo_js_1 = require("../middleware/auditTodo.js");
const upload_js_1 = __importDefault(require("./../middleware/upload.js")); // Upload Cloudinary (vocaux)
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const router = (0, express_1.Router)();
const controller = new TodoController_js_1.default();
// Upload local pour photos (par ex. avec multer.diskStorage)
const photoUpload = (0, uploadFile_js_1.configStorage)();
router.use(authMiddleware_js_1.default);
// Historique
router.get("/history/user/:userId", controller.getHistoryByUserId);
// CRUD Todo avec upload photo et vocal
router.post("/", multiUpload_js_1.multiUpload, multiUpload_js_1.multerErrorHandler, multiUpload_js_1.handlePhotoUpload, controller.create, (0, auditTodo_js_1.auditTodoAction)("CREATION"));
router.get("/", controller.findAll);
router.get("/non-acheve", controller.findNotCompleted);
router.get("/status/:status", controller.findByStatus);
router.put("/:id/terminee", (0, auditTodo_js_1.auditTodoAction)("MODIFICATION"), controller.marquerTerminer);
router.put("/:id/en-attente", (0, auditTodo_js_1.auditTodoAction)("MODIFICATION"), controller.marquerEnAttente);
router.put("/:id/en-cours", (0, auditTodo_js_1.auditTodoAction)("MODIFICATION"), controller.marquerEnCours);
router.put("/:id/complete", (0, auditTodo_js_1.auditTodoAction)("MODIFICATION"), controller.completeTodo);
router.get("/:id", controller.findById);
router.get("/:id/history", controller.getHistory);
router.put("/:id", multiUpload_js_1.multiUpload, multiUpload_js_1.handlePhotoUpload, controller.update, (0, auditTodo_js_1.auditTodoAction)("MODIFICATION"));
router.patch("/:id", multiUpload_js_1.multiUpload, multiUpload_js_1.handlePhotoUpload, controller.update, (0, auditTodo_js_1.auditTodoAction)("MODIFICATION"));
router.post("/:id/delegate", controller.delegate, (0, auditTodo_js_1.auditTodoAction)("DELEGATION"));
router.delete("/:id", controller.delete, (0, auditTodo_js_1.auditTodoAction)("SUPPRESSION"));
router.delete("/:id/delegate", controller.removeDelegate);
// ✅ Upload de vocaux (max 30s) avec Cloudinary
router.post("/audio", upload_js_1.default.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Aucun fichier reçu" });
        }
        const file = req.file;
        // Vérification via Cloudinary (audio = video)
        const result = yield cloudinary_1.default.api.resource(file.filename, {
            resource_type: "video",
        });
        if (result.duration && result.duration > 30) {
            yield cloudinary_1.default.uploader.destroy(file.filename, {
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
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
exports.default = router;
