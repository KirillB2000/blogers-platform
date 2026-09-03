import express from 'express'
import setupApp from '../../../src/setup-app'
import { runDB, stopDb } from '../../../src/db/mongo.db'
import { SETTINGS } from '../../../src/settings/config'
import { commentsCollection, postsCollection, usersCollection } from '../../../src/db/collections'
import request from 'supertest'
import { httpStatuses } from '../../../src/core/types/http-statuses'
import { createPostDto } from '../../utils/posts/createPostDto'
import { createUserDto } from '../../utils/users/createUserDto'
import { createCommentDto } from '../../utils/comments/createCommentDto'
import { commentDto } from '../../utils/comments/commentDto'
import { COMMENTS_PATH } from '../../../src/modules/comments/constants/comments.paths'
import { CommentInputModel } from '../../../src/modules/comments/api/input/dto/commentInputModel'

describe('Users API', () => {
    const app = express()
    setupApp(app)

    beforeAll( async () => {
        await runDB(SETTINGS.MONGO_URL)
    })

    beforeEach(async () => {
        await commentsCollection.deleteMany({})
        await usersCollection.deleteMany({})
        await postsCollection.deleteMany({})
    })

    afterAll(async () => {
        await stopDb()
    })

    it('Should get comment by id; GET /comments/:id', async () => {
        const existedPost = await createPostDto(app)
        const existedUser = await createUserDto(app)
    
        const {body: comment, token} = await createCommentDto(app, existedPost.id, existedUser)

        const response = await request(app)
            .get(`${COMMENTS_PATH}/${comment.id}`)
            .expect(httpStatuses.Ok)
        
        expect(response.body).toEqual({
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt
        })
    }),

    it('Should delete comment by id; DELETE /comments/:commentId', async () => {
        const existedPost = await createPostDto(app)
        const existedUser = await createUserDto(app)

        const {body: existedComment, token} = await createCommentDto(app, existedPost.id, existedUser)

        await request(app)
            .delete(`${COMMENTS_PATH}/${existedComment.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(httpStatuses.NoContent)

        await request(app)
            .get(`${COMMENTS_PATH}/${existedComment.id}`)
            .expect(httpStatuses.NotFound)
    })

    it('Should update comment by id; PUT /comments/:commentId', async () => {
        const commentDtoBody: CommentInputModel = {
            ...commentDto(),
            content: 'Updated content with correct length between 20 and 300 chars'
        }

        const existedPost = await createPostDto(app)
        const existedUser = await createUserDto(app)

        const { body: existedComment, token } = await createCommentDto(app, existedPost.id, existedUser)

        await request(app)
            .put(`${COMMENTS_PATH}/${existedComment.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(commentDtoBody)
            .expect(httpStatuses.NoContent)

        const response = await request(app)
            .get(`${COMMENTS_PATH}/${existedComment.id}`)
            .expect(httpStatuses.Ok)

        expect(response.body.content).toEqual(commentDtoBody.content)
    })
})