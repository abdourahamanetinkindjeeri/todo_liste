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
exports.TodoHistoryRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class TodoHistoryRepository {
    static getHistoryByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.todoHistory.findMany({
                where: { userId },
                orderBy: { createdAt: "asc" },
                include: { user: true },
            });
        });
    }
    // Marquer toutes les notifications non lues comme lues pour un utilisateur
    static markAllAsReadForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.todoHistory.updateMany({
                where: { userId, estLu: false },
                data: { estLu: true },
            });
        });
    }
    static log(_a) {
        return __awaiter(this, arguments, void 0, function* ({ todoId, userId, action, description, }) {
            return prisma.todoHistory.create({
                data: {
                    todoId,
                    userId,
                    action,
                    description,
                },
            });
        });
    }
    static getHistoryByTodoId(todoId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.todoHistory.findMany({
                where: { todoId },
                orderBy: { createdAt: "asc" },
                include: { user: true },
            });
        });
    }
}
exports.TodoHistoryRepository = TodoHistoryRepository;
