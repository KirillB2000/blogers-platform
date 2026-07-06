import express from 'express'
import setupApp from '../../../src/setup-app'
import request from 'supertest'
import { TESTING_PATH, TESTING_ROUTES } from '../../../src/testing/constants/testing.paths';
import { httpStatuses } from '../../../src/core/types/http-statuses';
import { createPostDto } from '../../utils/posts/createPostDto';
import { postViewModel } from '../../../src/posts/types/postViewModel';
import { POSTS_PATH } from '../../../src/posts/constants/posts.paths';

describe ('Posts API', () => {
    const app = express()
    setupApp(app)

    beforeAll(async () => {
       await request(app)
        .delete(`${TESTING_PATH}${TESTING_ROUTES.ALL_DATA}`)
        .expect(httpStatuses.NoContent)
    })

    it('Should create new post; POST /api/posts', async () => {
        const createdPost: postViewModel = await createPostDto(app)
        expect(createdPost).toEqual({
            id: expect.any(String),
            title: 'Test title',
            shortDescription: 'Test description',
            content: 'Test content',
            blogId: expect.any(String),
            blogName: expect.any(String)
        })
    })

    it('Should get post list; GET /api/posts', async () => {
        await createPostDto(app)
        await createPostDto(app)

        const response = await request(app)
                    .get(POSTS_PATH)
                    .expect(httpStatuses.Ok)

        console.log(response.body)
        
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThanOrEqual(2)
    })
})