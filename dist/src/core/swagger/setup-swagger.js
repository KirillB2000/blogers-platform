"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
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
const setupSwagger = (app) => {
    // Эндпоинт для динамической генерации спецификации при каждом запросе
    app.get("/api/docs/spec.json", (_req, res) => {
        const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
        res.json(swaggerSpec);
    });
    // Swagger UI загружает спецификацию по URL, а не из статического объекта
    app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(null, {
        swaggerOptions: {
            url: "/api/docs/spec.json",
        },
    }));
};
exports.setupSwagger = setupSwagger;
