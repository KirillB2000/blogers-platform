import * as dotenv from 'dotenv'
dotenv.config()

import { SETTINGS } from "./settings/config";
import express from "express";
import setupApp from "./setup-app";
import { runDb } from './db/mongoose.db';

export const app = express();
app.set('trust proxy', true)

setupApp(app);

const PORT = SETTINGS.PORT;

const startApp = async () => {
  await runDb()
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startApp()