import { Request, Response } from "express";
import { httpStatuses } from "../../../core/types/http-statuses";
import { userQwRepository } from "../../../users/repository/user.queryRepository";

export const meHandler = async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    if (!userId) return res.sendStatus(httpStatuses.Unauthorized)
    
    const me = await userQwRepository.findByIdMe(userId)

    res.status(httpStatuses.Ok).json(me)
}