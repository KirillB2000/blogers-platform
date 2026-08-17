import { Request, Response } from "express"
import { RegistrationConfirmationCodeInputModel } from "../../input/dto/registrationConfirmationCodeInputModel"
import { authService } from "../../domain/auth.services"
import { userQwRepository } from "../../../users/repository/user.queryRepository"
import { httpStatuses } from "../../../core/types/http-statuses"

export const registrationConfirmationHandler = async (
    req: Request<{}, {}, RegistrationConfirmationCodeInputModel>,
    res: Response
) => {

    const { code } = req.body

    const userByCode = await userQwRepository.findByConfiramationCode(code)

    await authService.emailConfirmation(userByCode)

    res.sendStatus(httpStatuses.NoContent)
}