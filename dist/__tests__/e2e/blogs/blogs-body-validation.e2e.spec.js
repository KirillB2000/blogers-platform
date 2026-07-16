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
const supertest_1 = __importDefault(require("supertest"));
const setup_app_1 = __importDefault(require("../../../src/setup-app"));
const clearDb_1 = require("../../utils/clearDb");
const blogs_paths_1 = require("../../../src/blogs/constants/blogs.paths");
const http_statuses_1 = require("../../../src/core/types/http-statuses");
const createBlogDto_1 = require("../../utils/blogs/createBlogDto");
const generateBasicAuthToken_1 = require("../../utils/generateBasicAuthToken");
const mongo_db_1 = require("../../../src/db/mongo.db");
const config_1 = require("../../../src/settings/config");
describe("Blogs API body validation check", () => {
    const app = (0, express_1.default)();
    (0, setup_app_1.default)(app);
    const correctBlogInputData = {
        name: "correct name",
        description: "correct description",
        websiteUrl: "https://correctexample.com",
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mongo_db_1.runDB)(config_1.SETTINGS.MONGO_URL);
        yield (0, clearDb_1.clearDb)(app);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, clearDb_1.clearDb)(app);
        yield (0, mongo_db_1.stopDb)();
    }));
    it("Should not create blog without authorization", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdBlog = yield (0, supertest_1.default)(app)
            .post(blogs_paths_1.BLOGS_PATH)
            .send(Object.assign({}, correctBlogInputData))
            .expect(http_statuses_1.httpStatuses.Unauthorized);
        expect(createdBlog.body).toEqual({});
    }));
    it("Should not create blog with incorrect input data", () => __awaiter(void 0, void 0, void 0, function* () {
        const incorrectBlogBodyInput1 = yield (0, supertest_1.default)(app)
            .post(blogs_paths_1.BLOGS_PATH)
            .set("Authorization", (0, generateBasicAuthToken_1.generateBasicAuthToken)())
            .send(Object.assign(Object.assign({}, correctBlogInputData), { name: "    ", description: "", websiteUrl: "dasfasdf" }))
            .expect(http_statuses_1.httpStatuses.BadRequest);
        expect(incorrectBlogBodyInput1.body.errorsMessages).toHaveLength(3);
    }));
    it("Should not update blog with incorrect input data", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdBlog = yield (0, createBlogDto_1.createBlogDto)(app);
        const incorrectBlogBodyInput1 = yield (0, supertest_1.default)(app)
            .put(`${blogs_paths_1.BLOGS_PATH}/${createdBlog.id}`)
            .set("Authorization", (0, generateBasicAuthToken_1.generateBasicAuthToken)())
            .send(Object.assign(Object.assign({}, correctBlogInputData), { name: "    ", description: "", websiteUrl: "dasfasdf" }))
            .expect(http_statuses_1.httpStatuses.BadRequest);
        expect(incorrectBlogBodyInput1.body.errorsMessages).toHaveLength(3);
    }));
});
