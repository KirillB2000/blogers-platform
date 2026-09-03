import { Request, Response } from "express"
import { httpStatuses } from "../../../../core/types/http-statuses"
import { authService } from "../../application/auth.services"
import { RegistrationEmailResendingInputModel } from "../input/dto/registrationEmailResendingInputModel"
import { userQwRepository } from "../../../users/infrastructure/user.queryRepository"


export const registrationEmailResendingHandler = async (
    req: Request<{}, {}, RegistrationEmailResendingInputModel>,
    res: Response
) => {

    const { email } = req.body
    const userByEmail = await userQwRepository.findByEmail(email)

    await authService.emailResending(userByEmail)

    res.sendStatus(httpStatuses.NoContent)
}