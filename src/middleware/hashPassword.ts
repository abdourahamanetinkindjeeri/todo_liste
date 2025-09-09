import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";

async function hashPassword(password: string, longueurHash: number = 10) {
  console.log(password);

  return await bcrypt.hash(password, longueurHash);
}

export default async function hashPasswordMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { password } = req.body;
    // console.log(password);

    if (!password) {
      return res.status(400).json({ error: "Mot de passe requis" });
    }

    const hashedPassword = await hashPassword(password);
    req.body.password = hashedPassword;

    console.log(req.body.password);

    next();
  } catch (error) {
    next(error);
  }
}
