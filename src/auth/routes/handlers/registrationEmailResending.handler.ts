import { Request, Response } from "express"
import { RegistrationEmailResendingInputModel } from "../../input/dto/registrationEmailResendingInputModel"
import { userQwRepository } from "../../../users/repository/user.queryRepository"
import { authService } from "../../domain/auth.services"
import { httpStatuses } from "../../../core/types/http-statuses"

export const registrationEmailResendingHandler = async (
    req: Request<{}, {}, RegistrationEmailResendingInputModel>,
    res: Response
) => {

    const { email } = req.body
    const userByEmail = await userQwRepository.findByEmail(email)

    await authService.emailResending(userByEmail)

    res.sendStatus(httpStatuses.NoContent)
}