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
exports.createBlogDto = void 0;
const supertest_1 = __importDefault(require("supertest"));
const blogs_paths_1 = require("../../../src/blogs/constants/blogs.paths");
const http_statuses_1 = require("../../../src/core/types/http-statuses");
const blogDto_1 = require("./blogDto");
const generateBasicAuthToken_1 = require("../generateBasicAuthToken");
const createBlogDto = (app, inputForBlog) => __awaiter(void 0, void 0, void 0, function* () {
    const testBlogData = Object.assign(Object.assign({}, (0, blogDto_1.blogDto)()), inputForBlog);
    const createdBlogResponse = yield (0, supertest_1.default)(app)
        .post(blogs_paths_1.BLOGS_PATH)
        .set("Authorization", (0, generateBasicAuthToken_1.generateBasicAuthToken)())
        .send(testBlogData)
        .expect(http_statuses_1.httpStatuses.Created);
    return createdBlogResponse.body;
});
exports.createBlogDto = createBlogDto;
