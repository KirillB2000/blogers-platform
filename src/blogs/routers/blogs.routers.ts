import { Router } from "express";
import { getBlogListHanlder } from "./handlers/getBlogList.handler";
import { BLOGS_ROUTES } from "../constants/blogs.paths";
import { getBlogByIdHandler } from "./handlers/getBlogById.handler";
import { createBlogHandler } from "./handlers/createBlog.handler";


export const blogsRouter = (Router({}))

blogsRouter
    .get('', getBlogListHanlder)
    .get(BLOGS_ROUTES.BY_ID, getBlogByIdHandler)
    .post('', createBlogHandler)