const env = process.env;

export const ADMIN_USERNAME = env.ADMIN_USERNAME || "admin";
export const ADMIN_PASSWORD = env.ADMIN_PASSWORD || "qwerty";

export const SETTINGS = {
  PORT: env.PORT || 5002,
  VERCEL: env.VERCEL,
  DB_NAME: env.DB_NAME || 'blogers-platform',
  MONGO_URL: env.MONGO_URL || 'mongodb://test:test@ac-ojrvsaj-shard-00-00.7rebcxk.mongodb.net:27017,ac-ojrvsaj-shard-00-01.7rebcxk.mongodb.net:27017,ac-ojrvsaj-shard-00-02.7rebcxk.mongodb.net:27017/?ssl=true&replicaSet=atlas-zhxj62-shard-0&authSource=admin&appName=Cluster0'
};
