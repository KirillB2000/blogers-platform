import { Express } from "express"
import { blogInputModel } from "../../../src/blogs/dto/blogInputModel"
import request from 'supertest'
import { BLOGS_PATH } from "../../../src/blogs/constants/blogs.paths"
import { httpStatuses } from "../../../src/core/types/http-statuses"
import { getBlogDto } from "./getBlogDto"
import { json } from "node:stream/consumers"


export const createBlog = async (app: Express, inputForBlog?: blogInputModel) => {
    const testBlogData: blogInputModel = {...getBlogDto(), ...inputForBlog}

    const createdBlogResponse = await request(app)
                .post(BLOGS_PATH)
                .send(testBlogData)
                .expect(httpStatuses.Created)

    return createdBlogResponse.body
}