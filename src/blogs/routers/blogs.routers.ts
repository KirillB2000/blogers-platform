import { Router } from "express";
import { getBlogListHanlder } from "./handlers/getBlogList.handler";
import { BLOGS_ROUTES } from "../constants/blogs.paths";
import { getBlogByIdHandler } from "./handlers/getBlogById.handler";
import { createBlogHandler } from "./handlers/createBlog.handler";
import { updateBlogById } from "./handlers/updateBlogById.handler";
import { deleteBlogById } from "./handlers/deleteBlogById.handler";


export const blogsRouter = (Router({}))

blogsRouter
    .get('', getBlogListHanlder)
    .get(BLOGS_ROUTES.BY_ID, getBlogByIdHandler)
    .post('', createBlogHandler)
    .put(BLOGS_ROUTES.BY_ID, updateBlogById)
    .delete(BLOGS_ROUTES.BY_ID, deleteBlogById)