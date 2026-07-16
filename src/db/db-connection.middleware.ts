import { Request, Response, NextFunction } from "express";
import { SETTINGS } from "../settings/config";
import { runDB } from "./mongo.db";

// Глобальный кеш подключения к БД (работает между холодными стартами Vercel)
let dbPromise: Promise<any> | null = null;

export const dbConnectionMiddleware = async (
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!dbPromise) {
    dbPromise = runDB(SETTINGS.MONGO_URL);
  }
  await dbPromise;
  next();
};