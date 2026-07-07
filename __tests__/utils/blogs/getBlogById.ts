import { Express } from "express"
import { blogViewModel } from "../../../src/blogs/types/blogViewModel"
import { BLOGS_PATH } from "../../../src/blogs/constants/blogs.paths"
import request from "supertest"
import { httpStatuses } from "../../../src/core/types/http-statuses"

export const getBlogById = async (app: Express, blogId: string): Promise<blogViewModel> => {
    const blogResponse = await request(app)
        .get(`${BLOGS_PATH}/${blogId}`)
        .expect(httpStatuses.Ok)

    return blogResponse.body
}