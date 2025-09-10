import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { login } from "../services/login.js";
import dotenv from "dotenv";

const router = Router();
dotenv.config();

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await login(email, password);
  if (!user) return res.status(401).json({ error: "Identifiants invalides" });

  const accessPayload = {
    id: user.id,
    email: user.email,
    prenom: user?.email,
    nom: user.prenom,
    role: user.role,
  };
  const refreshPayload = {
    email: user.email,
  };

  const accessToken = jwt.sign(
    accessPayload,
    process.env.JWT_ACCESS_SECRET as string,
    {
      algorithm: "HS512",
      expiresIn: "30m",
    }
  );
  const refreshToken = jwt.sign(
    refreshPayload,
    process.env.JWT_REFRESH_SECRET as string,
    {
      algorithm: "HS512",
      expiresIn: "7d",
    }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ accessToken });
});

router.post("/refresh", (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(400).json({ error: "Token manquant" });
  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as {
      email: string;
    };
    const newAccessToken = jwt.sign(
      { email: payload.email },
      process.env.JWT_ACCESS_SECRET as string,
      {
        algorithm: "HS512",
        expiresIn: "15m",
      }
    );
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ error: "Refresh token invalide" });
  }
});

export default router;
