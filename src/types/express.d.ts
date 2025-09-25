import { Express } from "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    userId?: number;
    vocalFile?: {
      url: string;
      public_id: string;
      duration?: number | null;
    };
    photoFile?: {
      filename: string;
      path: string;
      originalname: string;
      mimetype: string;
      size: number;
    };
  }
}
