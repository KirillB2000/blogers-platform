import { RequestHandler, Router } from "express";
import { getBlogListHandler } from "./handlers/getBlogList.handler";
import { BLOGS_ROUTES } from "../constants/blogs.paths";
import { getBlogByIdHandler } from "./handlers/getBlogById.handler";
import { createBlogHandler } from "./handlers/createBlog.handler";
import { updateBlogById } from "./handlers/updateBlogById.handler";
import { deleteBlogById } from "./handlers/deleteBlogById.handler";
import { idValidation } from "../../core/middlewares/validation/params-id.validation.middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { blogInputDtoValidation } from "../validation/blog-input.validation.middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard.middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation.middleware";
import { BlogSortField } from "./input/blog-sort-field";
import { sanitizeQueryParams } from "../../core/middlewares/validation/sanitize-query.middleware";

export const blogsRouter = Router({});

blogsRouter
  .get(
    BLOGS_ROUTES.ROOT,
    paginationAndSortingValidation(BlogSortField),
    inputValidationResultMiddleware,
    sanitizeQueryParams,
    getBlogListHandler as unknown as RequestHandler
  )

  .get(
    BLOGS_ROUTES.BY_ID,
    idValidation,
    inputValidationResultMiddleware,
    getBlogByIdHandler,
  )

  .post(
    BLOGS_ROUTES.ROOT,
    superAdminGuardMiddleware,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    createBlogHandler,
  )

  .put(
    BLOGS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    updateBlogById,
  )

  .delete(
    BLOGS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteBlogById,
  );
