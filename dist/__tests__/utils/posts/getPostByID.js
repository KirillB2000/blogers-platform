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
exports.getPostById = void 0;
const supertest_1 = __importDefault(require("supertest"));
const posts_paths_1 = require("../../../src/posts/constants/posts.paths");
const http_statuses_1 = require("../../../src/core/types/http-statuses");
const getPostById = (app, postId) => __awaiter(void 0, void 0, void 0, function* () {
    const postResponse = yield (0, supertest_1.default)(app)
        .get(`${posts_paths_1.POSTS_PATH}/${postId}`)
        .expect(http_statuses_1.httpStatuses.Ok);
    return postResponse.body;
});
exports.getPostById = getPostById;
