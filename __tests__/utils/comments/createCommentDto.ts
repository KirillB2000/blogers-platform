import { Express } from "express"
import request from 'supertest'
import { generateTestAccessJwt } from "../generateJwt"
import { commentDto } from "./commentDto"
import { httpStatuses } from "../../../src/core/types/http-statuses"
import { COMMENTS_PATH } from "../../../src/modules/comments/constants/comments.paths"
import { CommentViewModel } from "../../../src/modules/comments/api/output/commentViewModel"
import { POSTS_PATH } from "../../../src/modules/posts/constants/posts.paths"
import { UserViewModel } from "../../../src/modules/users/api/output/userViewModel"

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