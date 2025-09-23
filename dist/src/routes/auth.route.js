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
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login_js_1 = require("../services/login.js");
const dotenv_1 = __importDefault(require("dotenv"));
const router = (0, express_1.Router)();
dotenv_1.default.config();
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield (0, login_js_1.login)(email, password);
    if (!user)
        return res.status(401).json({ error: "Identifiants invalides" });
    const accessPayload = {
        id: user.id,
        email: user.email,
        prenom: user === null || user === void 0 ? void 0 : user.email,
        nom: user.prenom,
        role: user.role,
    };
    const refreshPayload = {
        email: user.email,
    };
    const accessToken = jsonwebtoken_1.default.sign(accessPayload, process.env.JWT_ACCESS_SECRET, {
        algorithm: "HS512",
        expiresIn: "30m",
    });
    const refreshToken = jsonwebtoken_1.default.sign(refreshPayload, process.env.JWT_REFRESH_SECRET, {
        algorithm: "HS512",
        expiresIn: "7d",
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
}));
router.post("/refresh", (req, res) => {
    var _a;
    const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
    if (!refreshToken)
        return res.status(400).json({ error: "Token manquant" });
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = jsonwebtoken_1.default.sign({ email: payload.email }, process.env.JWT_ACCESS_SECRET, {
            algorithm: "HS512",
            expiresIn: "15m",
        });
        res.status(200).json({ accessToken: newAccessToken });
    }
    catch (err) {
        res.status(401).json({ error: "Refresh token invalide" });
    }
});
exports.default = router;
