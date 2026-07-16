"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostListHandler = void 0;
const posts_repository_1 = require("../repositories/posts.repository");
const http_statuses_1 = require("../../core/types/http-statuses");
const getPostListHandler = (req, res) => {
    res.status(http_statuses_1.httpStatuses.Ok).json(posts_repository_1.postsRepository.findAll());
};
exports.getPostListHandler = getPostListHandler;
