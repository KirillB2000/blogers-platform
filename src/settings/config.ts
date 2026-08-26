const env = process.env;

export const ADMIN_USERNAME = env.ADMIN_USERNAME;
export const ADMIN_PASSWORD = env.ADMIN_PASSWORD;

export const SETTINGS = {
    PORT: env.PORT || 5006,
    VERCEL: env.VERCEL,
    DB_NAME: env.DB_NAME,
    MONGO_URL: env.MONGO_URL || '', // Убрать || '' в settings проверкой
    JWT_ACCESS_SECRET: env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: env.JWT_REFRESH_SECRET,
    EMAIL: env.EMAIL,
    EMAIL_PASSWORD: env.EMAIL_PASSWORD
};