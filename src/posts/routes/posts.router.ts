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
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation.middleware";
import { sanitizeQueryParams } from "../../core/middlewares/validation/sanitize-query.middleware";
import { PostSortField } from "../input/post-sort-fields";
import { RequestHandler } from "express";
import { catchAsync } from "../../core/helpers/catchAsync.helper";
import { PARAMS_IDS } from "../../core/types/paramsIds";
import { COMMENTS_PATH } from "../../comments/constants/comments.paths";
import { createCommentForSpecificPostHandler } from "./handlers/createCommentForSpecificPost.handler";
import { commentInputDtoValidation } from "../../comments/validation/commentInput.validation";
import { getCommentListForSpecificPostHandler } from "./handlers/getCommentListForSpecificPost.handler";
import { CommentSortField } from "../../comments/input/commentSortFields";
import { accessTokenGuardMiddleware } from "../../auth/api/guards/access-token.guard.middleware";
import { superAdminGuardMiddleware } from "../../auth/api/guards/super-admin.guard.middleware";

export const postsRouter = Router({});

postsRouter
  //posts
  
  .get(
    POSTS_ROUTES.ROOT,
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    sanitizeQueryParams,
    catchAsync(getPostListHandler as unknown as RequestHandler)
  )

  .get(
    POSTS_ROUTES.BY_ID,
    idValidation(PARAMS_IDS.ID),
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
    idValidation(PARAMS_IDS.ID),
    inputValidationResultMiddleware,
    catchAsync(deletePostByIdHandler),
  )

  // comments

  .post(
    `${POSTS_ROUTES.ROOT}${POSTS_ROUTES.BY_POST_ID}${COMMENTS_PATH}`,
    accessTokenGuardMiddleware,
    idValidation(PARAMS_IDS.POST_ID),
    commentInputDtoValidation,
    inputValidationResultMiddleware,
    catchAsync(createCommentForSpecificPostHandler)
  )

  .get(
    `${POSTS_ROUTES.ROOT}${POSTS_ROUTES.BY_POST_ID}${COMMENTS_PATH}`,
    idValidation(PARAMS_IDS.POST_ID),
    paginationAndSortingValidation(CommentSortField),
    inputValidationResultMiddleware,
    sanitizeQueryParams,
    catchAsync(getCommentListForSpecificPostHandler as unknown as RequestHandler)
  )
