import { TodoHistoryRepository } from "../repositories/TodoHistoryRepository.js";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware d'audit pour enregistrer les actions sur les tâches.
 * Utilisation : placer ce middleware sur les routes qui modifient les tâches (create, update, delete, delegate, etc.)
 * Il attend que le contrôleur ait terminé (post-handler).
 */
export function auditTodoAction(action: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // On suppose que le contrôleur place l'ID de la tâche dans res.locals.todoId
    // et que l'utilisateur est authentifié (req.userId)
    const todoId = res.locals.todoId;
    const userId = req.userId;
    if (!todoId || !userId) return next();
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
    await TodoHistoryRepository.log({
      todoId,
      userId,
      action,
      description,
    });
    next();
  };
}
