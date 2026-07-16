"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const getPostList_handler_1 = require("./handlers/getPostList.handler");
const posts_paths_1 = require("../constants/posts.paths");
const getPostById_handler_1 = require("./handlers/getPostById.handler");
const createPost_handler_1 = require("./handlers/createPost.handler");
const updatePostById_handler_1 = require("./handlers/updatePostById.handler");
const deletePostById_handler_1 = require("./handlers/deletePostById.handler");
const params_id_validation_middleware_1 = require("../../core/middlewares/validation/params-id.validation.middleware");
const input_validation_result_middleware_1 = require("../../core/middlewares/validation/input-validation-result.middleware");
const post_input_validation_middleware_1 = require("../validation/post-input.validation.middleware");
const super_admin_guard_middleware_1 = require("../../auth/middlewares/super-admin.guard.middleware");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter
    .get(posts_paths_1.POSTS_ROUTES.ROOT, getPostList_handler_1.getPostListHandler)
    .get(posts_paths_1.POSTS_ROUTES.BY_ID, params_id_validation_middleware_1.idValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, getPostById_handler_1.getPostByIdHandler)
    .post(posts_paths_1.POSTS_ROUTES.ROOT, super_admin_guard_middleware_1.superAdminGuardMiddleware, post_input_validation_middleware_1.postInputDtoValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, createPost_handler_1.createPost)
    .put(posts_paths_1.POSTS_ROUTES.BY_ID, super_admin_guard_middleware_1.superAdminGuardMiddleware, post_input_validation_middleware_1.postInputDtoValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, updatePostById_handler_1.updatePostById)
    .delete(posts_paths_1.POSTS_ROUTES.BY_ID, super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, deletePostById_handler_1.deletePostById);
