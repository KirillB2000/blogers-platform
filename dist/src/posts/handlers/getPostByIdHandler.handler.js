"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostByIdHandler = void 0;
const posts_repository_1 = require("../repositories/posts.repository");
const http_statuses_1 = require("../../core/types/http-statuses");
const getPostByIdHandler = (req, res) => {
    const postId = req.params.id.toString();
    const post = posts_repository_1.postsRepository.findById(postId);
    if (!post) {
        res.sendStatus(http_statuses_1.httpStatuses.NotFound);
        return;
    }
    res.status(http_statuses_1.httpStatuses.Ok).json(post);
};
exports.getPostByIdHandler = getPostByIdHandler;
