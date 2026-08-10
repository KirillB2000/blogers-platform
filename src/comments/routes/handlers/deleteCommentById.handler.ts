import { Request, Response } from "express"
import { commentsService } from "../../application/comments.services"
import { httpStatuses } from "../../../core/types/http-statuses"
import { commentsQwRepository } from "../../repository/comments.queryRepository"

export const deleteCommentByIdHandler = async (
    req: Request<{commentId: string}>,
    res: Response
) => {
    const userId = req.user?.id as string
    const { commentId } = req.params

    if (!userId) return res.sendStatus(httpStatuses.Unauthorized)

    const comment = await commentsQwRepository.findById(commentId)
    if (comment.commentatorInfo.userId !== userId) return res.sendStatus(httpStatuses.Forbidden)
    
    await commentsService.delete(commentId)

    res.sendStatus(httpStatuses.NoContent)
}