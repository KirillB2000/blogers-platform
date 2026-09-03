import { Request, Response } from "express"
import { httpStatuses } from "../../../../core/types/http-statuses"
import { authService } from "../../application/auth.services"
import { RegistrationConfirmationCodeInputModel } from "../input/dto/registrationConfirmationCodeInputModel"
import { userQwRepository } from "../../../users/infrastructure/user.queryRepository"


export const registrationConfirmationHandler = async (
    req: Request<{}, {}, RegistrationConfirmationCodeInputModel>,
    res: Response
) => {

    const { code } = req.body

    const userByCode = await userQwRepository.findByConfiramationCode(code)

    await authService.emailConfirmation(userByCode)

    res.sendStatus(httpStatuses.NoContent)
}