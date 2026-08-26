import { Request, Response } from "express"
import { httpStatuses } from "../../../../core/types/http-statuses"
import { userQwRepository } from "../../../../users/repository/user.queryRepository"
import { authService } from "../../../domain/auth.services"
import { RegistrationConfirmationCodeInputModel } from "../../../input/dto/registrationConfirmationCodeInputModel"


export const registrationConfirmationHandler = async (
    req: Request<{}, {}, RegistrationConfirmationCodeInputModel>,
    res: Response
) => {

    const { code } = req.body

    const userByCode = await userQwRepository.findByConfiramationCode(code)

    await authService.emailConfirmation(userByCode)

    res.sendStatus(httpStatuses.NoContent)
}