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
const blogs_paths_1 = require("../../../src/blogs/constants/blogs.paths");
const blogDto_1 = require("../../utils/blogs/blogDto");
const createBlogDto_1 = require("../../utils/blogs/createBlogDto");
const updateBlogById_1 = require("../../utils/blogs/updateBlogById");
const getBlogById_1 = require("../../utils/blogs/getBlogById");
const clearDb_1 = require("../../utils/clearDb");
const generateBasicAuthToken_1 = require("../../utils/generateBasicAuthToken");
const mongo_db_1 = require("../../../src/db/mongo.db");
const config_1 = require("../../../src/settings/config");
describe("Blogs API", () => {
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
    it("Should create new blog; POST /api/blogs", () => __awaiter(void 0, void 0, void 0, function* () {
        const newBlogDto = Object.assign(Object.assign({}, (0, blogDto_1.blogDto)()), { name: "Test name2", description: "Test description2", websiteUrl: "https://example2.com" });
        const createdBlog = yield (0, createBlogDto_1.createBlogDto)(app, newBlogDto);
        expect(createdBlog).toEqual({
            id: expect.any(String),
            name: "Test name2",
            description: "Test description2",
            websiteUrl: expect.stringMatching(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/),
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean)
        });
    }));
    it("Should get blog list; GET /api/blogs", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, createBlogDto_1.createBlogDto)(app);
        yield (0, createBlogDto_1.createBlogDto)(app);
        const response = yield (0, supertest_1.default)(app).get(blogs_paths_1.BLOGS_PATH).expect(http_statuses_1.httpStatuses.Ok);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThanOrEqual(2);
    }));
    it("Should get blog by id; GET /api/blogs/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdBlog = yield (0, createBlogDto_1.createBlogDto)(app);
        const blogById = yield (0, getBlogById_1.getBlogById)(app, createdBlog.id);
        expect(blogById).toEqual({
            id: expect.any(String),
            name: "Test name",
            description: "Test description",
            websiteUrl: expect.stringMatching(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/),
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean)
        });
    }));
    it("Should update blog by id; PUT /api/blogs/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdBlog = yield (0, createBlogDto_1.createBlogDto)(app);
        const updateBlogDto = Object.assign(Object.assign({}, (0, blogDto_1.blogDto)()), { name: "Updated name", description: "Updated description", websiteUrl: "https://updatedexample2.com" });
        yield (0, updateBlogById_1.updateBlogById)(app, createdBlog.id, updateBlogDto);
        const updatedBlog = yield (0, getBlogById_1.getBlogById)(app, createdBlog.id);
        expect(updatedBlog).toEqual({
            id: expect.any(String),
            name: updateBlogDto.name,
            description: updateBlogDto.description,
            websiteUrl: updateBlogDto.websiteUrl,
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean)
        });
    }));
    it("Should delete blog by id; DELETE /api/blogs/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const existedBlog = yield (0, createBlogDto_1.createBlogDto)(app);
        yield (0, supertest_1.default)(app)
            .delete(`${blogs_paths_1.BLOGS_PATH}/${existedBlog.id}`)
            .set("Authorization", adminToken)
            .expect(http_statuses_1.httpStatuses.NoContent);
        yield (0, supertest_1.default)(app)
            .get(`${blogs_paths_1.BLOGS_PATH}/${existedBlog.id}`)
            .expect(http_statuses_1.httpStatuses.NotFound);
    }));
});
