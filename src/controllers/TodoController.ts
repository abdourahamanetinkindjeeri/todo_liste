import { Todo } from "@prisma/client";
import TodoService from "../services/TodoService";
import {
  CreateSchemaTodo,
  UpdateSchemaTodo,
} from "../validators/TodoValidator";
import { NextFunction, Request, Response } from "express";
import { Status } from "../repositories/ITodoRepository";

export default class TodoController {
  private service: TodoService = new TodoService();
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = CreateSchemaTodo.parse(req.body) as Omit<Todo, "id">;
      const todo = await this.service.create(data);
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
      if (!data) res.status(203).json({ message: "Tache mal formee..." });

      const todo = await this.service.update(+id, data);
      if (!todo) res.status(404).json({ message: "Tache introuvable..." });
      res.status(200).json({ message: "Tache trouve...", data: todo });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
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
