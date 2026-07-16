import express from "express";
import setupApp from "./setup-app";
import { SETTINGS } from "./settings/config";
import { runDB } from "./db/mongo.db";

const app = express();

// Глобальный кеш подключения к БД (работает между холодными стартами Vercel)
let dbPromise: Promise<any> | null = null;

// Middleware для подключения БД при первом запросе
app.use(async (req, res, next) => {
  if (!dbPromise) {
    dbPromise = runDB(SETTINGS.MONGO_URL);
  }
  await dbPromise;
  next();
});

setupApp(app);

const PORT = SETTINGS.PORT;

// Для локального запуска
if (!SETTINGS.VERCEL) {
  runDB(SETTINGS.MONGO_URL).then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  });
}

export default app;