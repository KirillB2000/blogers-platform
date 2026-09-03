import { Request, Response } from "express"
import { httpStatuses } from "../../../../core/types/http-statuses"
import { usersService } from "../../application/users.services"

export const deleteUserHandler = async (
    req: Request<{id: string}>, 
    res: Response
) => {
    await usersService.delete(req.params.id)

    res.sendStatus(httpStatuses.NoContent)
}