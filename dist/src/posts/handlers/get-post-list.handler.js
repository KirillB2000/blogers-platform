"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostListHandler = void 0;
const posts_repository_1 = require("../repositories/posts.repository");
const getPostListHandler = (req, res) => {
    res.status(200).json(posts_repository_1.postsRepository.findAll());
};
exports.getPostListHandler = getPostListHandler;
