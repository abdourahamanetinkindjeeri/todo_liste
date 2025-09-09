import { Todo } from "@prisma/client";
import TodoService from "../services/TodoService";
import {
  CreateSchemaTodo,
  UpdateSchemaTodo,
} from "../validators/TodoValidator";
import { NextFunction, Request, Response } from "express";
import { Status } from "../repositories/ITodoRepository";

export default class TodoController {
  removeDelegate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { userId: delegateUserId } = req.body;
      if (typeof req.userId !== "number") {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
      if (typeof delegateUserId !== "number") {
        return res
          .status(400)
          .json({ message: "userId du délégué manquant ou invalide" });
      }
      const todo = await this.service.findById(+id);
      if (!todo)
        return res.status(404).json({ message: "Tâche introuvable..." });
      if (todo.userId !== req.userId) {
        return res
          .status(403)
          .json({
            message: "Seul le propriétaire peut retirer une délégation.",
          });
      }
      const { TaskDelegationRepository } = await import(
        "../repositories/TaskDelegationRepository"
      );
      await TaskDelegationRepository.removeDelegation(+id, delegateUserId);
      res.status(200).json({ message: "Délégation retirée avec succès." });
    } catch (error) {
      next(error);
    }
  };
  delegate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { userId: delegateUserId } = req.body;
      if (typeof req.userId !== "number") {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
      if (typeof delegateUserId !== "number") {
        return res
          .status(400)
          .json({ message: "userId du délégué manquant ou invalide" });
      }
      const todo = await this.service.findById(+id);
      if (!todo)
        return res.status(404).json({ message: "Tâche introuvable..." });
      if (todo.userId !== req.userId) {
        return res
          .status(403)
          .json({ message: "Seul le propriétaire peut déléguer cette tâche." });
      }
      const { TaskDelegationRepository } = await import(
        "../repositories/TaskDelegationRepository"
      );
      await TaskDelegationRepository.addDelegation(+id, delegateUserId);
      res.status(201).json({ message: "Délégation ajoutée avec succès." });
    } catch (error) {
      next(error);
    }
  };
  private service: TodoService = new TodoService();
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = CreateSchemaTodo.parse(req.body);
      if (typeof req.userId !== "number") {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
      const todoData = {
        ...data,
        description: data.description === undefined ? null : data.description,
        userId: req.userId,
      };
      const todo = await this.service.create(todoData);
      res.status(201).json({ message: "Tache ajoutée avec succès.", todo });
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
      console.log(todo);

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

      // Vérifie que l'utilisateur connecté est le créateur ou un délégué
      if (typeof req.userId !== "number") {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
      const { TaskDelegationRepository } = await import(
        "../repositories/TaskDelegationRepository"
      );
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
      const updated = await this.service.update(+id, data);
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
}
