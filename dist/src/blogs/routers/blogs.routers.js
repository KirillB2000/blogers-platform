"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const getBlogList_handler_1 = require("./handlers/getBlogList.handler");
const blogs_paths_1 = require("../constants/blogs.paths");
const getBlogById_handler_1 = require("./handlers/getBlogById.handler");
const createBlog_handler_1 = require("./handlers/createBlog.handler");
const updateBlogById_handler_1 = require("./handlers/updateBlogById.handler");
const deleteBlogById_handler_1 = require("./handlers/deleteBlogById.handler");
const params_id_validation_middleware_1 = require("../../core/middlewares/validation/params-id.validation.middleware");
const input_validation_result_middleware_1 = require("../../core/middlewares/validation/input-validation-result.middleware");
const blog_input_validation_middleware_1 = require("../validation/blog-input.validation.middleware");
const super_admin_guard_middleware_1 = require("../../auth/middlewares/super-admin.guard.middleware");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter
    .get(blogs_paths_1.BLOGS_ROUTES.ROOT, getBlogList_handler_1.getBlogListHandler)
    .get(blogs_paths_1.BLOGS_ROUTES.BY_ID, params_id_validation_middleware_1.idValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, getBlogById_handler_1.getBlogByIdHandler)
    .post(blogs_paths_1.BLOGS_ROUTES.ROOT, super_admin_guard_middleware_1.superAdminGuardMiddleware, blog_input_validation_middleware_1.blogInputDtoValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, createBlog_handler_1.createBlogHandler)
    .put(blogs_paths_1.BLOGS_ROUTES.BY_ID, super_admin_guard_middleware_1.superAdminGuardMiddleware, blog_input_validation_middleware_1.blogInputDtoValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, updateBlogById_handler_1.updateBlogById)
    .delete(blogs_paths_1.BLOGS_ROUTES.BY_ID, super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, deleteBlogById_handler_1.deleteBlogById);
