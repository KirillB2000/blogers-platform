import express from 'express';
import setupApp from './setup-app';

export const app = express()
export default setupApp(app)

const PORT = process.env.PORT || 5002

app.listen(PORT, () => {
    console.log(`Serever is running on http://localhost:${PORT}`);
})