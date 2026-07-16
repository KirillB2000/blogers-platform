"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = void 0;
const blogs_repository_1 = require("../../blogs/repositories/blogs.repository");
const http_statuses_1 = require("../../core/types/http-statuses");
const posts_repository_1 = require("../repositories/posts.repository");
const createPost = (req, res) => {
    const blogByPostId = blogs_repository_1.blogsRepository.findById(req.body.blogId);
    if (!blogByPostId) {
        res.status(http_statuses_1.httpStatuses.BadRequest).json({ message: 'Blog not found', field: 'blogID' }); // Переписать на errorHadler
        return;
    }
    const newPost = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: blogByPostId.name
    };
    posts_repository_1.postsRepository.create(newPost);
};
exports.createPost = createPost;
