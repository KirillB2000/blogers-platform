import { Router } from "express"
import { getPostListHandler } from "./handlers/getPostList.handler"
import { POSTS_ROUTES } from "../constants/posts.paths"
import { getPostByIdHandler } from "./handlers/getPostById.handler"
import { createPost } from "./handlers/createPost.handler"
import { updatePostById } from "./handlers/updatePostById.handler"
import { deletePostById } from "./handlers/deletePostById,handler"



export const postsRouter = (Router({}))

postsRouter
    .get('', getPostListHandler)
    .get(POSTS_ROUTES.BY_ID, getPostByIdHandler)
    .post('', createPost)
    .put(POSTS_ROUTES.BY_ID, updatePostById)
    .delete(POSTS_ROUTES.BY_ID, deletePostById)