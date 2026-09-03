import { Request, Response } from "express"
import { CommentQueryInput } from "../../../comments/api/input/commentQueryInput"
import { postsQwRepository } from "../../infrastructure/posts.queryRepository"
import { CommentListPaginatorOutput } from "../../../comments/api/output/commentListPaginatorOutput"
import { commentsQwRepository } from "../../../comments/infrastructure/comments.queryRepository"
import { httpStatuses } from "../../../../core/types/http-statuses"

export const getCommentListForSpecificPostHandler = async (
    req: Request<{postId: string}, {}, {}, CommentQueryInput>,
    res: Response
) => {
    const { postId } = req.params
    const queryInput = req.query

    await postsQwRepository.findById(postId) // throw 404 внутри repo

    const comments: CommentListPaginatorOutput = await commentsQwRepository.findAll(queryInput, postId)

    res.status(httpStatuses.Ok).json(comments)
}