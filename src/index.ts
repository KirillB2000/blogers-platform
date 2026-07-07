import express from 'express';
import setupApp from './setup-app';
import { SETTINGS } from './settings/config';

export const app = express()
export default setupApp(app)

const PORT = SETTINGS.PORT

app.listen(PORT, () => {
    console.log(`Serever is running on http://localhost:${PORT}`);
})