import { RequestHandler, Router } from "express";
import { getPostListHandler } from "./handlers/getPostList.handler";
import { POSTS_ROUTES } from "../constants/posts.paths";
import { getPostByIdHandler } from "./handlers/getPostById.handler";
import { createPostHandler } from "./handlers/createPost.handler";
import { updatePostByIdHandler } from "./handlers/updatePostById.handler";
import { deletePostByIdHandler } from "./handlers/deletePostById.handler";
import { catchAsync } from "../../../core/helpers/catchAsync.helper";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id.validation.middleware";
import { paginationAndSortingValidation } from "../../../core/middlewares/validation/query-pagination-sorting.validation.middleware";
import { sanitizeQueryParams } from "../../../core/middlewares/validation/sanitize-query.middleware";
import { PARAMS_IDS } from "../../../core/types/paramsIds";
import { accessTokenGuardMiddleware } from "../../auth/api/guards/access-token.guard.middleware";
import { superAdminGuardMiddleware } from "../../auth/api/guards/super-admin.guard.middleware";
import { CommentSortField } from "../../comments/api/input/commentSortFields";
import { COMMENTS_PATH } from "../../comments/constants/comments.paths";
import { commentInputDtoValidation } from "../../comments/validation/commentInput.validation";
import { postInputDtoValidation } from "../validation/post-input.validation.middleware";
import { createCommentForSpecificPostHandler } from "./handlers/createCommentForSpecificPost.handler";
import { getCommentListForSpecificPostHandler } from "./handlers/getCommentListForSpecificPost.handler";
import { PostSortField } from "./input/post-sort-fields";

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
