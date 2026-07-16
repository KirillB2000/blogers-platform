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
const posts_paths_1 = require("../../../src/posts/constants/posts.paths");
const http_statuses_1 = require("../../../src/core/types/http-statuses");
const createPostDto_1 = require("../../utils/posts/createPostDto");
const generateBasicAuthToken_1 = require("../../utils/generateBasicAuthToken");
const mongo_db_1 = require("../../../src/db/mongo.db");
const config_1 = require("../../../src/settings/config");
describe("Posts API body validation check", () => {
    const app = (0, express_1.default)();
    (0, setup_app_1.default)(app);
    const correctPostInputData = {
        title: "Correct title",
        shortDescription: "TesCorrectt description",
        content: "Correct content",
        blogId: "1",
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mongo_db_1.runDB)(config_1.SETTINGS.MONGO_URL);
        yield (0, clearDb_1.clearDb)(app);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, clearDb_1.clearDb)(app);
        yield (0, mongo_db_1.stopDb)();
    }));
    it("Should not create post without authorization", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdPost = yield (0, supertest_1.default)(app)
            .post(posts_paths_1.POSTS_PATH)
            .send(Object.assign({}, correctPostInputData))
            .expect(http_statuses_1.httpStatuses.Unauthorized);
        expect(createdPost.body).toEqual({});
    }));
    it("Should not create post with incorrect input data", () => __awaiter(void 0, void 0, void 0, function* () {
        const incorrectPostBodyInput = yield (0, supertest_1.default)(app)
            .post(posts_paths_1.POSTS_PATH)
            .set("Authorization", (0, generateBasicAuthToken_1.generateBasicAuthToken)())
            .send(Object.assign(Object.assign({}, correctPostInputData), { title: "   ", shortDescription: 12, content: "", blogId: "123" }))
            .expect(http_statuses_1.httpStatuses.BadRequest);
        expect(incorrectPostBodyInput.body.errorsMessages).toHaveLength(4);
    }));
    it("Should not update post with incorrect input data", () => __awaiter(void 0, void 0, void 0, function* () {
        const post = yield (0, createPostDto_1.createPostDto)(app);
        const incorrectPostBodyInput = yield (0, supertest_1.default)(app)
            .put(`${posts_paths_1.POSTS_PATH}/${post.id}`)
            .set("Authorization", (0, generateBasicAuthToken_1.generateBasicAuthToken)())
            .send(Object.assign(Object.assign({}, correctPostInputData), { title: "   ", shortDescription: 12, content: "", blogId: "123" }))
            .expect(http_statuses_1.httpStatuses.BadRequest);
        expect(incorrectPostBodyInput.body.errorsMessages).toHaveLength(4);
    }));
});
