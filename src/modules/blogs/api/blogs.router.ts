import { RequestHandler, Router } from "express";
import { BLOGS_ROUTES } from "../constants/blogs.paths";
import { superAdminGuardMiddleware } from "../../auth/api/guards/super-admin.guard.middleware";
import { catchAsync } from "../../../core/helpers/catchAsync.helper";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idParamsValidation } from "../../../core/middlewares/validation/params-id.validation.middleware";
import { paginationAndSortingValidation } from "../../../core/middlewares/validation/query-pagination-sorting.validation.middleware";
import { sanitizeQueryParams } from "../../../core/middlewares/validation/sanitize-query.middleware";
import { PARAMS_IDS } from "../../../core/types/paramsIds";
import { PostSortField } from "../../posts/api/input/post-sort-fields";
import { POSTS_PATH } from "../../posts/constants/posts.paths";
import { postBlogInputDtoValidation } from "../../posts/validation/post-input.validation.middleware";
import { blogInputDtoValidation } from "../validation/blog-input.validation.middleware";
import { BlogSortField } from "./input/blog-sort-field";
import { container } from "../../../compostion-root";
import { BlogsController } from "./blogs.controller";

export const blogsRouter = Router({});

const blogsController = container.get(BlogsController)

blogsRouter
  .get(
    BLOGS_ROUTES.ROOT,
    paginationAndSortingValidation(BlogSortField),
    inputValidationResultMiddleware,
    sanitizeQueryParams,
    catchAsync(blogsController.getBlogListHandler.bind(blogsController) as unknown as RequestHandler)
  )

  .get(
    `${BLOGS_ROUTES.BY_BLOG_ID}${POSTS_PATH}`,
    idParamsValidation('blogId'),
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    sanitizeQueryParams,
    catchAsync(blogsController.getPostListForSpecificBlog.bind(blogsController) as unknown as RequestHandler)
  )

  .get(
    BLOGS_ROUTES.BY_ID,
    idParamsValidation(PARAMS_IDS.ID),
    inputValidationResultMiddleware,
    catchAsync(blogsController.getBlogByIdHandler.bind(blogsController)),
  )

  .post(
    BLOGS_ROUTES.ROOT,
    superAdminGuardMiddleware,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    catchAsync(blogsController.createBlogHandler.bind(blogsController)),
  )

  .post(
    `${BLOGS_ROUTES.BY_BLOG_ID}${POSTS_PATH}`,
    superAdminGuardMiddleware,
    idParamsValidation(PARAMS_IDS.BLOG_ID),
    postBlogInputDtoValidation,
    inputValidationResultMiddleware,
    catchAsync(blogsController.createPostForSpecificBlogHandler.bind(blogsController)),
  )

  .put(
    BLOGS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    idParamsValidation(PARAMS_IDS.ID),
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    catchAsync(blogsController.updateBlogByIdHandler.bind(blogsController)),
  )

  .delete(
    BLOGS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    idParamsValidation(PARAMS_IDS.ID),
    inputValidationResultMiddleware,
    catchAsync(blogsController.deleteBlogByIdHandler.bind(blogsController)),
  );
