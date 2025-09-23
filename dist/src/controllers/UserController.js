"use strict";
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
const UserService_js_1 = __importDefault(require("../services/UserService.js"));
const UserValidator_js_1 = require("../validators/UserValidator.js");
class UserController {
    constructor() {
        this.service = new UserService_js_1.default();
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = UserValidator_js_1.CreateSchemaUser.parse(req.body);
                const user = yield this.service.create(data);
                res.status(201).json({ message: "User ajoutée avec succès.", user });
            }
            catch (err) {
                if (err instanceof Error &&
                    err.message === "Un utilisateur avec cet email existe déjà") {
                    return res.status(409).json({
                        success: false,
                        message: `Un utilisateur avec cet email existe déjà`,
                    });
                }
                next(err);
            }
        });
        this.findAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.service.findAll();
                res
                    .status(200)
                    .json({ message: "Recuperation reussi avec succes", data: users });
            }
            catch (error) {
                next(error);
            }
        });
        this.findById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield this.service.findById(+id);
                if (!user)
                    res.status(404).json({ message: "Tache introuvable..." });
                res.status(200).json({ message: "Tache trouve...", data: user });
            }
            catch (error) {
                next(error);
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const data = UserValidator_js_1.UpdateSchemaUser.parse(req.body);
                if (!data)
                    res.status(203).json({ message: "Tache mal formee..." });
                const todo = yield this.service.update(+id, data);
                if (!todo)
                    res.status(404).json({ message: "Tache introuvable..." });
                res.status(200).json({ message: "Tache trouve...", data: todo });
            }
            catch (error) {
                next(error);
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.service.delete(+id);
                res.status(200).json({ message: "Tache supprimée avec succès." });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = UserController;
