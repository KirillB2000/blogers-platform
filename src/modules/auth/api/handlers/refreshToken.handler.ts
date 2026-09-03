import { Request, Response } from "express"
import { UnauthorizedError } from "../../../../core/exceptions/app-errors.exeption"
import { authService } from "../../application/auth.services"
import { httpStatuses } from "../../../../core/types/http-statuses"
import { LoginSuccessViewModel } from "../output/accessToken-output.type"


export const refreshTokenHadler = async (
    req: Request,
    res: Response
) => {
    const { refreshToken } = req.cookies as AuthCookies

    if (!refreshToken) {
        throw new UnauthorizedError('Unauthorized')
    }

    const { newRefreshToken, newAccessToken } = await authService.refreshToken(refreshToken)

    const newAccessTokenForResponse: LoginSuccessViewModel = { accessToken: newAccessToken }

    res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true, sameSite: "strict"})
    res.status(httpStatuses.Ok).send(newAccessTokenForResponse)
}