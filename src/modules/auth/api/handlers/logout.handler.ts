import { Request, Response } from "express"
import { UnauthorizedError } from "../../../../core/exceptions/app-errors.exeption"
import { authService } from "../../application/auth.services"
import { httpStatuses } from "../../../../core/types/http-statuses"

export const logoutHandler = async (
    req: Request,
    res: Response
) => {
    const { refreshToken } = req.cookies as AuthCookies

    if (!refreshToken) {
        throw new UnauthorizedError('Unauthorized')
    }

    await authService.logout(refreshToken)

    res.sendStatus(httpStatuses.NoContent)
}