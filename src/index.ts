import express, { Express } from "express";
import setupApp from "./setup-app";
import { SETTINGS } from "./settings/config";
import { runDB } from "./db/mongo.db";

let app: Express;

const bootstrap = async () => {
  app = express();
  setupApp(app);
  
  const PORT = SETTINGS.PORT;

  await runDB(SETTINGS.MONGO_URL)
  
  if (!SETTINGS.VERCEL) {
    app.listen(PORT, () => {
      console.log(`Serever is running on http://localhost:${PORT}`);
    });
  }
  
  return app
}

bootstrap();

export default app!;