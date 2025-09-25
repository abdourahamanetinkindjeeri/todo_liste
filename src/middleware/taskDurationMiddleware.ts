// import { Request, Response, NextFunction } from "express";
// import TodoRepository from "../repositories/TodoRepository";

// export const taskProgressMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//     const todoId = req.params.id;
//     if (!todoId) {
// Suppression de la gestion de dateDebut (champ supprimé du modèle)
//     const todo = await todoRepo.findById(Number(todoId));
//     if (!todo) {
//       return res.status(404).json({ error: "Tâche non trouvée." });
//     }

//     // On récupère la date actuelle en secondes
//     const maintenantSec = Math.floor(Date.now() / 1000);

//     // --- Cas EN_COURS ---
//     if (
//       todo.status === "EN_COURS" &&
//       todo.dateDebut &&
//       todo.tempsExecution > 0
//       const dateDebutSec = Math.floor(
//         new Date(todo.dateDebut).getTime() / 1000
//       );

//       // Temps écoulé depuis le début (en secondes)
//       const tempsEcoule = maintenantSec - dateDebutSec;

//       // Temps restant
//       let tempsRestant = todo.tempsExecution - tempsEcoule;

//       if (tempsRestant <= 0) {
//         // Terminer la tâche
//         await todoRepo.update(todo.id, {
//           status: "TERMINEE",
//           estAcheve: true,
//           tempsExecution: 0,
//         });
//         res.locals.progression = { tempsRestant: 0, status: "TERMINEE" };
//       } else {
//         // Mettre à jour le temps restant
//         await todoRepo.update(todo.id, {
//           tempsExecution: tempsRestant,
//           dateDebut: new Date(), // redémarre le compteur pour la prochaine itération
//         });
//         res.locals.progression = { tempsRestant, status: "EN_COURS" };
//       }
//       return next();
//     }

//     // --- Cas EN_ATTENTE ---
//     if (todo.status === "EN_ATTENTE") {
//       // Ici, on garde juste le temps restant tel quel
//       res.locals.progression = {
//         tempsRestant: todo.tempsExecution,
//         status: "EN_ATTENTE",
//       };
//       return next();
//     }

//     // --- Cas TERMINEE ---
//     if (todo.status === "TERMINEE") {
//       res.locals.progression = { tempsRestant: 0, status: "TERMINEE" };
//       return next();
//     }

//     return res.status(400).json({
//       error: "Statut de tâche non géré ou données manquantes.",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       error: "Erreur lors du calcul de la progression.",
//     });
//   }
// };

import { Request, Response, NextFunction } from "express";
import TodoRepository from "../repositories/TodoRepository";

export const taskProgressMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todoId = req.params.id;
    if (!todoId) {
      return res.status(400).json({ error: "ID de la tâche manquant." });
    }

    const todoRepo = new TodoRepository();
    const todo = await todoRepo.findById(Number(todoId));
    if (!todo) {
      return res.status(404).json({ error: "Tâche non trouvée." });
    }

    const maintenantSec = Math.floor(Date.now() / 1000);

    // --- Cas EN_COURS ---
    if (todo.status === "EN_COURS" && todo.tempsExecution > 0) {
      // Ici, on ne gère plus la dateDebut
      // Vous pouvez adapter la logique selon vos besoins
      res.locals.progression = {
        tempsRestant: todo.tempsExecution,
        status: "EN_COURS",
      };
      return next();
    }

    // --- Cas EN_ATTENTE ---
    if (todo.status === "EN_ATTENTE") {
      res.locals.progression = {
        tempsRestant: todo.tempsExecution,
        status: "EN_ATTENTE",
      };
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
  } catch (error) {
    console.error("Erreur middleware progression:", error);
    return res
      .status(500)
      .json({ error: "Erreur lors du calcul de la progression." });
  }
};
