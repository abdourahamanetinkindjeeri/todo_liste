import { Statut } from "@prisma/client";
import TodoService from "../services/TodoService.js";
import path from "path";

import {
  CreateSchemaTodo,
  UpdateSchemaTodo,
} from "../validators/TodoValidator.js";
import { NextFunction, Request, Response } from "express";

import { TaskDelegationRepository } from "../repositories/TaskDelegationRepository.js";
import { Status } from "../repositories/ITodoRepository.js";
import { TodoHistoryRepository } from "../repositories/TodoHistoryRepository.js";

export default class TodoController {
  private service: TodoService = new TodoService();
  getHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (typeof req.userId !== "number") {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
      const todo = await this.service.findById(+id);
      if (!todo) {
        return res.status(404).json({ message: "Tâche introuvable" });
      }
      const isDelegate = await TaskDelegationRepository.isDelegate(
        req.userId,
        +id
      );
      if (todo.userId !== req.userId && !isDelegate) {
        return res.status(403).json({
          message:
            "Accès interdit : vous n'êtes ni le créateur ni un utilisateur délégué pour cette tâche.",
        });
      }
      const history = await TodoHistoryRepository.getHistoryByTodoId(+id);
      res
        .status(200)
        .json({ message: "Historique de la tâche", data: history });
    } catch (error) {
      next(error);
    }
  };
  getHistoryByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.params;
      if (isNaN(+userId)) {
        return res.status(400).json({ message: "userId invalide" });
      }
      const history = await TodoHistoryRepository.getHistoryByUserId(+userId);
      res.status(200).json({
        message: "Historique des tâches de l'utilisateur",
        data: history,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = CreateSchemaTodo.parse(req.body);
      if (typeof req.userId !== "number") {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
      // Gestion du champ photo
      let photo: string | null = null;
      if (req.file && req.file.filename) {
        photo = `/public/data/uploads/${req.file.filename}`;
      }
      const todoData = {
        ...data,
        description: data.description === undefined ? null : data.description,
        userId: req.userId,
        photo,
        estAcheve: false,
        status: Statut.EN_ATTENTE,
      };
      const todo = await this.service.create(todoData);
      res.locals.todoId = todo.id;
      res.status(201).json({
        message: "Tache ajoutée avec succès.",
        todo: { ...todo, photo },
      });
    } catch (err) {
      next(err);
    }
  };
  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const todos = await this.service.findAll();
      res
        .status(200)
        .json({ message: "Recuperation reussi avec succes", data: todos });
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const todo = await this.service.findById(+id);

      if (!todo) res.status(404).json({ message: "Tache introuvable..." });
      res.status(200).json({ message: "Tache trouve...", data: todo });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = UpdateSchemaTodo.parse(req.body);
      if (!data)
        return res.status(203).json({ message: "Tache mal formee..." });

      const todo = await this.service.findById(+id);
      if (!todo)
        return res.status(404).json({ message: "Tache introuvable..." });

      if (typeof req.userId !== "number") {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
      const isDelegate = await TaskDelegationRepository.isDelegate(
        req.userId,
        +id
      );
      if (todo.userId !== req.userId && !isDelegate) {
        return res.status(403).json({
          message:
            "Accès interdit : vous n'êtes ni le créateur ni un utilisateur délégué pour cette tâche.",
        });
      }
      let photo: string | undefined | null = todo.photo;
      if (req.file && req.file.filename) {
        photo = `/public/data/uploads/${req.file.filename}`;
      }
      const updated = await this.service.update(+id, { ...data, photo });
      res.locals.todoId = +id;
      res.status(200).json({ message: "Tache modifiée", data: updated });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const todo = await this.service.findById(+id);
      if (!todo)
        return res.status(404).json({ message: "Tache introuvable..." });
      // Vérifie que l'utilisateur connecté est le créateur
      if (todo.userId !== req.userId) {
        return res.status(403).json({
          message:
            "Accès interdit : vous n'êtes pas le créateur de cette tâche.",
        });
      }
      await this.service.delete(+id);
      res.locals.todoId = +id;
      res.status(200).json({ message: "Tache supprimée avec succès." });
    } catch (error) {
      next(error);
    }
  };

  findNotCompleted = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const todos = await this.service.findNotCompleted();
      res.status(200).json({ message: "Tâches non achevées", data: todos });
    } catch (error) {
      next(error);
    }
  };

  findByStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = req.params.status as Status;
      const todos = await this.service.findByStatus(status);
      res
        .status(200)
        .json({ message: `Tâches avec le statut ${status}`, data: todos });
    } catch (error) {
      next(error);
    }
  };

  completeTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const todo = await this.service.completeTodo(+id);
      res.status(200).json({ message: "Tâche complétée", data: todo });
    } catch (error) {
      next(error);
    }
  };

  marquerTerminer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const todo = await this.service.findById(+id);
      if (!todo) return res.status(404).json({ message: "Tâche introuvable" });
      if (todo.estAcheve)
        return res.status(400).json({ message: "La tâche est déjà achevée" });
      const updated = await this.service.changerStatus(+id, "TERMINEE");
      res
        .status(200)
        .json({ message: "Tâche marquée comme terminée", data: updated });
    } catch (error) {
      next(error);
    }
  };

  marquerEnAttente = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const todo = await this.service.findById(+id);
      if (!todo) return res.status(404).json({ message: "Tâche introuvable" });
      if (todo.estAcheve)
        return res.status(400).json({
          message:
            "La tâche est déjà achevée, impossible de changer le statut.",
        });
      const updated = await this.service.changerStatus(+id, "EN_ATTENTE");
      res
        .status(200)
        .json({ message: "Tâche marquée comme en attente", data: updated });
    } catch (error) {
      next(error);
    }
  };

  marquerEnCours = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const todo = await this.service.changerStatus(+id, "EN_COURS");
      res
        .status(200)
        .json({ message: "Tâche marquée comme en cours", data: todo });
    } catch (error) {
      next(error);
    }
  };

  removeDelegate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      if (req.userId !== undefined && userId !== undefined) {
        const todo = await this.service.findById(+id);
        if (todo && todo.userId === req.userId) {
          await TaskDelegationRepository.removeDelegation(+id, userId);
          return res
            .status(200)
            .json({ message: "Délégation retirée avec succès." });
        }
        return res.status(403).json({ message: "Action non autorisée." });
      }
      res
        .status(400)
        .json({ message: "Paramètres manquants ou non authentifié." });
    } catch (error) {
      next(error);
    }
  };

  delegate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      if (req.userId !== undefined && userId !== undefined) {
        const todo = await this.service.findById(+id);
        if (todo && todo.userId === req.userId) {
          await TaskDelegationRepository.addDelegation(+id, userId);
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
    } catch (error) {
      next(error);
    }
  };
}
