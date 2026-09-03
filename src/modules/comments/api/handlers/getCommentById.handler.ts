import { Request, Response } from "express";
import { commentsQwRepository } from "../../infrastructure/comments.queryRepository";
import { httpStatuses } from "../../../../core/types/http-statuses";

export const getCommentByIdHandler = async (
    req: Request<{id: string}>,
    res: Response
) => {
    const commentId = req.params.id
    const comment = await commentsQwRepository.findById(commentId)

    res.status(httpStatuses.Ok).json(comment)
}