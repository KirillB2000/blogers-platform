import { Request, Response } from "express"
import { CommentInputModel } from "../../../comments/input/dto/commentInputModel"
import { commentsService } from "../../../comments/application/comments.services"
import { httpStatuses } from "../../../core/types/http-statuses"
import { userQwRepository } from "../../../users/repository/user.queryRepository"
import { postsQwRepository } from "../../repositories/posts.queryRepository"
import { commentsQwRepository } from "../../../comments/repository/comments.queryRepository"

export const createCommentForSpecificPostHandler = async (
    req: Request<{postId: string}, {}, CommentInputModel>,
    res: Response
) => {
    const userId = req.user?.id as string
    const { postId } = req.params
    const commentInput = req.body

if (!userId) return res.sendStatus(httpStatuses.Unauthorized)

    const userById = await userQwRepository.findById(userId)
if (!userById) return res.sendStatus(httpStatuses.Unauthorized)

    const postById = await postsQwRepository.findById(postId)
if (!postById) return res.sendStatus(httpStatuses.NotFound)
    
    const commentId = await commentsService.create(userById, postId, commentInput)

    const comment = await commentsQwRepository.findById(commentId)

    res.status(httpStatuses.Created).json(comment)

}