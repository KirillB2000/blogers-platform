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
exports.createPostDto = void 0;
const createBlogDto_1 = require("../blogs/createBlogDto");
const postDto_1 = require("./postDto");
const supertest_1 = __importDefault(require("supertest"));
const posts_paths_1 = require("../../../src/posts/constants/posts.paths");
const http_statuses_1 = require("../../../src/core/types/http-statuses");
const generateBasicAuthToken_1 = require("../generateBasicAuthToken");
const createPostDto = (app, inputForPost) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield (0, createBlogDto_1.createBlogDto)(app);
    const testPostData = Object.assign(Object.assign({}, (0, postDto_1.postDto)(blog.id)), inputForPost);
    const createdPostResponse = yield (0, supertest_1.default)(app)
        .post(posts_paths_1.POSTS_PATH)
        .set("Authorization", (0, generateBasicAuthToken_1.generateBasicAuthToken)())
        .send(testPostData)
        .expect(http_statuses_1.httpStatuses.Created);
    return createdPostResponse.body;
});
exports.createPostDto = createPostDto;
