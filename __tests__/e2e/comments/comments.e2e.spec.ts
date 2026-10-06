import express from 'express'
import setupApp from '../../../src/setup-app'
import request from 'supertest'
import { httpStatuses } from '../../../src/core/types/http-statuses'
import { createPostDto } from '../../utils/posts/createPostDto'
import { createUserDto } from '../../utils/users/createUserDto'
import { createCommentDto } from '../../utils/comments/createCommentDto'
import { commentDto } from '../../utils/comments/commentDto'
import { COMMENTS_PATH, COMMENTS_ROUTES } from '../../../src/modules/comments/constants/comments.paths'
import { CommentInputModel } from '../../../src/modules/comments/api/input/dto/commentInputModel'
import { runDb, stopDb } from '../../../src/db/mongoose.db'
import { PostsModel } from '../../../src/modules/posts/infrastructure/posts.model'
import { UsersModel } from '../../../src/modules/users/infrastructure/users.model'
import { CommentsModel } from '../../../src/modules/comments/infrastructure/comments.model'
import { generateTestAccessJwt } from '../../utils/generateJwt'
import { LikeInputModel } from '../../../src/modules/comments/api/input/dto/likeInputModel'
import { LikeStatus } from '../../../src/core/types/likeStatus'

describe('Comments API', () => {
    const app = express()
    setupApp(app)

    beforeAll( async () => {
        await runDb()
    })

    beforeEach(async () => {
        await CommentsModel.deleteMany({})
        await UsersModel.deleteMany({})
        await PostsModel.deleteMany({})
    })

    afterAll(async () => {
        await stopDb()
    })

    it('Should get comment by id; GET /comments/:id', async () => {
        const existedPost = await createPostDto(app)
        const existedUser = await createUserDto(app)
    
        const {body: comment } = await createCommentDto(app, existedPost.id, existedUser)

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
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: comment.likesInfo.myStatus
            }
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

    it('Should update like information; PUT /comment/:commentId/like-status', async () => {

        // # First like for the comment from user userToLike1 to userWithComment

        const existedPost = await createPostDto(app) 
        const userWithComment = await createUserDto(app)
        
        const { body: comment } = await createCommentDto(app, existedPost.id, userWithComment)
        
        const userToLike1 = await createUserDto(
            app,
            {
                email: 'UserToLike@example.com',
                login: 'UserToLike',
                password: '123123123123'
            } 
        )
        
        const userToLikeToken1 = generateTestAccessJwt(userToLike1)
        let likeStatusInput: LikeInputModel = {
            likeStatus: LikeStatus.Like
        }
    
        await request(app)
            .put(`${COMMENTS_PATH}/${comment.id}${COMMENTS_ROUTES.LIKE_STATUS}`)
            .set('Authorization', `Bearer ${userToLikeToken1}`)
            .send(likeStatusInput)
            .expect(httpStatuses.NoContent)

        const responseAfterLike = await request(app)
            .get(`${COMMENTS_PATH}/${comment.id}`)
            .set('Authorization', `Bearer ${userToLikeToken1}`)
            .expect(httpStatuses.Ok)

        expect(responseAfterLike.body.likesInfo.likesCount).toBe(1)
        expect(responseAfterLike.body.likesInfo.myStatus).toBe(LikeStatus.Like)

        // # UserToLike1 try to like comment of userWithComment after he left like earlier

        await request(app)
            .put(`${COMMENTS_PATH}/${comment.id}${COMMENTS_ROUTES.LIKE_STATUS}`)
            .set('Authorization', `Bearer ${userToLikeToken1}`)
            .send(likeStatusInput)
            .expect(httpStatuses.NoContent)

        const responseAfterLike2 = await request(app)
            .get(`${COMMENTS_PATH}/${comment.id}`)
            .set('Authorization', `Bearer ${userToLikeToken1}`)
            .expect(httpStatuses.Ok)

        expect(responseAfterLike2.body.likesInfo.likesCount).toBe(1)
        expect(responseAfterLike2.body.likesInfo.myStatus).toBe(LikeStatus.Like)

        // # Dislike from user userToLike1 to userWithComment after left like earlier

        likeStatusInput.likeStatus = LikeStatus.Dislike

        await request(app)
            .put(`${COMMENTS_PATH}/${comment.id}${COMMENTS_ROUTES.LIKE_STATUS}`)
            .set('Authorization', `Bearer ${userToLikeToken1}`)
            .send(likeStatusInput)
            .expect(httpStatuses.NoContent)

        const responseAfterDislike1 = await request(app)
            .get(`${COMMENTS_PATH}/${comment.id}`)
            .set('Authorization', `Bearer ${userToLikeToken1}`)
            .expect(httpStatuses.Ok)

        expect(responseAfterDislike1.body.likesInfo.likesCount).toBe(0)
        expect(responseAfterDislike1.body.likesInfo.dislikesCount).toBe(1)
        expect(responseAfterDislike1.body.likesInfo.myStatus).toBe(LikeStatus.Dislike)

        // # UserToLike1 try to dislike comment of userWithComment after he left dislike 
        
        await request(app)
            .put(`${COMMENTS_PATH}/${comment.id}${COMMENTS_ROUTES.LIKE_STATUS}`)
            .set('Authorization', `Bearer ${userToLikeToken1}`)
            .send(likeStatusInput)
            .expect(httpStatuses.NoContent)

        const responseAfterDislike2 = await request(app)
            .get(`${COMMENTS_PATH}/${comment.id}`)
            .set('Authorization', `Bearer ${userToLikeToken1}`)
            .expect(httpStatuses.Ok)

        expect(responseAfterDislike2.body.likesInfo.dislikesCount).toBe(1)
        expect(responseAfterDislike2.body.likesInfo.myStatus).toBe(LikeStatus.Dislike)

        // UserToLike1 send none status after dislike to userWithComment's comment

        likeStatusInput.likeStatus = LikeStatus.None

        await request(app)
            .put(`${COMMENTS_PATH}/${comment.id}${COMMENTS_ROUTES.LIKE_STATUS}`)
            .set('Authorization', `Bearer ${userToLikeToken1}`)
            .send(likeStatusInput)
            .expect(httpStatuses.NoContent)

        const responseAfterNone1 = await request(app)
            .get(`${COMMENTS_PATH}/${comment.id}`)
            .set('Authorization', `Bearer ${userToLikeToken1}`)
            .expect(httpStatuses.Ok)

        expect(responseAfterNone1.body.likesInfo.dislikesCount).toBe(0)
        expect(responseAfterNone1.body.likesInfo.likesCount).toBe(0)
        expect(responseAfterNone1.body.likesInfo.myStatus).toBe(LikeStatus.None)

        // Return like and make it none

        likeStatusInput.likeStatus = LikeStatus.Like

        await request(app)
            .put(`${COMMENTS_PATH}/${comment.id}${COMMENTS_ROUTES.LIKE_STATUS}`)
            .set('Authorization', `Bearer ${userToLikeToken1}`)
            .send(likeStatusInput)
            .expect(httpStatuses.NoContent)

        await request(app)
            .get(`${COMMENTS_PATH}/${comment.id}`)
            .set('Authorization', `Bearer ${userToLikeToken1}`)
            .expect(httpStatuses.Ok)

        likeStatusInput.likeStatus = LikeStatus.None

        await request(app)
            .put(`${COMMENTS_PATH}/${comment.id}${COMMENTS_ROUTES.LIKE_STATUS}`)
            .set('Authorization', `Bearer ${userToLikeToken1}`)
            .send(likeStatusInput)
            .expect(httpStatuses.NoContent)

        const responseAfterLike3 = await request(app)
            .get(`${COMMENTS_PATH}/${comment.id}`)
            .set('Authorization', `Bearer ${userToLikeToken1}`)
            .expect(httpStatuses.Ok)

        expect(responseAfterLike3.body.likesInfo.dislikesCount).toBe(0)
        expect(responseAfterLike3.body.likesInfo.likesCount).toBe(0)
        expect(responseAfterLike3.body.likesInfo.myStatus).toBe(LikeStatus.None)
    })
})