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
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopDb = exports.client = void 0;
exports.runDB = runDB;
const mongodb_1 = require("mongodb");
const config_1 = require("../settings/config");
const collections_1 = require("./collections");
// Подключение к БД
function runDB(url) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.client = new mongodb_1.MongoClient(url);
        const db = exports.client.db(config_1.SETTINGS.DB_NAME);
        try {
            yield exports.client.connect();
            yield db.command({ ping: 1 });
            // Инициализируем коллекции из подключённой базы.
            (0, collections_1.initCollections)(db);
            console.log('✅ Connected to the database');
        }
        catch (e) {
            yield exports.client.close();
            throw new Error(`❌ Database not connected: ${e}`);
        }
    });
}
const stopDb = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!exports.client) {
        throw new Error(`❌ No active client`);
    }
    yield exports.client.close();
});
exports.stopDb = stopDb;
