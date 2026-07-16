import express from "express";
import setupApp from "./setup-app";
import { SETTINGS } from "./settings/config";
import { runDB } from "./db/mongo.db";
import { dbConnectionMiddleware } from "./db/db-connection.middleware";

const app = express();

app.use(dbConnectionMiddleware);

setupApp(app);

const PORT = SETTINGS.PORT;

const startApp = async () => {
  if (!SETTINGS.VERCEL) {
    await runDB(SETTINGS.MONGO_URL)

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
}

startApp()

export default app;