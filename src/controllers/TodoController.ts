import { Statut } from "@prisma/client";
import TodoService from "../services/TodoService.js";
import { CloudinaryService } from "../services/CloudinaryService.js";
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

  // Marquer toutes les notifications non lues comme lues pour un utilisateur
  readAllNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.params;
      if (isNaN(+userId)) {
        return res.status(400).json({ message: "userId invalide" });
      }
      const updated = await this.service.markAllNotificationsAsReadForUser(
        +userId
      );
      res.status(200).json({
        message: `${updated.count} notifications marquées comme lues`,
        updatedCount: updated.count,
      });
      return next();
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Impossible de mettre à jour les notifications" });
      next(error);
    }
  };

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
      return next();
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
      return next();
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

      let vocal: string | null = null;
      if (req.files) {
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };
        if (files.vocal && files.vocal[0]) {
          console.log(
            "Fichier vocal reçu:",
            files.vocal[0].originalname,
            "Taille:",
            files.vocal[0].size
          );
          try {
            const uploadResult = await CloudinaryService.uploadVocal(
              files.vocal[0].buffer,
              req.userId,
              "create"
            );
            vocal = uploadResult.url;
            console.log("Vocal uploadé avec succès:", vocal);
          } catch (uploadError) {
            console.error("Erreur upload vocal:", uploadError);
            return res.status(400).json({
              error:
                uploadError instanceof Error
                  ? uploadError.message
                  : "Erreur lors de l'upload du fichier vocal",
            });
          }
        } else {
          console.log("Aucun fichier vocal trouvé dans req.files");
        }
      } else {
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
      } else {
        return res.status(400).json({ message: "tempsExecution est requis" });
      }

      const todoData = {
        ...data,
        description: data.description === undefined ? null : data.description,
        userId: req.userId,
        photo,
        vocal,
        estAcheve: false,
        status: Statut.EN_ATTENTE,
        tempsExecution,
        dateDebut: null,
      };
      console.log("Données à enregistrer:", {
        ...todoData,
        vocal: vocal ? "URL_VOCAL_PRESENT" : null,
      });
      const todo = await this.service.create(todoData);
      // Ajout historique
      await TodoHistoryRepository.log({
        todoId: todo.id,
        userId: req.userId,
        action: "CREATION",
        description: `Tâche créée par l'utilisateur ${req.userId}`,
      });
      console.log("Tâche créée avec vocal:", todo.vocal ? "OUI" : "NON");
      res.locals.todoId = todo.id;
      res.status(201).json({
        message: "Tache ajoutée avec succès.",
        todo: { ...todo, photo, vocal },
      });
      return next();
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
      return next();
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
      return next();
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

      // Gestion du champ vocal - Upload sur Cloudinary
      let vocal: string | undefined | null = todo.vocal;
      if ((req as any).vocalFile) {
        vocal = (req as any).vocalFile.url;
      } else if (req.files) {
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };
        if (files.vocal && files.vocal[0]) {
          try {
            // Supprimer l'ancien vocal si il existe
            if (todo.vocal) {
              const oldPublicId = CloudinaryService.extractPublicId(todo.vocal);
              if (oldPublicId) {
                await CloudinaryService.deleteFile(oldPublicId, "video");
              }
            }

            const uploadResult = await CloudinaryService.uploadVocal(
              files.vocal[0].buffer,
              req.userId,
              "update"
            );
            vocal = uploadResult.url;
          } catch (uploadError) {
            console.error("Erreur upload vocal:", uploadError);
            // Garder l'ancien vocal en cas d'erreur
            vocal = todo.vocal;
          }
        }
      }

      // Gestion de la modification du temps d'exécution
      let updateData: any = { ...data, photo, vocal };
      if (req.body.tempsExecution) {
        const tempsExecution = Number(req.body.tempsExecution);
        if (isNaN(tempsExecution) || tempsExecution <= 0) {
          return res.status(400).json({
            message: "tempsExecution doit être un nombre positif (en secondes)",
          });
        }
        updateData.tempsExecution = tempsExecution;
      }
      const updated = await this.service.update(+id, updateData);
      // Ajout historique
      await TodoHistoryRepository.log({
        todoId: +id,
        userId: req.userId,
        action: "MODIFICATION",
        description: `Tâche modifiée par l'utilisateur ${req.userId}`,
      });
      res.locals.todoId = +id;
      res.status(200).json({ message: "Tache modifiée", data: updated });
      return next();
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

      // Supprimer le fichier vocal de Cloudinary si il existe
      if (todo.vocal) {
        try {
          const publicId = CloudinaryService.extractPublicId(todo.vocal);
          if (publicId) {
            await CloudinaryService.deleteFile(publicId, "video");
            return next();
          }
        } catch (deleteError) {
          console.error("Erreur suppression vocal Cloudinary:", deleteError);
          // Continuer même si la suppression échoue
        }
      }

      await this.service.delete(+id);
      // Ajout historique
      await TodoHistoryRepository.log({
        todoId: +id,
        userId: req.userId,
        action: "SUPPRESSION",
        description: `Tâche supprimée par l'utilisateur ${req.userId}`,
      });
      res.locals.todoId = +id;
      res.status(200).json({ message: "Tache supprimée avec succès." });
      return next();
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
      return next();
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
      return next();
    } catch (error) {
      next(error);
    }
  };

  completeTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const todo = await this.service.completeTodo(+id);
      // Ajout historique
      if (typeof req.userId !== "number") {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
      await TodoHistoryRepository.log({
        todoId: +id,
        userId: req.userId,
        action: "COMPLETION",
        description: `Tâche complétée par l'utilisateur ${req.userId}`,
      });
      res.status(200).json({ message: "Tâche complétée", data: todo });
      return next();
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
      // Ajout historique
      if (typeof req.userId !== "number") {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
      await TodoHistoryRepository.log({
        todoId: +id,
        userId: req.userId,
        action: "MODIFICATION",
        description: `Tâche marquée comme terminée par l'utilisateur ${req.userId}`,
      });
      res
        .status(200)
        .json({ message: "Tâche marquée comme terminée", data: updated });
      return next();
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
      // Ajout historique
      if (typeof req.userId !== "number") {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
      await TodoHistoryRepository.log({
        todoId: +id,
        userId: req.userId,
        action: "MODIFICATION",
        description: `Tâche marquée comme en attente par l'utilisateur ${req.userId}`,
      });
      res
        .status(200)
        .json({ message: "Tâche marquée comme en attente", data: updated });
      return next();
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
      return next();
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
