"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const setupSwagger = (app) => {
    // Загружаем все YAML файлы
    const baseDir = path_1.default.resolve(process.cwd(), 'src/swagger');
    const swaggerBase = js_yaml_1.default.load(fs_1.default.readFileSync(path_1.default.resolve(baseDir, 'swagger.yaml'), 'utf8'));
    const blogsPaths = js_yaml_1.default.load(fs_1.default.readFileSync(path_1.default.resolve(baseDir, 'paths/blogs.yaml'), 'utf8'));
    const postsPaths = js_yaml_1.default.load(fs_1.default.readFileSync(path_1.default.resolve(baseDir, 'paths/posts.yaml'), 'utf8'));
    const testingPaths = js_yaml_1.default.load(fs_1.default.readFileSync(path_1.default.resolve(baseDir, 'paths/testing.yaml'), 'utf8'));
    const schemas = js_yaml_1.default.load(fs_1.default.readFileSync(path_1.default.resolve(baseDir, 'components/schemas.yaml'), 'utf8'));
    const securitySchemes = js_yaml_1.default.load(fs_1.default.readFileSync(path_1.default.resolve(baseDir, 'components/securitySchemes.yaml'), 'utf8'));
    // Собираем итоговый объект спецификации
    const swaggerDocument = Object.assign(Object.assign({}, swaggerBase), { paths: Object.assign(Object.assign(Object.assign({}, (blogsPaths.paths || {})), (postsPaths.paths || {})), (testingPaths.paths || {})), components: Object.assign(Object.assign({}, (schemas.components || {})), (securitySchemes.components || {})) });
    app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    }));
};
exports.setupSwagger = setupSwagger;
