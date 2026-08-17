import { Request, Response } from "express"
import { UserInputModel } from "../../../users/input/dto/userInputModel"
import { authService } from "../../domain/auth.services"
import { httpStatuses } from "../../../core/types/http-statuses"

export const registrationHandler = async (
    req: Request<{}, {}, UserInputModel>,
    res: Response
) => {
    const userDto = req.body

    await authService.registerUser(userDto)

    res.sendStatus(httpStatuses.NoContent) 
}