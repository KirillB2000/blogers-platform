import express from 'express'
import request from 'supertest'
import setupApp from '../../../src/setup-app'
import { postInputModel } from '../../../src/posts/dto/postInputModel'
import { createBlogDto } from '../../utils/blogs/createBlogDto'
import { clearDb } from '../../utils/clearDb'
import { POSTS_PATH } from '../../../src/posts/constants/posts.paths'
import { httpStatuses } from '../../../src/core/types/http-statuses'
import { createPostDto } from '../../utils/posts/createPostDto'
import { generateBasicAuthToken } from '../../utils/generateBasicAuthToken'



describe('Posts API body validation check', () => {
    const app = express()
    setupApp(app)

    const correctPostInputData: postInputModel = {
        title: 'Correct title',
        shortDescription: 'TesCorrectt description',
        content: 'Correct content',
        blogId: '1',
    }
    beforeAll (async () => {
        await clearDb(app)
    })

    it('Should not create post without authorization', async () => {
        const createdPost = await request(app)
            .post(POSTS_PATH)
            .send({
                ...correctPostInputData
            })
            .expect(httpStatuses.Unauthorized)

        expect(createdPost.body).toEqual({})
    })

    it ('Should not create post with incorrect input data', async () => {

        const incorrectPostBodyInput = await request(app)
            .post(POSTS_PATH)
            .set('Authorization', generateBasicAuthToken())
            .send({
                ...correctPostInputData,
                title: '   ',
                shortDescription: 12,
                content: '',
                blogId: '123',
            })
            .expect(httpStatuses.BadRequest)

        expect(incorrectPostBodyInput.body.errorsMessages).toHaveLength(4)
    })

    it ('Should not update post with incorrect input data', async () => {

        const post = await createPostDto(app)

        const incorrectPostBodyInput = await request(app)
            .put(`${POSTS_PATH}/${post.id}`)
            .set('Authorization', generateBasicAuthToken())
            .send({
                ...correctPostInputData,
                title: '   ',
                shortDescription: 12,
                content: '',
                blogId: '123',
            })
            .expect(httpStatuses.BadRequest)

        expect(incorrectPostBodyInput.body.errorsMessages).toHaveLength(4)
    })
})