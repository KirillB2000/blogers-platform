import { Request, Response } from "express"
import { httpStatuses } from "../../../../core/types/http-statuses"
import { userQwRepository } from "../../infrastructure/user.queryRepository"
import { UserQueryInput } from "../input/user-query.input"
import { UserListPaginatorOutput } from "../output/userListPaginatorOutput"

export const getUserListHandler = async (
    req: Request<{}, {}, {}, UserQueryInput>,
    res: Response
) => {
    const queryInput = req.query
    const userListWithPagination: UserListPaginatorOutput = await userQwRepository.findMany(queryInput)

    res.status(httpStatuses.Ok).json(userListWithPagination)
}