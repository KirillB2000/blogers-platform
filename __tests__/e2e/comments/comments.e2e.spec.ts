import express from 'express'
import setupApp from '../../../src/setup-app'
import { runDB, stopDb } from '../../../src/db/mongo.db'
import { SETTINGS } from '../../../src/settings/config'
import { commentsCollection } from '../../../src/db/collections'
import request from 'supertest'
import { generateBasicAuthToken } from '../../utils/generateBasicAuthToken'
import { httpStatuses } from '../../../src/core/types/http-statuses'
import { createPostDto } from '../../utils/posts/createPostDto'
import { createUserDto } from '../../utils/users/createUserDto'
import { createCommentDto } from '../../utils/comments/createCommentDto'
import { COMMENTS_PATH, COMMENTS_ROUTES } from '../../../src/comments/constants/comments.paths'
import { clearDb } from '../../utils/clearDb'

describe('Users API', () => {
    const app = express()
    setupApp(app)

    const adminToken = generateBasicAuthToken()

    beforeAll(async () => {
        await runDB(SETTINGS.MONGO_URL)
        await clearDb(app);
    })

    afterAll(async () => {
        await stopDb()
    })

    it('Should get comment by id; GET /comments/:id', async () => {
        const existedPost = await createPostDto(app)
        const existedUser = await createUserDto(app)
    
        const comment = await createCommentDto(app, existedPost.id, existedUser)

        const response = await request(app)
            .get(`${COMMENTS_PATH}/${comment.id}`)
            expect(httpStatuses.Ok)
        
        expect(response.body).toEqual({
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt
        })
    })
})