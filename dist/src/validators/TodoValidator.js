"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSchemaTodo = exports.CreateSchemaTodo = void 0;
const zod_1 = __importDefault(require("zod"));
exports.CreateSchemaTodo = zod_1.default.object({
    libelle: zod_1.default
        .string()
        .min(4, "Le libelle est requis et doit avoir au moins quatre (4) caractères"),
    description: zod_1.default.string().optional(),
    estAcheve: zod_1.default.boolean().optional(),
});
exports.UpdateSchemaTodo = zod_1.default.object({
    id: zod_1.default.number().int().positive("L'id doit être un entier positif").optional(),
    libelle: zod_1.default
        .string()
        .min(4, "Le libelle doit avoir au moins quatre (4) caractères")
        .optional(),
    description: zod_1.default.string().optional(),
    estAcheve: zod_1.default.boolean().optional(),
});
