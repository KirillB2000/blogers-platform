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
exports.clearDb = void 0;
const supertest_1 = __importDefault(require("supertest"));
const testing_paths_1 = require("../../src/testing/constants/testing.paths");
const http_statuses_1 = require("../../src/core/types/http-statuses");
const clearDb = (app) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app)
        .delete(`${testing_paths_1.TESTING_PATH}${testing_paths_1.TESTING_ROUTES.ALL_DATA}`)
        .expect(http_statuses_1.httpStatuses.NoContent);
});
exports.clearDb = clearDb;
