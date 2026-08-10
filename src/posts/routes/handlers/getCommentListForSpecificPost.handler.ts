import { Request, Response } from "express"
import { CommentQueryInput } from "../../../comments/input/commentQueryInput"
import { postsQwRepository } from "../../repositories/posts.queryRepository"
import { httpStatuses } from "../../../core/types/http-statuses"
import { CommentListPaginatorOutput } from "../../../comments/output/commentListPaginatorOutput"
import { commentsQwRepository } from "../../../comments/repository/comments.queryRepository"

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