"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSchemaUser = exports.CreateSchemaUser = void 0;
const zod_1 = __importDefault(require("zod"));
exports.CreateSchemaUser = zod_1.default.object({
    nom: zod_1.default
        .string()
        .min(2, "Le nom est requis et doit avoir au moins deux caractères"),
    prenom: zod_1.default
        .string()
        .min(2, "Le prénom doit avoir au moins deux caractères")
        .optional(),
    email: zod_1.default.string().email("L'email doit être valide"),
    password: zod_1.default
        .string()
        .min(6, "Le mot de passe est requis et doit avoir au moins 6 caractères"),
    role: zod_1.default.enum(["USER", "PROPRIETAIRE"]).optional(),
});
exports.UpdateSchemaUser = zod_1.default.object({
    id: zod_1.default.number().int().positive("L'id doit être un entier positif").optional(),
    nom: zod_1.default
        .string()
        .min(2, "Le nom doit avoir au moins deux caractères")
        .optional(),
    prenom: zod_1.default
        .string()
        .min(2, "Le prénom doit avoir au moins deux caractères")
        .optional(),
    email: zod_1.default.string().email("L'email doit être valide").optional(),
    role: zod_1.default.enum(["USER", "PROPRIETAIRE"]).optional(),
});
