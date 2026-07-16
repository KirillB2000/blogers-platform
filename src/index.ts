import express, { Express } from "express";
import setupApp from "./setup-app";
import { SETTINGS } from "./settings/config";
import { runDB } from "./db/mongo.db";

let appInstance: Express | null = null;

const bootstrap = async () => {
  if (appInstance) return appInstance;
  
  const app = express();
  setupApp(app);
  
  const PORT = SETTINGS.PORT;

  await runDB(SETTINGS.MONGO_URL)
  
  if (!SETTINGS.VERCEL) {
    app.listen(PORT, () => {
      console.log(`Serever is running on http://localhost:${PORT}`);
    });
  }
  
  appInstance = app;
  return app;
}

// Запускаем при создании модуля — для Vercel это гарантирует,
// что app будет готов к моменту первого запроса
const appPromise = bootstrap();

// Экспортируем handler для Vercel
export default async function handler(req: any, res: any) {
  const app = await appPromise;
  return app(req, res);
}