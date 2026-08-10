import { httpStatuses } from "../../../core/types/http-statuses";
import { CommentInputModel } from "../../input/dto/commentInputModel";
import { Request, Response } from "express";
import { commentsQwRepository } from "../../repository/comments.queryRepository";
import { commentsService } from "../../application/comments.services";

export const updateCommentByIdHandler = async (
    req: Request<{commentId: string}, {}, CommentInputModel>,
    res: Response
) => {
    const userId = req.user?.id as string
    const { commentId } = req.params
    const content = req.body
    
    if (!userId) return res.sendStatus(httpStatuses.Unauthorized)
        
    const commentById = await commentsQwRepository.findById(commentId)
    if (commentById.commentatorInfo.userId !== userId) return res.sendStatus(httpStatuses.Forbidden)

    await commentsService.update(commentId, content)

    res.sendStatus(httpStatuses.NoContent)
}