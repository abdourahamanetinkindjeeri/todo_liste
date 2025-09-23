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
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditTodoAction = auditTodoAction;
const TodoHistoryRepository_js_1 = require("../repositories/TodoHistoryRepository.js");
/**
 * Middleware d'audit pour enregistrer les actions sur les tâches.
 * Utilisation : placer ce middleware sur les routes qui modifient les tâches (create, update, delete, delegate, etc.)
 * Il attend que le contrôleur ait terminé (post-handler).
 */
function auditTodoAction(action) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        // On suppose que le contrôleur place l'ID de la tâche dans res.locals.todoId
        // et que l'utilisateur est authentifié (req.userId)
        const todoId = res.locals.todoId;
        const userId = req.userId;
        if (!todoId || !userId)
            return next();
        let description = "";
        switch (action) {
            case "CREATION":
                description = `Tâche créée par l'utilisateur ${userId}`;
                break;
            case "MODIFICATION":
                description = `Tâche modifiée par l'utilisateur ${userId}`;
                break;
            case "SUPPRESSION":
                description = `Tâche supprimée par l'utilisateur ${userId}`;
                break;
            case "DELEGATION":
                description = `Tâche déléguée à l'utilisateur ${req.body.userId} par ${userId}`;
                break;
            default:
                description = `Action ${action} sur la tâche par l'utilisateur ${userId}`;
        }
        yield TodoHistoryRepository_js_1.TodoHistoryRepository.log({
            todoId,
            userId,
            action,
            description,
        });
        next();
    });
}
