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
const express_1 = __importDefault(require("express"));
const setup_app_1 = __importDefault(require("../../../src/setup-app"));
const supertest_1 = __importDefault(require("supertest"));
const http_statuses_1 = require("../../../src/core/types/http-statuses");
const createPostDto_1 = require("../../utils/posts/createPostDto");
const posts_paths_1 = require("../../../src/posts/constants/posts.paths");
const getPostByID_1 = require("../../utils/posts/getPostByID");
const createBlogDto_1 = require("../../utils/blogs/createBlogDto");
const updatePostById_1 = require("../../utils/posts/updatePostById");
const clearDb_1 = require("../../utils/clearDb");
const generateBasicAuthToken_1 = require("../../utils/generateBasicAuthToken");
const mongo_db_1 = require("../../../src/db/mongo.db");
const config_1 = require("../../../src/settings/config");
describe("Posts API", () => {
    const app = (0, express_1.default)();
    (0, setup_app_1.default)(app);
    const adminToken = (0, generateBasicAuthToken_1.generateBasicAuthToken)();
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mongo_db_1.runDB)(config_1.SETTINGS.MONGO_URL);
        yield (0, clearDb_1.clearDb)(app);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mongo_db_1.stopDb)();
    }));
    it("Should create new post; POST /api/posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdPost = yield (0, createPostDto_1.createPostDto)(app);
        expect(createdPost).toEqual({
            id: expect.any(String),
            title: "Test title",
            shortDescription: "Test description",
            content: "Test content",
            blogId: expect.any(String),
            blogName: expect.any(String),
            createdAt: expect.any(String)
        });
    }));
    it("Should get post list; GET /api/posts", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, createPostDto_1.createPostDto)(app);
        yield (0, createPostDto_1.createPostDto)(app);
        const response = yield (0, supertest_1.default)(app).get(posts_paths_1.POSTS_PATH).expect(http_statuses_1.httpStatuses.Ok);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThanOrEqual(2);
    }));
    it("Shold get post by id; GET /api/posts/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdPost = yield (0, createPostDto_1.createPostDto)(app);
        const postById = yield (0, getPostByID_1.getPostById)(app, createdPost.id);
        expect(postById).toEqual({
            id: expect.any(String),
            title: "Test title",
            shortDescription: "Test description",
            content: "Test content",
            blogId: expect.any(String),
            blogName: expect.any(String),
            createdAt: expect.any(String)
        });
    }));
    it("Should update post by id; PUT /api/post/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdPost = yield (0, createPostDto_1.createPostDto)(app);
        const createBlog = yield (0, createBlogDto_1.createBlogDto)(app);
        const postDataDtoForChange = {
            title: "Updated title2",
            shortDescription: "Updated description2",
            content: "Updated content2",
            blogId: createBlog.id,
        };
        yield (0, updatePostById_1.updatePostById)(app, createdPost.id, postDataDtoForChange);
        const updatedPost = yield (0, getPostByID_1.getPostById)(app, createdPost.id);
        expect(updatedPost).toEqual({
            id: createdPost.id,
            title: postDataDtoForChange.title,
            shortDescription: postDataDtoForChange.shortDescription,
            content: postDataDtoForChange.content,
            blogId: createBlog.id,
            blogName: createBlog.name,
            createdAt: expect.any(String)
        });
    }));
    it("Should delete post by id; DELETE /api/post/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const existedPost = yield (0, createPostDto_1.createPostDto)(app);
        yield (0, supertest_1.default)(app)
            .delete(`${posts_paths_1.POSTS_PATH}/${existedPost.id}`)
            .set("Authorization", adminToken)
            .expect(http_statuses_1.httpStatuses.NoContent);
        yield (0, supertest_1.default)(app)
            .get(`${posts_paths_1.POSTS_PATH}/${existedPost.id}`)
            .expect(http_statuses_1.httpStatuses.NotFound);
    }));
});
