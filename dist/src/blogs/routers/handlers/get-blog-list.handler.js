"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogListHanlder = void 0;
const blogs_repository_1 = require("../../repositories/blogs.repository");
const getBlogListHanlder = (req, res) => {
    res.status(200).json(blogs_repository_1.blogsRepository.findAll());
};
exports.getBlogListHanlder = getBlogListHanlder;
