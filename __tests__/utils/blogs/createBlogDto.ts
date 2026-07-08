import { Express } from "express"
import { blogInputModel } from "../../../src/blogs/dto/blogInputModel"
import request from 'supertest'
import { BLOGS_PATH } from "../../../src/blogs/constants/blogs.paths"
import { httpStatuses } from "../../../src/core/types/http-statuses"
import { blogDto } from "./blogDto"
import { blogViewModel } from "../../../src/blogs/types/blogViewModel"
import { generateBasicAuthToken } from "../generateBasicAuthToken"


export const createBlogDto = async (app: Express, inputForBlog?: blogInputModel): Promise<blogViewModel> => {
    const testBlogData: blogInputModel = {...blogDto(), ...inputForBlog}

    const createdBlogResponse = await request(app)
                .post(BLOGS_PATH)
                .set('Authorization', generateBasicAuthToken())
                .send(testBlogData)
                .expect(httpStatuses.Created)

    return createdBlogResponse.body
}