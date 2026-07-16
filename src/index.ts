import express from "express";
import setupApp from "./setup-app";
import { SETTINGS } from "./settings/config";
import { runDB } from "./db/mongo.db";

const app = express();
setupApp(app);

const bootstrap = async () => {
  const PORT = SETTINGS.PORT;

  await runDB(SETTINGS.MONGO_URL)
  
  if (!SETTINGS.VERCEL) {
    app.listen(PORT, () => {
      console.log(`Serever is running on http://localhost:${PORT}`);
    });
  }
  
  return app
}

// Сразу экспортируем Express-приложение
// Для Vercel: @vercel/node сам вызовет app(req, res)
// Для локальной разработки: вызываем bootstrap для подключения БД и запуска сервера
bootstrap();

export default app;