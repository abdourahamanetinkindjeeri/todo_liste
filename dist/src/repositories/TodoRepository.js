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
const client_1 = require("@prisma/client");
class TodoRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.todo.delete({ where: { id } });
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.todo.findMany();
        });
    }
    findAllAsArray() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.todo.findMany();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.todo.findUnique({ where: { id } });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.todo.create({ data });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.todo.update({ where: { id }, data });
        });
    }
    findNotCompleted() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.todo.findMany({ where: { estAcheve: false } });
        });
    }
    findByStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.todo.findMany({ where: { status } });
        });
    }
    changerStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (status === "TERMINEE") {
                return this.prisma.todo.update({
                    where: { id },
                    data: { status, estAcheve: true },
                });
            }
            // Si le statut devient "en_cours", on met à jour la dateDebut
            if (status === "EN_COURS") {
                return this.prisma.todo.update({
                    where: { id },
                    data: { status, estAcheve: false, dateDebut: new Date() },
                });
            }
            return this.prisma.todo.update({
                where: { id },
                data: { status, estAcheve: false },
            });
        });
    }
    completeTodo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.todo.update({
                where: { id },
                data: { estAcheve: true },
            });
        });
    }
}
exports.default = TodoRepository;
