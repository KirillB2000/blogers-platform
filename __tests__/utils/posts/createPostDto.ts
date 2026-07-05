import { Express } from "express"
import { postInputModel } from "../../../src/posts/dto/postInputModel"
import { createBlog } from "../blogs/createBlog"
import { getPostDto } from "./getPostDto"
import request from 'supertest'
import { POSTS_PATH } from "../../../src/posts/constants/posts.paths"
import { httpStatuses } from "../../../src/core/types/http-statuses"

export const createPostDto = async (app: Express, inputForPost?: postInputModel) => {
    const blog = await createBlog(app)

    const testPostData = {...getPostDto(blog.id), ...inputForPost}

    const createdPostResponse = await request(app)
        .post(POSTS_PATH)
        .send(testPostData)
        .expect(httpStatuses.Created)
    
    return createdPostResponse.body
}