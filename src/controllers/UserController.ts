import { User } from "@prisma/client";

import { NextFunction, Request, Response } from "express";
import UserService from "../services/UserService.js";
import {
  CreateSchemaUser,
  UpdateSchemaUser,
} from "../validators/UserValidator.js";

export default class UserController {
  private service: UserService = new UserService();
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = CreateSchemaUser.parse(req.body) as Omit<User, "id">;
      const user = await this.service.create(data);
      res.status(201).json({ message: "User ajoutée avec succès.", user });
    } catch (err: any) {
      if (
        err instanceof Error &&
        err.message === "Un utilisateur avec cet email existe déjà"
      ) {
        return res.status(409).json({
            success: false,
            message: `Un utilisateur avec cet email existe déjà`,
        });
      }
      next(err);
    }
  };
  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.service.findAll();
      res
        .status(200)
        .json({ message: "Recuperation reussi avec succes", data: users });
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.service.findById(+id);

      if (!user) res.status(404).json({ message: "Tache introuvable..." });
      res.status(200).json({ message: "Tache trouve...", data: user });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = UpdateSchemaUser.parse(req.body);
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
}
