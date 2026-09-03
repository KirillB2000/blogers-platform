import { Request, Response } from "express"
import { httpStatuses } from "../../../../core/types/http-statuses"
import { authService } from "../../application/auth.services"
import { UserInputModel } from "../../../users/api/input/dto/userInputModel"

export const registrationHandler = async (
    req: Request<{}, {}, UserInputModel>,
    res: Response
) => {
    const userDto = req.body

    await authService.registerUser(userDto)

    res.sendStatus(httpStatuses.NoContent) 
}