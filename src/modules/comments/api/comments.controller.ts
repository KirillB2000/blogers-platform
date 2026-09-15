import { Request, Response } from "express"
import { httpStatuses } from "../../../core/types/http-statuses"
import { CommentsService } from "../application/comments.services"
import { CommentsQwRepository } from "../infrastructure/comments.queryRepository"
import { CommentInputModel } from "./input/dto/commentInputModel"

export class CommentsController {
    constructor (
        private commentsService: CommentsService,
        private commentsQwRepository: CommentsQwRepository
    ) {}

    async deleteCommentByIdHandler (
        req: Request<{ commentId: string }>,
        res: Response
    ) {
        const userId = req.user?.id as string
        const { commentId } = req.params

        if (!userId) return res.sendStatus(httpStatuses.Unauthorized)

        const comment = await this.commentsQwRepository.findById(commentId)
        if (comment.commentatorInfo.userId !== userId) return res.sendStatus(httpStatuses.Forbidden)

        await this.commentsService.delete(commentId)

        res.sendStatus(httpStatuses.NoContent)
    }

    async getCommentByIdHandler (
        req: Request<{ id: string }>,
        res: Response
    ) {
        const commentId = req.params.id
        const comment = await this.commentsQwRepository.findById(commentId)

        res.status(httpStatuses.Ok).json(comment)
    }

    async updateCommentByIdHandler (
        req: Request<{ commentId: string }, {}, CommentInputModel>,
        res: Response
    ) {
        const userId = req.user?.id as string
        const { commentId } = req.params
        const content = req.body

        if (!userId) return res.sendStatus(httpStatuses.Unauthorized)

        const commentById = await this.commentsQwRepository.findById(commentId)
        if (commentById.commentatorInfo.userId !== userId) return res.sendStatus(httpStatuses.Forbidden)

        await this.commentsService.update(commentId, content)

        res.sendStatus(httpStatuses.NoContent)
    }
}