import express from "express";
import setupApp from "./setup-app";
import { SETTINGS } from "./settings/config";
import { runDB } from "./db/mongo.db";
import { dbConnectionMiddleware } from "./db/db-connection.middleware";

const app = express();

app.use(dbConnectionMiddleware);

setupApp(app);

const PORT = SETTINGS.PORT;

if (!SETTINGS.VERCEL) {
  runDB(SETTINGS.MONGO_URL).then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  });
}

export default app;