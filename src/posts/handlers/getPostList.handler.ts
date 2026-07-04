import { Request, Response } from "express"
import { postsRepository } from "../repositories/posts.repository"
import { httpStatuses } from "../../core/types/http-statuses"

export const getPostListHandler = (req: Request, res: Response) => {
    res.status(httpStatuses.Ok).json(postsRepository.findAll())
}