"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogs_routers_1 = require("./blogs/routers/blogs.routers");
const posts_router_1 = require("./posts/routers/posts.router");
const blogs_paths_1 = require("./blogs/constants/blogs.paths");
const posts_paths_1 = require("./posts/constants/posts.paths");
const testing_paths_1 = require("./testing/constants/testing.paths");
const testing_router_1 = require("./testing/routers/testing.router");
const setup_swagger_1 = require("./core/swagger/setup-swagger");
const setupApp = (app) => {
    app.use(express_1.default.json());
    (0, setup_swagger_1.setupSwagger)(app);
    app.use(blogs_paths_1.BLOGS_PATH, blogs_routers_1.blogsRouter);
    app.use(posts_paths_1.POSTS_PATH, posts_router_1.postsRouter);
    app.use(testing_paths_1.TESTING_PATH, testing_router_1.testingRouter);
    return app;
};
exports.default = setupApp;
