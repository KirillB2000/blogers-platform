"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const express_1 = __importDefault(require("express"));
const setup_app_1 = __importDefault(require("./setup-app"));
const config_1 = require("./settings/config");
const mongo_db_1 = require("./db/mongo.db");
let appInstance = null;
const bootstrap = () => __awaiter(void 0, void 0, void 0, function* () {
    if (appInstance)
        return appInstance;
    const app = (0, express_1.default)();
    (0, setup_app_1.default)(app);
    const PORT = config_1.SETTINGS.PORT;
    yield (0, mongo_db_1.runDB)(config_1.SETTINGS.MONGO_URL);
    if (!config_1.SETTINGS.VERCEL) {
        app.listen(PORT, () => {
            console.log(`Serever is running on http://localhost:${PORT}`);
        });
    }
    appInstance = app;
    return app;
});
// Запускаем при создании модуля — для Vercel это гарантирует,
// что app будет готов к моменту первого запроса
const appPromise = bootstrap();
// Экспортируем handler для Vercel
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield appPromise;
        return app(req, res);
    });
}
