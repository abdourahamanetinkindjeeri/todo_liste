"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TodoController_js_1 = __importDefault(require("../controllers/TodoController.js"));
const uploadFile_js_1 = require("../middleware/uploadFile.js");
const authMiddleware_js_1 = __importDefault(require("../middleware/authMiddleware.js"));
const auditTodo_js_1 = require("../middleware/auditTodo.js");
const taskDurationMiddleware_js_1 = require("../middleware/taskDurationMiddleware.js");
const multiUpload_js_1 = require("../middleware/multiUpload.js");
const router = (0, express_1.Router)();
const controller = new TodoController_js_1.default();
const upload = (0, uploadFile_js_1.configStorage)();
router.use(authMiddleware_js_1.default);
router.get("/history/user/:userId", controller.getHistoryByUserId);
// CRUD Todo avec upload photo et vocal
router.post("/", multiUpload_js_1.multiUpload, multiUpload_js_1.multerErrorHandler, multiUpload_js_1.handlePhotoUpload, controller.create, (0, auditTodo_js_1.auditTodoAction)("CREATION"));
router.get("/", controller.findAll);
router.get("/non-acheve", controller.findNotCompleted);
router.get("/status/:status", controller.findByStatus);
router.get("/:id/progression", taskDurationMiddleware_js_1.taskProgressMiddleware, (req, res) => {
    res.json({ progression: res.locals.progression });
});
router.put("/:id/terminee", (0, auditTodo_js_1.auditTodoAction)("MODIFICATION"), controller.marquerTerminer);
router.put("/:id/en-attente", (0, auditTodo_js_1.auditTodoAction)("MODIFICATION"), controller.marquerEnAttente);
router.put("/:id/en-cours", (0, auditTodo_js_1.auditTodoAction)("MODIFICATION"), controller.marquerEnCours);
router.put("/:id/complete", (0, auditTodo_js_1.auditTodoAction)("MODIFICATION"), controller.completeTodo);
router.get("/:id", controller.findById);
router.get("/:id/history", controller.getHistory);
router.put("/:id", multiUpload_js_1.multiUpload, multiUpload_js_1.handlePhotoUpload, controller.update, (0, auditTodo_js_1.auditTodoAction)("MODIFICATION"));
router.patch("/:id", multiUpload_js_1.multiUpload, multiUpload_js_1.handlePhotoUpload, controller.update, (0, auditTodo_js_1.auditTodoAction)("MODIFICATION"));
router.put("/:id/delegate", controller.delegate, (0, auditTodo_js_1.auditTodoAction)("DELEGATION"));
// Marque lu
router.put("/:userId/readAll", controller.readAllNotifications);
exports.default = router;
