import { Router } from "express";
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

export const blogsRouter = Router({});

blogsRouter
  .get(BLOGS_ROUTES.ROOT, getBlogListHandler)

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
