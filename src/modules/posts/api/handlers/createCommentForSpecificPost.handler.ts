import { Request, Response } from "express"
import { CommentInputModel } from "../../../comments/api/input/dto/commentInputModel"
import { commentsService } from "../../../comments/application/comments.services"
import { postsQwRepository } from "../../infrastructure/posts.queryRepository"
import { commentsQwRepository } from "../../../comments/infrastructure/comments.queryRepository"
import { httpStatuses } from "../../../../core/types/http-statuses"
import { usersQwRepository } from "../../../../compostion-root"

export const createCommentForSpecificPostHandler = async (
    req: Request<{postId: string}, {}, CommentInputModel>,
    res: Response
) => {
    const userId = req.user?.id as string
    const { postId } = req.params
    const commentInput = req.body

    if (!userId) return res.sendStatus(httpStatuses.Unauthorized)

    const userById = await usersQwRepository.findById(userId)
    if (!userById) return res.sendStatus(httpStatuses.Unauthorized)

    const postById = await postsQwRepository.findById(postId)
    if (!postById) return res.sendStatus(httpStatuses.NotFound)
    
    const commentId = await commentsService.create(userById, postId, commentInput)

    const comment = await commentsQwRepository.findById(commentId)

    res.status(httpStatuses.Created).json(comment)

}