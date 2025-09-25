"use strict";
// import { Request, Response, NextFunction } from "express";
// import TodoRepository from "../repositories/TodoRepository";
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
exports.taskProgressMiddleware = void 0;
const TodoRepository_1 = __importDefault(require("../repositories/TodoRepository"));
const taskProgressMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todoId = req.params.id;
        if (!todoId) {
            return res.status(400).json({ error: "ID de la tâche manquant." });
        }
        const todoRepo = new TodoRepository_1.default();
        const todo = yield todoRepo.findById(Number(todoId));
        if (!todo) {
            return res.status(404).json({ error: "Tâche non trouvée." });
        }
        const maintenantSec = Math.floor(Date.now() / 1000);
        // --- Cas EN_COURS ---
        if (todo.status === "EN_COURS" &&
            todo.dateDebut &&
            todo.tempsExecution > 0) {
            const dateDebutSec = Math.floor(new Date(todo.dateDebut).getTime() / 1000);
            // Temps écoulé
            const tempsEcoule = maintenantSec - dateDebutSec;
            let tempsRestant = todo.tempsExecution - tempsEcoule;
            if (tempsRestant <= 0) {
                // La tâche est terminée
                yield todoRepo.update(todo.id, {
                    status: "TERMINEE",
                    estAcheve: true,
                    tempsExecution: 0,
                });
                res.locals.progression = { tempsRestant: 0, status: "TERMINEE" };
            }
            else {
                // Mettre à jour le temps restant
                yield todoRepo.update(todo.id, {
                    tempsExecution: tempsRestant,
                    dateDebut: new Date(), // reset pour continuer le suivi
                });
                res.locals.progression = { tempsRestant, status: "EN_COURS" };
            }
            return next();
        }
        // --- Cas EN_ATTENTE ---
        if (todo.status === "EN_ATTENTE" &&
            todo.dateDebut &&
            todo.tempsExecution > 0) {
            const dateDebutSec = Math.floor(new Date(todo.dateDebut).getTime() / 1000);
            const tempsEcoule = maintenantSec - dateDebutSec;
            let tempsRestant = todo.tempsExecution - tempsEcoule;
            if (tempsRestant < 0)
                tempsRestant = 0;
            // On "gèle" le temps restant
            yield todoRepo.update(todo.id, {
                tempsExecution: tempsRestant,
                dateDebut: null, // reset car on est en pause
            });
            res.locals.progression = { tempsRestant, status: "EN_ATTENTE" };
            return next();
        }
        // --- Cas TERMINEE ---
        if (todo.status === "TERMINEE") {
            res.locals.progression = { tempsRestant: 0, status: "TERMINEE" };
            return next();
        }
        return res
            .status(400)
            .json({ error: "Statut de tâche non géré ou données manquantes." });
    }
    catch (error) {
        console.error("Erreur middleware progression:", error);
        return res
            .status(500)
            .json({ error: "Erreur lors du calcul de la progression." });
    }
});
exports.taskProgressMiddleware = taskProgressMiddleware;
