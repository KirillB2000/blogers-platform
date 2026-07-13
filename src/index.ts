import express from "express";
import setupApp from "./setup-app";
import { SETTINGS } from "./settings/config";

const bootstrap = async () => {
  const app = express();
  setupApp(app);
  
  const PORT = SETTINGS.PORT;
  
  if (!SETTINGS.VERCEL) {
    app.listen(PORT, () => {
      console.log(`Serever is running on http://localhost:${PORT}`);
    });
  }
  
  return app
}

bootstrap()