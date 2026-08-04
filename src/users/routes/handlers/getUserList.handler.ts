import { Request, Response } from "express"
import { UserQueryInput } from "../../input/user-query.input"
import { userQwRepository } from "../../repository/user.queryRepository"
import { UserListPaginatorOutput } from "../../output/userListPaginatorOutput"
import { httpStatuses } from "../../../core/types/http-statuses"

export const getUserListHandler = async (
    req: Request<{}, {}, {}, UserQueryInput>,
    res: Response
) => {
    const queryInput = req.query
    const userListWithPagination: UserListPaginatorOutput = await userQwRepository.findMany(queryInput)

    res.status(httpStatuses.Ok).json(userListWithPagination)
}