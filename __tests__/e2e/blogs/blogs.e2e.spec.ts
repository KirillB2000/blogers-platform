import express from 'express';
import setupApp from '../../../src/setup-app'
import request from 'supertest'
import { TESTING_PATH, TESTING_ROUTES } from '../../../src/testing/constants/testing.paths';
import { httpStatuses } from '../../../src/core/types/http-statuses';
import { blogInputModel } from '../../../src/blogs/dto/blogInputModel';
import { BLOGS_PATH } from '../../../src/blogs/constants/blogs.paths';
import { getBlogDto } from '../../utils/blogs/getBlogDto';
import { createBlogDto } from '../../utils/blogs/createBlogDto';

describe ('Blogs API', () => {
    const app = express()
    setupApp(app)

    beforeAll(async () => {
       await request(app)
        .delete(`${TESTING_PATH}${TESTING_ROUTES.ALL_DATA}`)
        .expect(httpStatuses.NoContent)
    })

    it('Should create new blog; POST /api/blogs', async () => {
        const newBlog: blogInputModel = {
            ...getBlogDto(),
            name: 'Test name2',
            description: 'Test description2',
            websiteUrl: 'https://example2.com'
        }

        const createdBlog = await createBlogDto(app, newBlog)

        expect(createdBlog).toEqual({
            id: expect.any(String),
            name: 'Test name2',
            description: 'Test description2',
            websiteUrl: expect.stringMatching(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
        })
    })

    it('Should get blog list; GET /api/blogs', async () => {
        await createBlogDto(app)
        await createBlogDto(app)

        const response = await request(app)
            .get(BLOGS_PATH)
            .expect(httpStatuses.Ok)

        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThanOrEqual(2)
    })
})