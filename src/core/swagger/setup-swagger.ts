import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bloggers Platform API",
      version: "1.0.0",
      description: "API for managing blogs and posts",
    },
  },
  // swagger-jsdoc собирает документацию из всех *.swagger.yml файлов проекта.
  apis: ["./src/**/*.swagger.yml"],
};

// Подключает Swagger UI по адресу /api/docs.
export const setupSwagger = (app: Express) => {
  // Эндпоинт для динамической генерации спецификации при каждом запросе
  app.get("/api/docs/spec.json", (_req, res) => {
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    res.json(swaggerSpec);
  });

  // Swagger UI загружает спецификацию по URL, а не из статического объекта
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(null, {
      swaggerOptions: {
        url: "/api/docs/spec.json",
      },
    }),
  );
};
