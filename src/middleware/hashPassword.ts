import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";

async function hashPassword(password: string, longueurHash: number = 10) {
  return await bcrypt.hash(password, longueurHash);
}

export default async function hashPasswordMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Mot de passe requis" });
    }

    const hashedPassword = await hashPassword(password);
    req.body.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
}
