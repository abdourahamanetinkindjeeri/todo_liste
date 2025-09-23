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
exports.default = hashPasswordMiddleware;
const bcrypt_1 = __importDefault(require("bcrypt"));
function hashPassword(password_1) {
    return __awaiter(this, arguments, void 0, function* (password, longueurHash = 10) {
        return yield bcrypt_1.default.hash(password, longueurHash);
    });
}
function hashPasswordMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { password } = req.body;
            if (!password) {
                return res.status(400).json({ error: "Mot de passe requis" });
            }
            const hashedPassword = yield hashPassword(password);
            req.body.password = hashedPassword;
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
