import { Router } from "express";
import { getPostListHandler } from "./handlers/getPostList.handler";
import { POSTS_ROUTES } from "../constants/posts.paths";
import { getPostByIdHandler } from "./handlers/getPostById.handler";
import { createPostHandler } from "./handlers/createPost.handler";
import { updatePostByIdHandler } from "./handlers/updatePostById.handler";
import { deletePostByIdHandler } from "./handlers/deletePostById.handler";
import { idValidation } from "../../core/middlewares/validation/params-id.validation.middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { postInputDtoValidation } from "../validation/post-input.validation.middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard.middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation.middleware";
import { sanitizeQueryParams } from "../../core/middlewares/validation/sanitize-query.middleware";
import { PostSortField } from "./input/post-sort-fields";
import { RequestHandler } from "express";
import { catchAsync } from "../../core/helpers/catchAsync.helper";

export const postsRouter = Router({});

postsRouter
  .get(
    POSTS_ROUTES.ROOT,
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    sanitizeQueryParams,
    catchAsync(getPostListHandler as unknown as RequestHandler)
  )

  .get(
    POSTS_ROUTES.BY_ID,
    idValidation('id'),
    inputValidationResultMiddleware,
    catchAsync(getPostByIdHandler),
  )

  .post(
    POSTS_ROUTES.ROOT,
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    catchAsync(createPostHandler),
  )

  .put(
    POSTS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    catchAsync(updatePostByIdHandler),
  )

  .delete(
    POSTS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    idValidation('id'),
    inputValidationResultMiddleware,
    catchAsync(deletePostByIdHandler),
  );
