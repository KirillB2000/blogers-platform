import { Express } from "express"
import { UserViewModel } from "../../../src/users/output/userViewModel"
import request from 'supertest'
import { COMMENTS_PATH } from "../../../src/comments/constants/comments.paths"
import { POSTS_PATH } from "../../../src/posts/constants/posts.paths"
import { generateTestAccessJwt } from "../generateJwt"
import { commentDto } from "./commentDto"
import { httpStatuses } from "../../../src/core/types/http-statuses"
import { CommentViewModel } from "../../../src/comments/output/commentViewModel"

export const createCommentDto = async (
    app: Express,
    postId: string,
    user: UserViewModel
): Promise<{body: CommentViewModel, token: string}> => {
    const token = generateTestAccessJwt(user)
    const testCommentData = { ...commentDto() }
    const response = await request(app)
        .post(`${POSTS_PATH}/${postId}${COMMENTS_PATH}`)
        .set('Authorization', `Bearer ${token}`)
        .send(testCommentData)
        .expect(httpStatuses.Created)

    const responseWithToken = {
        body: response.body,
        token: token
    }
    return responseWithToken
}