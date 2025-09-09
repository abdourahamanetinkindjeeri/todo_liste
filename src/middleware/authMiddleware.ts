declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Token manquant" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
    req.userId = (decoded as any).id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalide" });
  }
}
