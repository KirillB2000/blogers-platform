import { Request, Response } from "express"
import { UnauthorizedError } from "../../../../core/exceptions/app-errors.exeption"

export const getSecurityDevicesListHandler = (
    req: Request,
    res: Response
) => {
    const { refreshToken } = req.cookies as AuthCookies

    if (!refreshToken) {
        throw new UnauthorizedError('Unauthorized')
    }

    
}