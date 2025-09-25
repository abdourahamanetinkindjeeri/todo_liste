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
const client_1 = require("@prisma/client");
const TodoService_js_1 = __importDefault(require("../services/TodoService.js"));
const CloudinaryService_js_1 = require("../services/CloudinaryService.js");
const TodoValidator_js_1 = require("../validators/TodoValidator.js");
const TaskDelegationRepository_js_1 = require("../repositories/TaskDelegationRepository.js");
const TodoHistoryRepository_js_1 = require("../repositories/TodoHistoryRepository.js");
class TodoController {
    constructor() {
        this.service = new TodoService_js_1.default();
        // Marquer toutes les notifications non lues comme lues pour un utilisateur
        this.readAllNotifications = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                if (isNaN(+userId)) {
                    return res.status(400).json({ message: "userId invalide" });
                }
                const updated = yield this.service.markAllNotificationsAsReadForUser(+userId);
                res.status(200).json({
                    message: `${updated.count} notifications marquées comme lues`,
                    updatedCount: updated.count,
                });
                return next();
            }
            catch (error) {
                console.error(error);
                res
                    .status(500)
                    .json({ error: "Impossible de mettre à jour les notifications" });
                next(error);
            }
        });
        this.getHistory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (typeof req.userId !== "number") {
                    return res.status(401).json({ message: "Utilisateur non authentifié" });
                }
                const todo = yield this.service.findById(+id);
                if (!todo) {
                    return res.status(404).json({ message: "Tâche introuvable" });
                }
                const isDelegate = yield TaskDelegationRepository_js_1.TaskDelegationRepository.isDelegate(req.userId, +id);
                if (todo.userId !== req.userId && !isDelegate) {
                    return res.status(403).json({
                        message: "Accès interdit : vous n'êtes ni le créateur ni un utilisateur délégué pour cette tâche.",
                    });
                }
                const history = yield TodoHistoryRepository_js_1.TodoHistoryRepository.getHistoryByTodoId(+id);
                res
                    .status(200)
                    .json({ message: "Historique de la tâche", data: history });
                return next();
            }
            catch (error) {
                next(error);
            }
        });
        this.getHistoryByUserId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                if (isNaN(+userId)) {
                    return res.status(400).json({ message: "userId invalide" });
                }
                const history = yield TodoHistoryRepository_js_1.TodoHistoryRepository.getHistoryByUserId(+userId);
                res.status(200).json({
                    message: "Historique des tâches de l'utilisateur",
                    data: history,
                });
                return next();
            }
            catch (error) {
                next(error);
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = TodoValidator_js_1.CreateSchemaTodo.parse(req.body);
                if (typeof req.userId !== "number") {
                    return res.status(401).json({ message: "Utilisateur non authentifié" });
                }
                // Gestion du champ photo
                let photo = null;
                if (req.file && req.file.filename) {
                    photo = `/public/data/uploads/${req.file.filename}`;
                }
                let vocal = null;
                if (req.files) {
                    const files = req.files;
                    if (files.vocal && files.vocal[0]) {
                        console.log("Fichier vocal reçu:", files.vocal[0].originalname, "Taille:", files.vocal[0].size);
                        try {
                            const uploadResult = yield CloudinaryService_js_1.CloudinaryService.uploadVocal(files.vocal[0].buffer, req.userId, "create");
                            vocal = uploadResult.url;
                            console.log("Vocal uploadé avec succès:", vocal);
                        }
                        catch (uploadError) {
                            console.error("Erreur upload vocal:", uploadError);
                            return res.status(400).json({
                                error: uploadError instanceof Error
                                    ? uploadError.message
                                    : "Erreur lors de l'upload du fichier vocal",
                            });
                        }
                    }
                    else {
                        console.log("Aucun fichier vocal trouvé dans req.files");
                    }
                }
                else {
                    console.log("req.files est undefined");
                }
                // Gestion du temps d'exécution
                let tempsExecution = 0;
                if (req.body.tempsExecution) {
                    tempsExecution = Number(req.body.tempsExecution) * 60;
                    if (isNaN(tempsExecution) || tempsExecution <= 0) {
                        return res.status(400).json({
                            message: "tempsExecution doit être un nombre positif (en secondes)",
                        });
                    }
                }
                else {
                    return res.status(400).json({ message: "tempsExecution est requis" });
                }
                const todoData = Object.assign(Object.assign({}, data), { description: data.description === undefined ? null : data.description, userId: req.userId, photo,
                    vocal, estAcheve: false, status: client_1.Statut.EN_ATTENTE, tempsExecution, dateDebut: null });
                console.log("Données à enregistrer:", Object.assign(Object.assign({}, todoData), { vocal: vocal ? "URL_VOCAL_PRESENT" : null }));
                const todo = yield this.service.create(todoData);
                // Ajout historique
                yield TodoHistoryRepository_js_1.TodoHistoryRepository.log({
                    todoId: todo.id,
                    userId: req.userId,
                    action: "CREATION",
                    description: `Tâche créée par l'utilisateur ${req.userId}`,
                });
                console.log("Tâche créée avec vocal:", todo.vocal ? "OUI" : "NON");
                res.locals.todoId = todo.id;
                res.status(201).json({
                    message: "Tache ajoutée avec succès.",
                    todo: Object.assign(Object.assign({}, todo), { photo, vocal }),
                });
                return next();
            }
            catch (err) {
                next(err);
            }
        });
        this.findAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const todos = yield this.service.findAll();
                res
                    .status(200)
                    .json({ message: "Recuperation reussi avec succes", data: todos });
                return next();
            }
            catch (error) {
                next(error);
            }
        });
        this.findById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const todo = yield this.service.findById(+id);
                if (!todo)
                    res.status(404).json({ message: "Tache introuvable..." });
                res.status(200).json({ message: "Tache trouve...", data: todo });
                return next();
            }
            catch (error) {
                next(error);
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const data = TodoValidator_js_1.UpdateSchemaTodo.parse(req.body);
                if (!data)
                    return res.status(203).json({ message: "Tache mal formee..." });
                const todo = yield this.service.findById(+id);
                if (!todo)
                    return res.status(404).json({ message: "Tache introuvable..." });
                if (typeof req.userId !== "number") {
                    return res.status(401).json({ message: "Utilisateur non authentifié" });
                }
                const isDelegate = yield TaskDelegationRepository_js_1.TaskDelegationRepository.isDelegate(req.userId, +id);
                if (todo.userId !== req.userId && !isDelegate) {
                    return res.status(403).json({
                        message: "Accès interdit : vous n'êtes ni le créateur ni un utilisateur délégué pour cette tâche.",
                    });
                }
                let photo = todo.photo;
                if (req.file && req.file.filename) {
                    photo = `/public/data/uploads/${req.file.filename}`;
                }
                // Gestion du champ vocal - Upload sur Cloudinary
                let vocal = todo.vocal;
                if (req.vocalFile) {
                    vocal = req.vocalFile.url;
                }
                else if (req.files) {
                    const files = req.files;
                    if (files.vocal && files.vocal[0]) {
                        try {
                            // Supprimer l'ancien vocal si il existe
                            if (todo.vocal) {
                                const oldPublicId = CloudinaryService_js_1.CloudinaryService.extractPublicId(todo.vocal);
                                if (oldPublicId) {
                                    yield CloudinaryService_js_1.CloudinaryService.deleteFile(oldPublicId, "video");
                                }
                            }
                            const uploadResult = yield CloudinaryService_js_1.CloudinaryService.uploadVocal(files.vocal[0].buffer, req.userId, "update");
                            vocal = uploadResult.url;
                        }
                        catch (uploadError) {
                            console.error("Erreur upload vocal:", uploadError);
                            // Garder l'ancien vocal en cas d'erreur
                            vocal = todo.vocal;
                        }
                    }
                }
                // Gestion de la modification du temps d'exécution
                let updateData = Object.assign(Object.assign({}, data), { photo, vocal });
                if (req.body.tempsExecution) {
                    const tempsExecution = Number(req.body.tempsExecution);
                    if (isNaN(tempsExecution) || tempsExecution <= 0) {
                        return res.status(400).json({
                            message: "tempsExecution doit être un nombre positif (en secondes)",
                        });
                    }
                    updateData.tempsExecution = tempsExecution;
                }
                const updated = yield this.service.update(+id, updateData);
                // Ajout historique
                yield TodoHistoryRepository_js_1.TodoHistoryRepository.log({
                    todoId: +id,
                    userId: req.userId,
                    action: "MODIFICATION",
                    description: `Tâche modifiée par l'utilisateur ${req.userId}`,
                });
                res.locals.todoId = +id;
                res.status(200).json({ message: "Tache modifiée", data: updated });
                return next();
            }
            catch (error) {
                next(error);
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const todo = yield this.service.findById(+id);
                if (!todo)
                    return res.status(404).json({ message: "Tache introuvable..." });
                // Vérifie que l'utilisateur connecté est le créateur
                if (todo.userId !== req.userId) {
                    return res.status(403).json({
                        message: "Accès interdit : vous n'êtes pas le créateur de cette tâche.",
                    });
                }
                // Supprimer le fichier vocal de Cloudinary si il existe
                if (todo.vocal) {
                    try {
                        const publicId = CloudinaryService_js_1.CloudinaryService.extractPublicId(todo.vocal);
                        if (publicId) {
                            yield CloudinaryService_js_1.CloudinaryService.deleteFile(publicId, "video");
                            return next();
                        }
                    }
                    catch (deleteError) {
                        console.error("Erreur suppression vocal Cloudinary:", deleteError);
                        // Continuer même si la suppression échoue
                    }
                }
                yield this.service.delete(+id);
                // Ajout historique
                yield TodoHistoryRepository_js_1.TodoHistoryRepository.log({
                    todoId: +id,
                    userId: req.userId,
                    action: "SUPPRESSION",
                    description: `Tâche supprimée par l'utilisateur ${req.userId}`,
                });
                res.locals.todoId = +id;
                res.status(200).json({ message: "Tache supprimée avec succès." });
                return next();
            }
            catch (error) {
                next(error);
            }
        });
        this.findNotCompleted = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const todos = yield this.service.findNotCompleted();
                res.status(200).json({ message: "Tâches non achevées", data: todos });
                return next();
            }
            catch (error) {
                next(error);
            }
        });
        this.findByStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const status = req.params.status;
                const todos = yield this.service.findByStatus(status);
                res
                    .status(200)
                    .json({ message: `Tâches avec le statut ${status}`, data: todos });
                return next();
            }
            catch (error) {
                next(error);
            }
        });
        this.completeTodo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const todo = yield this.service.completeTodo(+id);
                // Ajout historique
                if (typeof req.userId !== "number") {
                    return res.status(401).json({ message: "Utilisateur non authentifié" });
                }
                yield TodoHistoryRepository_js_1.TodoHistoryRepository.log({
                    todoId: +id,
                    userId: req.userId,
                    action: "COMPLETION",
                    description: `Tâche complétée par l'utilisateur ${req.userId}`,
                });
                res.status(200).json({ message: "Tâche complétée", data: todo });
                return next();
            }
            catch (error) {
                next(error);
            }
        });
        this.marquerTerminer = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const todo = yield this.service.findById(+id);
                if (!todo)
                    return res.status(404).json({ message: "Tâche introuvable" });
                if (todo.estAcheve)
                    return res.status(400).json({ message: "La tâche est déjà achevée" });
                const updated = yield this.service.changerStatus(+id, "TERMINEE");
                // Ajout historique
                if (typeof req.userId !== "number") {
                    return res.status(401).json({ message: "Utilisateur non authentifié" });
                }
                yield TodoHistoryRepository_js_1.TodoHistoryRepository.log({
                    todoId: +id,
                    userId: req.userId,
                    action: "MODIFICATION",
                    description: `Tâche marquée comme terminée par l'utilisateur ${req.userId}`,
                });
                res
                    .status(200)
                    .json({ message: "Tâche marquée comme terminée", data: updated });
                return next();
            }
            catch (error) {
                next(error);
            }
        });
        this.marquerEnAttente = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const todo = yield this.service.findById(+id);
                if (!todo)
                    return res.status(404).json({ message: "Tâche introuvable" });
                if (todo.estAcheve)
                    return res.status(400).json({
                        message: "La tâche est déjà achevée, impossible de changer le statut.",
                    });
                const updated = yield this.service.changerStatus(+id, "EN_ATTENTE");
                // Ajout historique
                if (typeof req.userId !== "number") {
                    return res.status(401).json({ message: "Utilisateur non authentifié" });
                }
                yield TodoHistoryRepository_js_1.TodoHistoryRepository.log({
                    todoId: +id,
                    userId: req.userId,
                    action: "MODIFICATION",
                    description: `Tâche marquée comme en attente par l'utilisateur ${req.userId}`,
                });
                res
                    .status(200)
                    .json({ message: "Tâche marquée comme en attente", data: updated });
                return next();
            }
            catch (error) {
                next(error);
            }
        });
        this.marquerEnCours = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const todo = yield this.service.changerStatus(+id, "EN_COURS");
                res
                    .status(200)
                    .json({ message: "Tâche marquée comme en cours", data: todo });
                return next();
            }
            catch (error) {
                next(error);
            }
        });
        this.removeDelegate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { userId } = req.body;
                if (req.userId !== undefined && userId !== undefined) {
                    const todo = yield this.service.findById(+id);
                    if (todo && todo.userId === req.userId) {
                        yield TaskDelegationRepository_js_1.TaskDelegationRepository.removeDelegation(+id, userId);
                        return res
                            .status(200)
                            .json({ message: "Délégation retirée avec succès." });
                    }
                    res.status(403).json({ message: "Action non autorisée." });
                    return next();
                }
                res
                    .status(400)
                    .json({ message: "Paramètres manquants ou non authentifié." });
                return next();
            }
            catch (error) {
                next(error);
            }
        });
        this.delegate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { userId } = req.body;
                if (req.userId !== undefined && userId !== undefined) {
                    const todo = yield this.service.findById(+id);
                    if (todo && todo.userId === req.userId) {
                        yield TaskDelegationRepository_js_1.TaskDelegationRepository.addDelegation(+id, userId);
                        res.locals.todoId = +id;
                        res.status(201).json({ message: "Délégation ajoutée avec succès." });
                        return next();
                    }
                    res.status(403).json({ message: "Action non autorisée." });
                    return next();
                }
                res
                    .status(400)
                    .json({ message: "Paramètres manquants ou non authentifié." });
                return next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = TodoController;
