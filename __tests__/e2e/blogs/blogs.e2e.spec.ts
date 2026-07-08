import express from 'express';
import setupApp from '../../../src/setup-app'
import request from 'supertest'
import { httpStatuses } from '../../../src/core/types/http-statuses';
import { blogInputModel } from '../../../src/blogs/dto/blogInputModel';
import { BLOGS_PATH } from '../../../src/blogs/constants/blogs.paths';
import { blogDto } from '../../utils/blogs/blogDto';
import { createBlogDto } from '../../utils/blogs/createBlogDto';
import { updateBlogById } from '../../utils/blogs/updateBlogById';
import { getBlogById } from '../../utils/blogs/getBlogById';
import { clearDb } from '../../utils/clearDb';
import { generateBasicAuthToken } from '../../utils/generateBasicAuthToken';

describe ('Blogs API', () => {
    const app = express()
    setupApp(app)

    const adminToken = generateBasicAuthToken()

    beforeAll(async () => {
        await clearDb(app);
    })

    it('Should create new blog; POST /api/blogs', async () => {
        const newBlogDto: blogInputModel = {
            ...blogDto(),
            name: 'Test name2',
            description: 'Test description2',
            websiteUrl: 'https://example2.com'
        }

        const createdBlog = await createBlogDto(app, newBlogDto)

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

    it('Should get blog by id; GET /api/blogs/:id', async() => {
        const createdBlog = await createBlogDto(app)
        
        const blogById = await getBlogById(app, createdBlog.id)

        expect(blogById).toEqual({
            id: expect.any(String),
            name: 'Test name',
            description: 'Test description',
            websiteUrl: expect.stringMatching(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
        })
    })

    it('Should update blog by id; PUT /api/blogs/:id', async ()  => {
        const createdBlog = await createBlogDto(app)

        const updateBlogDto = {
            ...blogDto(),
            name: 'Updated name',
            description: 'Updated description',
            websiteUrl: 'https://updatedexample2.com'
        }

        await updateBlogById(app, createdBlog.id, updateBlogDto)

        const updatedBlog = await getBlogById(app, createdBlog.id)

        expect(updatedBlog).toEqual({
            id: expect.any(String),
            name: updateBlogDto.name,
            description: updateBlogDto.description,
            websiteUrl: updateBlogDto.websiteUrl
        })
    })

    it('Should delete blog by id; DELETE /api/blogs/:id', async () => {
        const existedBlog = await createBlogDto(app);

        await request(app)
            .delete(`${BLOGS_PATH}/${existedBlog.id}`)
            .set('Authorization', adminToken)
            .expect(httpStatuses.NoContent)

        await request(app)
            .get(`${BLOGS_PATH}/${existedBlog.id}`)
            .expect(httpStatuses.NotFound)
    })
})