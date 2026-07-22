import { Router } from "express";
import { getPostListHandler } from "./handlers/getPostList.handler";
import { POSTS_ROUTES } from "../constants/posts.paths";
import { getPostByIdHandler } from "./handlers/getPostById.handler";
import { createPost } from "./handlers/createPost.handler";
import { updatePostById } from "./handlers/updatePostById.handler";
import { deletePostById } from "./handlers/deletePostById.handler";
import { idValidation } from "../../core/middlewares/validation/params-id.validation.middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { postInputDtoValidation } from "../validation/post-input.validation.middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard.middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation.middleware";
import { sanitizeQueryParams } from "../../core/middlewares/validation/sanitize-query.middleware";
import { PostSortField } from "./input/post-sort-fields";
import { RequestHandler } from "express";

export const postsRouter = Router({});

postsRouter
  .get(
    POSTS_ROUTES.ROOT,
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    sanitizeQueryParams,
    getPostListHandler as unknown as RequestHandler
  )

  .get(
    POSTS_ROUTES.BY_ID,
    idValidation,
    inputValidationResultMiddleware,
    getPostByIdHandler,
  )

  .post(
    POSTS_ROUTES.ROOT,
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    createPost,
  )

  .put(
    POSTS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    updatePostById,
  )

  .delete(
    POSTS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deletePostById,
  );
