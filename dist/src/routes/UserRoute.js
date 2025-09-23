"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_js_1 = __importDefault(require("../controllers/UserController.js"));
const hashPassword_js_1 = __importDefault(require("../middleware/hashPassword.js"));
const router = (0, express_1.Router)();
const controller = new UserController_js_1.default();
router.post("/", hashPassword_js_1.default, controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);
exports.default = router;
