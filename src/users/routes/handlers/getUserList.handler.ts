import { Request, Response } from "express"
import { UserQueryInput } from "../../input/user-query.input"
import { userQwRepository } from "../../repository/user.queryRepository"

export const getUserListHandler = async (
    req: Request<{}, {}, {}, UserQueryInput>,
    res: Response
) => {
    const queryInput = req.query
    const {items, totalCount } = await userQwRepository.findMany(queryInput)
}