import { Router } from "express"
import { getPostListHandler } from "../handlers/getPostList.handler"
import { POSTS_ROUTES } from "../constants/posts.paths"
import { getPostByIdHandler } from "../handlers/getPostByIdHandler.handler"
import { createPost } from "../handlers/createPost.handler"



export const postsRouter = (Router({}))

postsRouter
    .get('', getPostListHandler)
    .get(POSTS_ROUTES.BY_ID, getPostByIdHandler)
    .post('', createPost)