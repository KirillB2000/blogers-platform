import { NextFunction, Request, Response } from "express"
import { container } from "../../compostion-root"
import { JwtService } from "../../modules/auth/adapters/jwt.services"

const jwtService = container.get(JwtService)

export const softAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.headers.authorization) {
        req.user = null
        return next()
    }

    const [ authType, token ] = req.headers.authorization?.split(' ') 

    const payload = await jwtService.getUserIdByAccessToken(token)

    if (payload) {
        req.user = { id: payload.userId }
        return next()
    }

    req.user = null
    return next()
}