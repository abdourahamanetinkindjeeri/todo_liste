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
const TodoRepository_js_1 = __importDefault(require("../repositories/TodoRepository.js"));
const TodoHistoryRepository_js_1 = require("../repositories/TodoHistoryRepository.js");
class TodoService {
    constructor() {
        this.repository = new TodoRepository_js_1.default();
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.repository.delete(id);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findAll();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findById(id);
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.create(data);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.update(id, data);
        });
    }
    findNotCompleted() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findNotCompleted();
        });
    }
    findByStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findByStatus(status);
        });
    }
    changerStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.changerStatus(id, status);
        });
    }
    completeTodo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.completeTodo(id);
        });
    }
    // Marquer toutes les notifications non lues comme lues pour un utilisateur
    markAllNotificationsAsReadForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return TodoHistoryRepository_js_1.TodoHistoryRepository.markAllAsReadForUser(userId);
        });
    }
}
exports.default = TodoService;
