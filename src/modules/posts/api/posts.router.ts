import { RequestHandler, Router } from "express";
import { POSTS_ROUTES } from "../constants/posts.paths";
import { catchAsync } from "../../../core/helpers/catchAsync.helper";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idParamsValidation } from "../../../core/middlewares/validation/params-id.validation.middleware";
import { paginationAndSortingValidation } from "../../../core/middlewares/validation/query-pagination-sorting.validation.middleware";
import { sanitizeQueryParams } from "../../../core/middlewares/validation/sanitize-query.middleware";
import { PARAMS_IDS } from "../../../core/types/paramsIds";
import { accessTokenGuardMiddleware } from "../../auth/api/guards/access-token.guard.middleware";
import { superAdminGuardMiddleware } from "../../auth/api/guards/super-admin.guard.middleware";
import { CommentSortField } from "../../comments/api/input/commentSortFields";
import { COMMENTS_PATH } from "../../comments/constants/comments.paths";
import { commentInputDtoValidation } from "../../comments/validation/commentInput.validation";
import { postInputDtoValidation } from "../validation/post-input.validation.middleware";
import { PostSortField } from "./input/post-sort-fields";
import { postsController } from "../../../compostion-root";

export const postsRouter = Router({});

postsRouter
  //posts
  
  .get(
    POSTS_ROUTES.ROOT,
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    sanitizeQueryParams,
    catchAsync(postsController.getPostListHandler.bind(postsController) as unknown as RequestHandler)
  )

  .get(
    POSTS_ROUTES.BY_ID,
    idParamsValidation(PARAMS_IDS.ID),
    inputValidationResultMiddleware,
    catchAsync(postsController.getPostByIdHandler.bind(postsController)),
  )

  .post(
    POSTS_ROUTES.ROOT,
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    catchAsync(postsController.createPostHandler.bind(postsController)),
  )

  .put(
    POSTS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    catchAsync(postsController.updatePostByIdHandler.bind(postsController)),
  )

  .delete(
    POSTS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    idParamsValidation(PARAMS_IDS.ID),
    inputValidationResultMiddleware,
    catchAsync(postsController.deletePostByIdHandler.bind(postsController)),
  )

  // comments

  .post(
    `${POSTS_ROUTES.ROOT}${POSTS_ROUTES.BY_POST_ID}${COMMENTS_PATH}`,
    accessTokenGuardMiddleware,
    idParamsValidation(PARAMS_IDS.POST_ID),
    commentInputDtoValidation,
    inputValidationResultMiddleware,
    catchAsync(postsController.createCommentForSpecificPostHandler.bind(postsController))
  )

  .get(
    `${POSTS_ROUTES.ROOT}${POSTS_ROUTES.BY_POST_ID}${COMMENTS_PATH}`,
    idParamsValidation(PARAMS_IDS.POST_ID),
    paginationAndSortingValidation(CommentSortField),
    inputValidationResultMiddleware,
    sanitizeQueryParams,
    catchAsync(postsController.getCommentListForSpecificPostHandler.bind(postsController) as unknown as RequestHandler)
  )
