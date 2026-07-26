import { RequestHandler, Router } from "express";
import { getBlogListHandler } from "./handlers/getBlogList.handler";
import { BLOGS_ROUTES } from "../constants/blogs.paths";
import { getBlogByIdHandler } from "./handlers/getBlogById.handler";
import { createBlogHandler } from "./handlers/createBlog.handler";
import {updateBlogByIdHandler } from "./handlers/updateBlogById.handler";
import { idValidation } from "../../core/middlewares/validation/params-id.validation.middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { blogInputDtoValidation } from "../validation/blog-input.validation.middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard.middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation.middleware";
import { BlogSortField } from "./input/blog-sort-field";
import { sanitizeQueryParams } from "../../core/middlewares/validation/sanitize-query.middleware";
import { POSTS_PATH } from "../../posts/constants/posts.paths";
import { postBlogInputDtoValidation } from "../../posts/validation/post-input.validation.middleware";
import { createPostForSpecificBlogHandler } from "./handlers/createPostForSpecificBlog.handler";
import { PostSortField } from "../../posts/routes/input/post-sort-fields";
import { getPostListForSpecificBlog } from "./handlers/getPostListForSpecificBlog.handler";
import { catchAsync } from "../../core/helpers/catchAsync.helper";
import { deleteBlogByIdHandler } from "./handlers/deleteBlogById.handler";

export const blogsRouter = Router({});

blogsRouter
  .get(
    BLOGS_ROUTES.ROOT,
    paginationAndSortingValidation(BlogSortField),
    inputValidationResultMiddleware,
    sanitizeQueryParams,
    catchAsync(getBlogListHandler as unknown as RequestHandler)
  )

  .get(
    `${BLOGS_ROUTES.BY_BLOG_ID}${POSTS_PATH}`,
    idValidation('blogId'),
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    sanitizeQueryParams,
    catchAsync(getPostListForSpecificBlog as unknown as RequestHandler)
  )

  .get(
    BLOGS_ROUTES.BY_ID,
    idValidation('id'),
    inputValidationResultMiddleware,
    catchAsync(getBlogByIdHandler),
  )

  .post(
    BLOGS_ROUTES.ROOT,
    superAdminGuardMiddleware,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    catchAsync(createBlogHandler),
  )

  .post(
    `${BLOGS_ROUTES.BY_BLOG_ID}${POSTS_PATH}`,
    idValidation('blogId'),
    superAdminGuardMiddleware,
    postBlogInputDtoValidation,
    inputValidationResultMiddleware,
    catchAsync(createPostForSpecificBlogHandler),
  )

  .put(
    BLOGS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    catchAsync(updateBlogByIdHandler),
  )

  .delete(
    BLOGS_ROUTES.BY_ID,
    idValidation('id'),
    superAdminGuardMiddleware,
    inputValidationResultMiddleware,
    catchAsync(deleteBlogByIdHandler),
  );
